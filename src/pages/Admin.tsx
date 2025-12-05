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
import { Plus, Package, Edit, Trash2, Eye, Link2, Copy, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import { currencies } from "@/data/currencies";
import ShipmentProgressTracker from "@/components/ShipmentProgressTracker";
import InvoiceGenerator from "@/components/InvoiceGenerator";

const statusOptions = [
  { value: "order received", label: "Order Received" },
  { value: "picked up", label: "Picked Up" },
  { value: "departed origin facility", label: "Departed Origin Facility" },
  { value: "in transit", label: "In Transit" },
  { value: "customs check", label: "Customs Check" },
  { value: "arrived at local facility", label: "Arrived at Local Facility" },
  { value: "out for delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialFormData = {
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
    status: "order received",
    estimated_delivery_date: "",
    held_by_customs: false,
    notes: "",
    currency: "USD",
    package_value: "",
    shipping_fee: "",
    delivery_days: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/admin-portal");
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

  const handleOpenEdit = (shipment: any) => {
    setEditingShipment(shipment);
    setFormData({
      tracking_code: shipment.tracking_code || "",
      sender_name: shipment.sender_name || "",
      sender_address: shipment.sender_address || "",
      receiver_name: shipment.receiver_name || "",
      receiver_address: shipment.receiver_address || "",
      package_description: shipment.package_description || "",
      package_weight: shipment.package_weight?.toString() || "",
      origin_city: shipment.origin_city || "",
      origin_country: shipment.origin_country || "",
      destination_city: shipment.destination_city || "",
      destination_country: shipment.destination_country || "",
      current_location: shipment.current_location || "",
      status: shipment.status || "order received",
      estimated_delivery_date: shipment.estimated_delivery_date ? shipment.estimated_delivery_date.split('T')[0] : "",
      held_by_customs: shipment.held_by_customs || false,
      notes: shipment.notes || "",
      currency: shipment.currency || "USD",
      package_value: shipment.package_value?.toString() || "",
      shipping_fee: shipment.shipping_fee?.toString() || "",
      delivery_days: shipment.delivery_days?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingShipment(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingShipment) {
      await handleUpdateShipment();
    } else {
      await handleCreateShipment();
    }
  };

  const handleCreateShipment = async () => {
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
    setFormData(initialFormData);
    fetchShipments();
  };

  const handleUpdateShipment = async () => {
    const oldStatus = editingShipment.status;
    const newStatus = formData.status;

    const { error } = await supabase
      .from("shipments")
      .update({
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
      })
      .eq("id", editingShipment.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // If status changed, add timeline entry
    if (oldStatus !== newStatus) {
      await supabase.from("shipment_timeline").insert([
        {
          shipment_id: editingShipment.id,
          status: newStatus,
          location: formData.current_location || formData.destination_city,
          description: `Status updated to ${newStatus}`,
        },
      ]);
    }

    toast({
      title: "Success!",
      description: "Shipment updated successfully",
    });

    setDialogOpen(false);
    setEditingShipment(null);
    setFormData(initialFormData);
    fetchShipments();
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

  const copyTrackingLink = (trackingCode: string) => {
    const link = `${window.location.origin}/tracking?code=${trackingCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Tracking link copied to clipboard",
    });
  };

  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-600 text-white";
      case "out for delivery": return "bg-primary text-primary-foreground";
      case "arrived at local facility": return "bg-cyan-600 text-white";
      case "customs check": return "bg-red-500 text-white";
      case "in transit": return "bg-blue-600 text-white";
      case "departed origin facility": return "bg-indigo-600 text-white";
      case "picked up": return "bg-amber-500 text-white";
      case "order received": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AdminHeader />
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
      <AdminHeader />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage shipments, tracking, and invoices</p>
          </div>

          <Tabs defaultValue="shipments" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="shipments" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Shipments
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invoices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipments" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={handleOpenCreate} className="bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Shipment
                </Button>
              </div>

          {/* Create/Edit Dialog */}
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingShipment(null);
              setFormData(initialFormData);
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingShipment ? "Edit Shipment" : "Create New Shipment"}</DialogTitle>
              </DialogHeader>

              {/* Progress Tracker Preview */}
              {formData.status && (
                <div className="py-4 border-b">
                  <Label className="text-sm text-muted-foreground mb-2 block">Status Preview</Label>
                  <ShipmentProgressTracker status={formData.status} heldByCustoms={formData.held_by_customs} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tracking Code {editingShipment ? "(read-only)" : "(optional)"}</Label>
                    <Input
                      placeholder="Auto-generated if left empty"
                      value={formData.tracking_code}
                      onChange={(e) => setFormData({ ...formData, tracking_code: e.target.value })}
                      disabled={!!editingShipment}
                      className={editingShipment ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
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
                    {editingShipment ? "Update Shipment" : "Create Shipment"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
                <Card key={shipment.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                  {/* Progress Tracker */}
                  <div className="mb-6 pb-4 border-b overflow-x-auto">
                    <ShipmentProgressTracker 
                      status={shipment.status} 
                      heldByCustoms={shipment.held_by_customs}
                      className="min-w-[600px]"
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {shipment.tracking_code}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyTrackingLink(shipment.tracking_code)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
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
                          <p className="text-muted-foreground">Current Location</p>
                          <p className="font-medium">{shipment.current_location || "-"}</p>
                          <p className="text-muted-foreground">{shipment.package_weight ? `${shipment.package_weight} kg` : ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/tracking?code=${shipment.tracking_code}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenEdit(shipment)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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
            </TabsContent>

            <TabsContent value="invoices">
              <InvoiceGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;