import { Clock, Zap, Globe, CheckCircle } from "lucide-react";
import fastDelivery1 from "@/assets/fast-delivery-1.jpg";
import fastDelivery2 from "@/assets/fast-delivery-2.jpg";
import globalNetwork from "@/assets/global-network.jpg";

const deliveryStats = [
  { icon: Clock, value: "1-3", label: "Days International" },
  { icon: Zap, value: "Same", label: "Day Express" },
  { icon: Globe, value: "220+", label: "Countries" },
  { icon: CheckCircle, value: "99.9%", label: "On-Time Rate" },
];

const deliveryFeatures = [
  {
    title: "Lightning-Fast Express",
    description: "Need it there yesterday? Our express service delivers packages within hours for local destinations and overnight for cross-country shipments.",
    image: fastDelivery1,
    stats: [
      "Same-day delivery available",
      "Next-day by 10:30 AM guaranteed",
      "Real-time GPS tracking",
      "Priority handling & security"
    ]
  },
  {
    title: "Doorstep Excellence",
    description: "Our professional couriers ensure your packages arrive safely and on time, right to your recipient's door with signature confirmation.",
    image: fastDelivery2,
    stats: [
      "Flexible delivery windows",
      "Photo proof of delivery",
      "Contactless options available",
      "Friendly, trained couriers"
    ]
  },
  {
    title: "Global Reach",
    description: "With our extensive network spanning 220+ countries, we connect you to the world. No destination is too far for FedEx.",
    image: globalNetwork,
    stats: [
      "1-3 days to major cities",
      "Customs clearance support",
      "Multi-language tracking",
      "24/7 international support"
    ]
  }
];

const FastDeliverySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-accent/10 rounded-full px-4 py-2 mb-4">
            <Zap className="h-5 w-5 text-accent mr-2" />
            <span className="text-accent font-semibold">Speed Matters</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unmatched Delivery Speed
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            When time is critical, FedEx delivers. Our advanced logistics network ensures your packages arrive faster than ever.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {deliveryStats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 text-center shadow-lg border border-border hover:border-primary/50 transition-all hover:scale-105"
            >
              <div className="bg-gradient-to-br from-primary to-accent w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="space-y-20">
          {deliveryFeatures.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-[350px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-accent rounded-full p-2">
                          <Zap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground">
                          Fast & Reliable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {feature.stats.map((stat, idx) => (
                    <li key={idx} className="flex items-center space-x-4">
                      <div className="bg-accent/20 rounded-full p-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-foreground font-medium text-lg">
                        {stat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FastDeliverySection;
