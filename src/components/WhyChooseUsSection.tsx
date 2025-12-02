import { Shield, Clock, DollarSign, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Insured",
    description: "All shipments are fully insured and tracked for your peace of mind",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "99% on-time delivery rate with real-time tracking updates",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Affordable rates without compromising on quality and speed",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer service for all your shipping needs",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">ShipExpress</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We deliver excellence with every shipment, ensuring your packages arrive safely and on time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;