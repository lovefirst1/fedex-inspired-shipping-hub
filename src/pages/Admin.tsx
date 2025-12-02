import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { currencies } from "@/data/currencies";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    tracking_code: "",
    sender_name: "",
    sender_address: "",
    receiver_name: "",
    receiver_address: "",
    package_description: "",
    package_weight: "",
    origin_city: "",
    origin_country: "",
    destination_city: "",
    destination_country: "",
    current_location: "",
    status: "pending",
    estimated_delivery_date: "",
    held_by_customs: false,
    notes: "",
    currency: "USD",
    package_value: "",
    shipping_fee: "",
    delivery_days: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    if (!profileData?.is_admin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin permissions. Please contact support to become an admin.",
        variant: "destructive",
      });
    }

    fetchShipments();
  };

  const fetchShipments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setShipments(data || []);
    }
    setLoading(false);
  };

  const generateTrackingCode = () => {
    const prefix = "SX";
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${random}`;
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    const trackingCode = formData.tracking_code || generateTrackingCode();

    const { data, error } = await supabase
      .from("shipments")
      .insert([
        {
          tracking_code: trackingCode,
          sender_name: formData.sender_name,
          sender_address: formData.sender_address,
          receiver_name: formData.receiver_name,
          receiver_address: formData.receiver_address,
          package_description: formData.package_description,
          package_weight: formData.package_weight ? parseFloat(formData.package_weight) : null,
          origin_city: formData.origin_city,
          origin_country: formData.origin_country,
          destination_city: formData.destination_city,
          destination_country: formData.destination_country,
          current_location: formData.current_location,
          status: formData.status,
          estimated_delivery_date: formData.estimated_delivery_date || null,
          held_by_customs: formData.held_by_customs,
          notes: formData.notes,
          currency: formData.currency,
          package_value: formData.package_value ? parseFloat(formData.package_value) : null,
          shipping_fee: formData.shipping_fee ? parseFloat(formData.shipping_fee) : null,
          delivery_days: formData.delivery_days ? parseInt(formData.delivery_days) : null,
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Add initial timeline entry
    await supabase.from("shipment_timeline").insert([
      {
        shipment_id: data.id,
        status: formData.status,
        location: formData.origin_city,
        description: "Shipment created",
      },
    ]);

    toast({
      title: "Success!",
      description: `Shipment created with tracking code: ${trackingCode}`,
    });

    setDialogOpen(false);
    resetForm();
    fetchShipments();
  };

  const resetForm = () => {
    setFormData({
      tracking_code: "",
      sender_name: "",
      sender_address: "",
      receiver_name: "",
      receiver_address: "",
      package_description: "",
      package_weight: "",
      origin_city: "",
      origin_country: "",
      destination_city: "",
      destination_country: "",
      current_location: "",
      status: "pending",
      estimated_delivery_date: "",
      held_by_customs: false,
      notes: "",
      currency: "USD",
      package_value: "",
      shipping_fee: "",
      delivery_days: "",
    });
  };

  const handleDeleteShipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;

    const { error } = await supabase.from("shipments").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Shipment deleted successfully",
      });
      fetchShipments();
    }
  };

  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You need admin permissions to access this page.
            </p>
            <Button onClick={() => navigate("/")} variant="default">
              Go to Homepage
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage shipments and tracking</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateShipment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tracking Code (optional)</Label>
                      <Input
                        placeholder="Auto-generated if left empty"
                        value={formData.tracking_code}
                        onChange={(e) => setFormData({ ...formData, tracking_code: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in transit">In Transit</SelectItem>
                          <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Sender Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sender Name *</Label>
                        <Input
                          required
                          value={formData.sender_name}
                          onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sender Address *</Label>
                        <Input
                          required
                          value={formData.sender_address}
                          onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Origin City *</Label>
                        <Input
                          required
                          value={formData.origin_city}
                          onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Origin Country *</Label>
                        <Input
                          required
                          value={formData.origin_country}
                          onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Receiver Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Receiver Name *</Label>
                        <Input
                          required
                          value={formData.receiver_name}
                          onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Receiver Address *</Label>
                        <Input
                          required
                          value={formData.receiver_address}
                          onChange={(e) => setFormData({ ...formData, receiver_address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Destination City *</Label>
                        <Input
                          required
                          value={formData.destination_city}
                          onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Destination Country *</Label>
                        <Input
                          required
                          value={formData.destination_country}
                          onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Package Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Package Description</Label>
                        <Textarea
                          value={formData.package_description}
                          onChange={(e) => setFormData({ ...formData, package_description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.package_weight}
                          onChange={(e) => setFormData({ ...formData, package_weight: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code} - {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Package Value</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.package_value}
                          onChange={(e) => setFormData({ ...formData, package_value: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Shipping Fee</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.shipping_fee}
                          onChange={(e) => setFormData({ ...formData, shipping_fee: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Days</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          value={formData.delivery_days}
                          onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Location</Label>
                        <Input
                          value={formData.current_location}
                          onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Delivery</Label>
                        <Input
                          type="date"
                          value={formData.estimated_delivery_date}
                          onChange={(e) => setFormData({ ...formData, estimated_delivery_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.held_by_customs}
                      onCheckedChange={(checked) => setFormData({ ...formData, held_by_customs: checked })}
                    />
                    <Label>Held by Customs</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-accent hover:bg-accent/90">
                      Create Shipment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Shipments List */}
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading shipments...</p>
              </Card>
            ) : shipments.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No shipments yet. Create your first one!</p>
              </Card>
            ) : (
              shipments.map((shipment) => (
                <Card key={shipment.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {shipment.tracking_code}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          shipment.status === "delivered" ? "bg-green-100 text-green-800" :
                          shipment.status === "in transit" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">From</p>
                          <p className="font-medium">{shipment.sender_name}</p>
                          <p className="text-muted-foreground">{shipment.origin_city}, {shipment.origin_country}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">To</p>
                          <p className="font-medium">{shipment.receiver_name}</p>
                          <p className="text-muted-foreground">{shipment.destination_city}, {shipment.destination_country}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value / Fee</p>
                          <p className="font-medium">
                            {shipment.package_value ? `${getCurrencySymbol(shipment.currency)}${shipment.package_value}` : "-"}
                            {shipment.shipping_fee ? ` / ${getCurrencySymbol(shipment.currency)}${shipment.shipping_fee}` : ""}
                          </p>
                          {shipment.delivery_days && (
                            <p className="text-muted-foreground">{shipment.delivery_days} days</p>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="font-medium">{shipment.package_weight ? `${shipment.package_weight} kg` : "-"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/tracking?code=${shipment.tracking_code}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteShipment(shipment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
