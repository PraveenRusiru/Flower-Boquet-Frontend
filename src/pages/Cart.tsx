import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ClientNavbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-md mx-auto text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any beautiful flowers yet. 
                Start exploring our collection!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="hero" asChild>
                  <Link to="/products">
                    Browse Products
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/customize">
                    <Sparkles className="mr-2 w-4 h-4" />
                    Create Custom
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mb-8">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <AnimatedSection key={item._id} delay={index * 100}>
                  <Card className="gradient-card border-0 shadow-soft overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        {/* Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full gradient-primary flex items-center justify-center">
                              <span className="text-4xl">🌸</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1.5 mb-1">
                            {item.category.map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-[10px]">
                                {cat}
                              </Badge>
                            ))}
                            {item.isCustom && (
                              <Badge className="bg-accent text-accent-foreground text-[10px]">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Custom
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {item.colour} • {item.size}
                          </p>
                          {item.customPrompt && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              "{item.customPrompt}"
                            </p>
                          )}
                          <p className="font-display text-xl font-bold text-foreground mt-2">
                            Rs. {item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-background transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-background transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}

              <AnimatedSection delay={items.length * 100}>
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </AnimatedSection>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={200} direction="left">
                <Card className="gradient-card border-0 shadow-elevated sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">Rs. {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-accent">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gift Wrapping</span>
                        <span className="font-medium text-accent">Free</span>
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between">
                          <span className="font-display text-lg font-semibold">Total</span>
                          <span className="font-display text-2xl font-bold text-foreground">
                            Rs. {totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button variant="hero" size="lg" className="w-full" asChild>
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                      Secure checkout powered by encrypted payment
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
