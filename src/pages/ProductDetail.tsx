import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { giftApi } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ShoppingBag, Heart, Share2, Truck, ShieldCheck, 
  RotateCcw, ArrowLeft, ChevronLeft, ChevronRight, Check 
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await giftApi.getAll();
        const found = products.find((p: any) => p._id === id);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        colour: product.colour,
        size: product.size,
        category: product.category,
        imageUrl: product.mediaUrl?.[0]?.url,
      });
    }
    setIsAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const features = [
    { icon: Truck, text: 'Free delivery on all orders' },
    { icon: ShieldCheck, text: 'Quality guaranteed' },
    { icon: RotateCcw, text: 'Easy returns within 24 hours' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ClientNavbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-12 bg-muted rounded animate-pulse" />
                <div className="h-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <ClientNavbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Button variant="hero" asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.mediaUrl?.length > 0 
    ? product.mediaUrl.map((m: any) => m.url) 
    : ['https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=600&fit=crop'];

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <AnimatedSection>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <AnimatedSection>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-card shadow-elevated">
                  <img
                    src={images[currentImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Like Button */}
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isLiked
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-card/80 text-foreground hover:bg-card'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          currentImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Product Info */}
            <AnimatedSection delay={200} direction="left">
              <div className="space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.category.map((cat: string) => (
                    <Badge key={cat} variant="secondary" className="text-xs uppercase">
                      {cat}
                    </Badge>
                  ))}
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    {product.size}
                  </Badge>
                </div>

                {/* Title & Price */}
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {product.name}
                  </h1>
                  <p className="text-muted-foreground">{product.colour}</p>
                </div>

                <p className="font-display text-4xl font-bold text-foreground">
                  Rs. {product.price.toLocaleString()}
                </p>

                {/* Description */}
                {product.description && product.description !== '""' && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-background flex items-center justify-center font-bold hover:bg-primary/10 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-background flex items-center justify-center font-bold hover:bg-primary/10 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    {isAdded ? (
                      <>
                        <Check className="mr-2 w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <button className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Features */}
                <div className="border-t border-border pt-6 space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
