import { Star, Heart, ThumbsUp } from "lucide-react";
import customer1 from "@/assets/customer-receiving-1.jpg";
import customer2 from "@/assets/customer-receiving-2.jpg";

const CustomerHappinessSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Delivering Happiness Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every day, millions of customers trust us to deliver what matters most. See the joy we bring to homes and businesses around the globe.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
            <div className="bg-gradient-to-br from-accent to-accent/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">98%</h3>
            <p className="text-muted-foreground">Customer Satisfaction</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-gradient-to-br from-primary to-primary/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">15M+</h3>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-gradient-to-br from-accent to-accent/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">4.9/5</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
        </div>

        {/* Customer Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <img
              src={customer1}
              alt="Happy customers receiving their package"
              className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Delivered with Care
              </h3>
              <p className="text-white/90">
                Every package is handled with the utmost care, ensuring it arrives safely at your doorstep.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl group animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <img
              src={customer2}
              alt="Business professional receiving package"
              className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-accent/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Business You Can Trust
              </h3>
              <p className="text-white/90">
                From small businesses to Fortune 500 companies, we deliver success to every customer.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="inline-block bg-white rounded-2xl px-12 py-6 shadow-lg">
            <p className="text-muted-foreground text-lg">
              Trusted by businesses and individuals in{" "}
              <span className="font-bold text-foreground">220+ countries</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerHappinessSection;
