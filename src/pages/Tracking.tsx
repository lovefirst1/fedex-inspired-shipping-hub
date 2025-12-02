import { useEffect, useState, useCallback } from "react";
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
  Truck,
  PackageCheck,
  RefreshCw,
  DollarSign,
  Scale,
  Timer,
  Plane,
  Warehouse,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import ShipmentProgressTracker from "@/components/ShipmentProgressTracker";

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get("code") || "");
  const [shipment, setShipment] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchShipment = useCallback(async (code: string, showLoading = true) => {
    if (!code.trim()) return;

    if (showLoading) setLoading(true);
    try {
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_code", code)
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      if (!shipmentData) {
        if (showLoading) {
          toast({
            title: "Not found",
            description: "No shipment found with this tracking code.",
            variant: "destructive",
          });
        }
        setShipment(null);
        setTimeline([]);
        return;
      }

      setShipment(shipmentData);
      setLastUpdated(new Date());

      const { data: timelineData, error: timelineError } = await supabase
        .from("shipment_timeline")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("timestamp", { ascending: false });

      if (timelineError) throw timelineError;
      setTimeline(timelineData || []);
    } catch (error: any) {
      if (showLoading) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [toast]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || !shipment) return;

    const interval = setInterval(() => {
      fetchShipment(code, false);
    }, 10000);

    return () => clearInterval(interval);
  }, [searchParams, shipment, fetchShipment]);

  // Real-time subscription for live updates
  useEffect(() => {
    if (!shipment?.id) return;

    const shipmentsChannel = supabase
      .channel('shipment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shipments',
          filter: `id=eq.${shipment.id}`
        },
        (payload) => {
          if (payload.new) {
            setShipment(payload.new);
            setLastUpdated(new Date());
          }
        }
      )
      .subscribe();

    const timelineChannel = supabase
      .channel('timeline-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_timeline',
          filter: `shipment_id=eq.${shipment.id}`
        },
        (payload) => {
          if (payload.new) {
            setTimeline(prev => [payload.new as any, ...prev]);
            setLastUpdated(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(shipmentsChannel);
      supabase.removeChannel(timelineChannel);
    };
  }, [shipment?.id]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setTrackingCode(code);
      fetchShipment(code);
    }
  }, [searchParams, fetchShipment]);

  const handleSearch = () => {
    setSearchParams({ code: trackingCode });
    fetchShipment(trackingCode);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <PackageCheck className="h-5 w-5 text-green-600" />;
      case "out for delivery":
        return <Truck className="h-5 w-5 text-primary" />;
      case "arrived at local facility":
        return <Warehouse className="h-5 w-5 text-cyan-600" />;
      case "customs check":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "in transit":
        return <Plane className="h-5 w-5 text-blue-600" />;
      case "departed origin facility":
        return <Warehouse className="h-5 w-5 text-indigo-600" />;
      case "picked up":
        return <Package className="h-5 w-5 text-amber-500" />;
      case "order received":
        return <Package className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-600 text-white";
      case "out for delivery":
        return "bg-primary text-primary-foreground";
      case "arrived at local facility":
        return "bg-cyan-600 text-white";
      case "customs check":
        return "bg-red-500 text-white";
      case "in transit":
        return "bg-blue-600 text-white";
      case "departed origin facility":
        return "bg-indigo-600 text-white";
      case "picked up":
        return "bg-amber-500 text-white";
      case "order received":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatCurrency = (value: number | null, currency: string | null) => {
    if (value === null || value === undefined) return "N/A";
    const cur = currency || "USD";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search Section */}
          <Card className="p-4 md:p-6 mb-6 md:mb-8 shadow-lg border-t-4 border-t-primary">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
              Track Your Shipment
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12 text-base"
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
            {lastUpdated && shipment && (
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <span className="text-green-600">• Live updates enabled</span>
              </div>
            )}
          </Card>

          {/* Shipment Details */}
          {shipment && (
            <div className="space-y-4 md:space-y-6 animate-fade-in">
              {/* Status Card */}
              <Card className="p-4 md:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {shipment.tracking_code}
                    </h2>
                    <Badge className={`${getStatusColor(shipment.status)} text-sm px-3 py-1`}>
                      {shipment.status}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    {shipment.estimated_delivery_date && (
                      <div className="flex items-center sm:justify-end space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          Est. Delivery:{" "}
                          {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {shipment.current_location && (
                      <div className="flex items-center sm:justify-end space-x-2 text-primary mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Currently: {shipment.current_location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Progress Tracker */}
                <div className="mb-6 pb-6 border-b overflow-x-auto">
                  <ShipmentProgressTracker 
                    status={shipment.status} 
                    heldByCustoms={shipment.held_by_customs}
                    className="min-w-[600px]"
                  />
                </div>

                {shipment.held_by_customs && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Held by Customs</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Your shipment is currently being processed by customs. This may cause delays.
                    </p>
                  </div>
                )}

                {/* Package Value, Shipping Fee, Delivery Days */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Package Value</p>
                      <p className="font-semibold text-sm">{formatCurrency(shipment.package_value, shipment.currency)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Shipping Fee</p>
                      <p className="font-semibold text-sm">{formatCurrency(shipment.shipping_fee, shipment.currency)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-semibold text-sm">{shipment.package_weight ? `${shipment.package_weight} kg` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery Days</p>
                      <p className="font-semibold text-sm">{shipment.delivery_days ? `${shipment.delivery_days} days` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      From (Sender)
                    </h3>
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
                  <div className="p-4 bg-accent/5 rounded-lg border-l-4 border-l-accent">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-accent" />
                      To (Receiver)
                    </h3>
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
                    <h3 className="font-semibold text-foreground mb-2">Package Description</h3>
                    <p className="text-muted-foreground">{shipment.package_description}</p>
                  </div>
                )}

                {shipment.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Note:</span> {shipment.notes}
                    </p>
                  </div>
                )}
              </Card>

              {/* Timeline */}
              {timeline.length > 0 && (
                <Card className="p-4 md:p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Shipment Timeline
                  </h3>
                  <div className="space-y-0">
                    {timeline.map((event, index) => (
                      <div key={event.id} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`flex-shrink-0 p-2 rounded-full ${index === 0 ? 'bg-primary/10' : 'bg-muted'}`}>
                            {getStatusIcon(event.status)}
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full min-h-[40px] bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                            <div>
                              <p className={`font-semibold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                                {event.status}
                              </p>
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
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
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