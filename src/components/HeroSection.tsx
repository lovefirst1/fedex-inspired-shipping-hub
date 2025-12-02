import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-shipping.jpg";

const HeroSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleTrackShipment = () => {
    if (trackingCode.trim()) {
      navigate(`/tracking?code=${trackingCode.trim()}`);
    }
  };

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Shipping and logistics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Ship Anything,{" "}
            <span className="text-accent">Anywhere</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Fast, reliable, and secure delivery services worldwide. Track your shipment in real-time.
          </p>

          {/* Tracking Search */}
          <div 
            className="bg-white rounded-2xl p-6 shadow-2xl animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Track Your Shipment
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrackShipment()}
                className="flex-1 h-12 text-lg"
              />
              <Button
                onClick={handleTrackShipment}
                size="lg"
                className="bg-accent hover:bg-accent/90 h-12 px-8"
              >
                <Search className="mr-2 h-5 w-5" />
                Track
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;