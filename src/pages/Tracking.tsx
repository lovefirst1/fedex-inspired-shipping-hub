import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get("code") || "");
  const [shipment, setShipment] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchShipment = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_code", code)
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      if (!shipmentData) {
        toast({
          title: "Not found",
          description: "No shipment found with this tracking code.",
          variant: "destructive",
        });
        setShipment(null);
        setTimeline([]);
        return;
      }

      setShipment(shipmentData);

      const { data: timelineData, error: timelineError } = await supabase
        .from("shipment_timeline")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("timestamp", { ascending: false });

      if (timelineError) throw timelineError;
      setTimeline(timelineData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setTrackingCode(code);
      fetchShipment(code);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setSearchParams({ code: trackingCode });
    fetchShipment(trackingCode);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in transit":
      case "out for delivery":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "held by customs":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in transit":
      case "out for delivery":
        return "bg-blue-100 text-blue-800";
      case "held by customs":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search Section */}
          <Card className="p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Track Your Shipment
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12"
              />
              <Button
                onClick={handleSearch}
                size="lg"
                disabled={loading}
                className="bg-accent hover:bg-accent/90 h-12 px-8"
              >
                <Search className="mr-2 h-5 w-5" />
                {loading ? "Searching..." : "Track"}
              </Button>
            </div>
          </Card>

          {/* Shipment Details */}
          {shipment && (
            <div className="space-y-6 animate-fade-in">
              {/* Status Card */}
              <Card className="p-6 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Tracking: {shipment.tracking_code}
                    </h2>
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {shipment.estimated_delivery_date && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          Est. Delivery:{" "}
                          {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {shipment.held_by_customs && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Held by Customs</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      Your shipment is currently being processed by customs.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">From</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="font-medium text-foreground">{shipment.sender_name}</p>
                      <p className="text-sm">{shipment.sender_address}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {shipment.origin_city}, {shipment.origin_country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">To</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="font-medium text-foreground">{shipment.receiver_name}</p>
                      <p className="text-sm">{shipment.receiver_address}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {shipment.destination_city}, {shipment.destination_country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {shipment.package_description && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-2">Package Details</h3>
                    <p className="text-muted-foreground">{shipment.package_description}</p>
                    {shipment.package_weight && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Weight: {shipment.package_weight} kg
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Timeline */}
              {timeline.length > 0 && (
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-foreground mb-6">Shipment Timeline</h3>
                  <div className="space-y-4">
                    {timeline.map((event, index) => (
                      <div key={event.id} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div className="flex-shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{event.status}</p>
                              {event.location && (
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </p>
                              )}
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tracking;