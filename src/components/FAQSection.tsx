import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How fast can FedEx deliver my package?",
    answer: "FedEx offers multiple delivery speeds: Same-Day delivery for urgent shipments, Next-Day delivery by 10:30 AM, 2-Day delivery for time-sensitive packages, and Ground shipping for cost-effective options. International express can reach most destinations within 1-3 business days."
  },
  {
    question: "How do I track my shipment?",
    answer: "Simply enter your tracking number on our homepage or tracking page. You'll see real-time updates including current location, estimated delivery time, and complete shipment history. You can also sign up for email or SMS notifications."
  },
  {
    question: "What if my package is held by customs?",
    answer: "If your international shipment is held by customs, you'll see this status in your tracking. Our customs brokerage team works to clear packages quickly. You may need to provide additional documentation. Contact our support team for assistance with customs clearance."
  },
  {
    question: "Can I change my delivery address after shipping?",
    answer: "Yes! FedEx Delivery Manager allows you to redirect packages to a different address, hold them at a FedEx location, or schedule a specific delivery time. Changes can be made through our website or mobile app before final delivery."
  },
  {
    question: "What items are prohibited from shipping?",
    answer: "Prohibited items include hazardous materials, flammables, explosives, illegal substances, and certain perishables. Some items like lithium batteries have special shipping requirements. Check our complete list of prohibited items or contact support for specific questions."
  },
  {
    question: "How is shipping cost calculated?",
    answer: "Shipping costs are based on package dimensions, weight, origin, destination, and delivery speed. We use dimensional weight pricing, which compares actual weight to package size. Get an instant quote using our shipping calculator on the website."
  },
  {
    question: "Do you offer insurance for valuable items?",
    answer: "Yes, FedEx provides declared value coverage up to $100 for free. Additional coverage is available for valuable items up to $50,000. We recommend declaring the full value of your shipment for complete protection against loss or damage."
  },
  {
    question: "What are your international shipping options?",
    answer: "We ship to 220+ countries worldwide via Air Freight (1-3 days), Ocean Freight (cost-effective for large shipments), and Ground services to neighboring countries. All international shipments include customs documentation support and real-time tracking."
  },
  {
    question: "How do I schedule a pickup?",
    answer: "Schedule a pickup online, through our mobile app, or by calling customer service. Same-day pickup is available if scheduled before the cutoff time. Regular pickup services are also available for businesses with frequent shipping needs."
  },
  {
    question: "What happens if my package is damaged or lost?",
    answer: "Report damage within 60 days or loss within 9 months. Keep all packaging materials for inspection. File a claim online with photos and documentation. Claims are typically processed within 5-7 business days. Refunds are based on declared value coverage."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary mr-2" />
            <span className="text-primary font-semibold">Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Find answers to common questions about our shipping services, tracking, and delivery options.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border border-border px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#" className="text-primary font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
