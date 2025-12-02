import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ShippingMethodsSection from "@/components/ShippingMethodsSection";
import CustomerHappinessSection from "@/components/CustomerHappinessSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ShippingMethodsSection />
        <CustomerHappinessSection />
        <WhyChooseUsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;