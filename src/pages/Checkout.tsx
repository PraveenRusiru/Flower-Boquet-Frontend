import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { orderApi, customerApi, paymentApi } from '@/lib/api';
import { toast } from 'sonner';
import { 
  CreditCard, Banknote, Smartphone, 
  Check, ShieldCheck, Truck, ArrowLeft 
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const paymentMethods = [
    { id: 'CASH', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
    { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard, description: 'Secure card payment' },
    { id: 'BANK', label: 'Bank Transfer', icon: Smartphone, description: 'Direct bank transfer' },
  ];

  const handleSubmit = async () => {
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Create customer
      const customerResponse = await customerApi.create(customerData);
      if (!customerResponse._id) {
        throw new Error('Failed to create customer');
      }

      // Create order
      const orderResponse = await orderApi.create({
        customerId: customerResponse._id,
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      });

      if (!orderResponse.order?._id) {
        throw new Error('Failed to create order');
      }

      // Process payment
      await paymentApi.process({
        orderId: orderResponse.order._id,
        amount: totalPrice,
        discount: 0,
        paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Cart
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Checkout
            </h1>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Customer Info */}
              <AnimatedSection delay={100}>
                <Card className={`gradient-card border-0 shadow-soft transition-all ${step === 1 ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'gradient-primary text-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                      </div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Delivery Information
                      </h2>
                    </div>

                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={customerData.name}
                              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={customerData.phone}
                              onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                              placeholder="07XXXXXXXX"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerData.email}
                            onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Delivery Address</Label>
                          <Textarea
                            id="address"
                            value={customerData.address}
                            onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                            placeholder="Full delivery address"
                            rows={3}
                          />
                        </div>
                        <Button 
                          variant="hero" 
                          onClick={() => setStep(2)}
                          disabled={!customerData.name || !customerData.email || !customerData.phone || !customerData.address}
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    )}

                    {step > 1 && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>{customerData.name}</p>
                          <p>{customerData.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 2: Payment */}
              <AnimatedSection delay={200}>
                <Card className={`gradient-card border-0 shadow-soft transition-all ${step === 2 ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'gradient-primary text-foreground' : 'bg-muted text-muted-foreground'}`}>
                        2
                      </div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Payment Method
                      </h2>
                    </div>

                    {step === 2 && (
                      <div className="space-y-4">
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                paymentMethod === method.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setPaymentMethod(method.id)}
                            >
                              <RadioGroupItem value={method.id} id={method.id} className="mr-4" />
                              <method.icon className="w-6 h-6 mr-4 text-foreground" />
                              <div className="flex-1">
                                <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                  {method.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>

                        <Button
                          variant="hero"
                          size="lg"
                          className="w-full"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 w-5 h-5" />
                              Place Order - Rs. {totalPrice.toLocaleString()}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={300} direction="left">
                <Card className="gradient-card border-0 shadow-elevated sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item._id} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full gradient-primary flex items-center justify-center">
                                <span className="text-2xl">🌸</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-sm">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>Rs. {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="text-accent">Free</span>
                      </div>
                      <div className="flex justify-between font-display text-lg font-bold pt-3 border-t border-border">
                        <span>Total</span>
                        <span>Rs. {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-accent/10 rounded-xl flex items-center gap-3">
                      <Truck className="w-5 h-5 text-accent" />
                      <p className="text-sm text-foreground">
                        Free delivery on all orders
                      </p>
                    </div>
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

export default Checkout;
