import { Truck, Globe, Package, Zap } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Fast shipping within 1-3 business days",
    color: "from-accent to-accent/80",
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Worldwide delivery to over 200 countries",
    color: "from-primary to-primary/80",
  },
  {
    icon: Package,
    title: "Freight Services",
    description: "Large cargo and bulk shipments",
    color: "from-accent to-accent/80",
  },
  {
    icon: Zap,
    title: "Same-Day Delivery",
    description: "Urgent deliveries within hours",
    color: "from-primary to-primary/80",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our range of professional shipping solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;