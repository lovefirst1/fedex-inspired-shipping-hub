import { Link } from "react-router-dom";
import { Package, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg shadow-lg group-hover:shadow-primary/50 transition-shadow">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              FedEx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/tracking" className="text-foreground hover:text-primary font-medium transition-colors">
              Track Shipment
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link to="/" className="block text-foreground hover:text-primary font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/tracking" className="block text-foreground hover:text-primary font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Track Shipment
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
