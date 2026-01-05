import { Link } from 'react-router-dom';
import { Flower2, Instagram, Facebook, Twitter, Heart, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      
      <div className="relative">
        {/* Main Footer */}
        <div className="border-t border-border/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Link to="/" className="flex items-center gap-2 mb-4 group">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-all">
                    <Flower2 className="w-7 h-7 text-foreground" />
                  </div>
                  <span className="font-display text-2xl font-bold text-foreground">
                     Petal Dreams
                  </span>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Handcrafted flower bouquets and pots made with love. 
                  Bringing nature's beauty to your doorstep.
                </p>
                <div className="flex gap-3">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Icon className="w-5 h-5 text-foreground" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Shop All', path: '/products' },
                    { label: 'Categories', path: '/categories' },
                    { label: 'Customize', path: '/customize' },
                    { label: 'Gallery', path: '/gallery' },
                  ].map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                  Categories
                </h4>
                <ul className="space-y-3">
                  {['Bouquets', 'Pots', 'Succulents', 'Custom Designs'].map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/categories?filter=${cat.toLowerCase()}`}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all" />
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">
                     Sandamira ,Athalahena, Wawulugala, Galle, Sri Lanka
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">+94 74 356 4951</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">thisarawismini97@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                © 2024 Petal Dreams. Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for flower lovers.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
