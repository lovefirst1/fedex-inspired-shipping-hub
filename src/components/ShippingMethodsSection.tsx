import { Plane, Truck, Ship } from "lucide-react";
import airImage from "@/assets/shipping-air.jpg";
import landImage from "@/assets/shipping-land.jpg";
import waterImage from "@/assets/shipping-water.jpg";

const shippingMethods = [
  {
    icon: Plane,
    title: "Air Freight",
    description: "Fast and reliable air cargo services for time-sensitive shipments. Our global network ensures your packages reach their destination quickly and safely.",
    features: [
      "Express delivery within 1-3 days",
      "Global coverage to 220+ countries",
      "Real-time flight tracking",
      "Temperature-controlled options"
    ],
    image: airImage,
    color: "from-accent to-accent/80",
  },
  {
    icon: Truck,
    title: "Ground Shipping",
    description: "Cost-effective land transportation for domestic and regional deliveries. Perfect for heavy cargo and flexible delivery schedules.",
    features: [
      "Door-to-door service",
      "Flexible pickup and delivery times",
      "Heavy freight capabilities",
      "Eco-friendly fleet options"
    ],
    image: landImage,
    color: "from-primary to-primary/80",
  },
  {
    icon: Ship,
    title: "Ocean Freight",
    description: "Economical ocean shipping for large-scale international cargo. Ideal for bulk shipments and non-urgent deliveries across continents.",
    features: [
      "Full container load (FCL) & less than container load (LCL)",
      "Port-to-port and door-to-door service",
      "Customs clearance assistance",
      "Competitive rates for bulk cargo"
    ],
    image: waterImage,
    color: "from-accent to-accent/80",
  },
];

const ShippingMethodsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Shipping Methods
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Choose the perfect shipping solution for your needs. Whether it's urgent express delivery or cost-effective bulk shipping, we've got you covered.
          </p>
        </div>

        <div className="space-y-16">
          {shippingMethods.map((method, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 items-center animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className={`bg-gradient-to-br ${method.color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground">
                  {method.title}
                </h3>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {method.description}
                </p>

                <ul className="space-y-3">
                  {method.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="bg-accent/20 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                      </div>
                      <span className="text-foreground">{feature}</span>
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

export default ShippingMethodsSection;
