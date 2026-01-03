import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { Check, ShoppingBag, Home, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-lg mx-auto text-center py-20">
            {/* Success Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full gradient-primary animate-pulse opacity-30" />
              <div className="absolute inset-2 rounded-full gradient-primary flex items-center justify-center shadow-elevated">
                <Check className="w-16 h-16 text-foreground animate-scale-in" />
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Order Placed!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order! We've received your request and will 
              start preparing your beautiful flowers right away.
            </p>

            {/* Order Info */}
            <div className="bg-card rounded-2xl p-6 shadow-soft mb-8 text-left">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                What's Next?
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'We\'ll prepare your flowers with love' },
                  { step: '2', text: 'You\'ll receive a confirmation call' },
                  { step: '3', text: 'Your order will be delivered fresh' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/products">
                  <ShoppingBag className="mr-2 w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <p className="mt-12 text-sm text-muted-foreground">
              Questions about your order?{' '}
              <a href="tel:+94784589109" className="text-primary hover:underline">
                Call us at +94 78 458 9109
              </a>
            </p>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
