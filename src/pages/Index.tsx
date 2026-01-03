import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import ProductCardEnhanced from '@/components/ProductCardEnhanced';
import CategoryCard from '@/components/CategoryCard';
import AnimatedSection from '@/components/AnimatedSection';
import { giftApi, libraryApi } from '@/lib/api';
import { 
  Flower2, Heart, Truck, Sparkles, ArrowRight, Wand2, 
  Palette, Star, ChevronRight, Zap, Gift 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const data = await giftApi.getAll();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const newDrops = products.slice(0, 4);
  const bestSellers = products.slice(0, 4);

  const categories = [
    {
      name: 'Bouquets',
      description: 'Handcrafted flower arrangements for every occasion',
      imageUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=800&fit=crop',
      count: 25,
      slug: 'bouquets',
    },
    {
      name: 'Pots ',
      description: 'Beautiful potted flowers and succulents for your space',
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=800&fit=crop',
      count: 18,
      slug: 'pot',
    },
    {
      name: 'Flowers',
      description: 'Create your dream arrangement with AI assistance',
      imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=800&fit=crop',
      count: 12,
      slug: 'custom',
    },
    {
      name: 'KeyTags',
      description: 'Create your dream arrangement with AI assistance',
      imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=800&fit=crop',
      count: 12,
      slug: 'custom',
    },
    {
      name: 'KeyTags',
      description: 'Create your dream arrangement with AI assistance',
      imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=800&fit=crop',
      count: 12,
      slug: 'custom',
    }
  ];

  const features = [
    {
      icon: Flower2,
      title: 'Handcrafted',
      description: 'Each piece made with love by expert artisans',
      color: 'bg-primary',
    },
    {
      icon: Heart,
      title: 'Premium Quality',
      description: 'Only the finest flowers and materials',
      color: 'bg-accent',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery across the city',
      color: 'bg-lavender-medium',
    },
    {
      icon: Sparkles,
      title: 'AI Customize',
      description: 'Design your dream arrangement',
      color: 'bg-mint',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 organic-shape bg-lavender-medium/15 animate-pulse-soft" />
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 organic-shape bg-mint/20 animate-float" />
        </div>
        
        {/* Floating Decorations */}
        <div className="absolute top-1/4 left-[5%] text-6xl animate-float opacity-60">🌷</div>
        <div className="absolute bottom-1/4 right-[8%] text-5xl animate-float-delayed opacity-60">🌸</div>
        <div className="absolute top-[60%] left-[15%] text-4xl animate-pulse-soft opacity-40">🌺</div>
        
        <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <Badge className="mb-6 px-4 py-2 bg-accent/20 text-accent-foreground border-0 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Handmade with Love
              </Badge>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 leading-[1.1]">
                Artisan
                <span className="block text-gradient text-black">Flower</span>
                <span className="block">Creations</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Discover our exquisite collection of handcrafted bouquets and potted arrangements. 
                Or create your own with AI-powered customization.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild className="group">
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="glass" size="xl" asChild className="group">
                  <Link to="/customize">
                    <Wand2 className="mr-2 w-5 h-5" />
                    Customize
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-border/30">
                {[
                  { value: '500+', label: 'Designs' },
                  { value: '10K+', label: 'Happy Clients' },
                  { value: '4.9', label: 'Rating', icon: Star },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                      {stat.value}
                      {stat.icon && <stat.icon className="w-5 h-5 text-accent fill-accent" />}
                    </p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hero Image Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated animate-scale-in">
                    <img
                      src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=500&fit=crop"
                      alt="Flower arrangement"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card animate-scale-in" style={{ animationDelay: '200ms' }}>
                    <img
                      src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop"
                      alt="Succulent"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <img
                      src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop"
                      alt="Sunflower"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated animate-scale-in" style={{ animationDelay: '300ms' }}>
                    <img
                      src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=500&fit=crop"
                      alt="Potted plant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-elevated p-4 animate-float z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Gift className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Free Gift Wrapping</p>
                    <p className="text-sm text-muted-foreground">On all orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-primary/5 transition-colors group">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft`}>
                    <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm md:text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* New Drops Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Badge className="mb-3 bg-accent/20 text-accent-foreground border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Just Arrived
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  New Drops
                </h2>
                <p className="text-muted-foreground mt-2">Fresh additions to our collection</p>
              </div>
              <Button variant="ghost" asChild className="self-start md:self-auto group">
                <Link to="/products?filter=new">
                  View All New
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(newDrops.length > 0 ? newDrops : [...Array(4)].map((_, i) => ({
                _id: `placeholder-${i}`,
                name: ['Rose Garden', 'Lavender Dreams', 'Sunflower Bliss', 'Succulent Joy'][i],
                price: [2500, 1800, 3200, 1500][i],
                colour: ['Pink', 'Purple', 'Yellow', 'Green'][i],
                size: 'MEDIUM',
                category: [['BOUQUETS'], ['POT'], ['BOUQUETS'], ['POT']][i],
                mediaUrl: [],
              }))).map((product: any, index) => (
                <AnimatedSection key={product._id} delay={index * 100} direction="scale">
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={product.mediaUrl?.[0]?.url || [
                      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop',
                    ][index % 4]}
                    isNew
                  />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28 gradient-hero">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-3 bg-primary/20 text-primary-foreground border-0">
              <Palette className="w-3 h-3 mr-1" />
              Collections
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated collections designed to match every style and occasion
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <AnimatedSection key={category.slug} delay={index * 150} direction="up">
                <CategoryCard {...category} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Badge className="mb-3 bg-primary/20 text-primary-foreground border-0">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Customer Favorites
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  Best Sellers
                </h2>
                <p className="text-muted-foreground mt-2">Most loved by our customers</p>
              </div>
              <Button variant="ghost" asChild className="self-start md:self-auto group">
                <Link to="/products?filter=bestseller">
                  View All
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(bestSellers.length > 0 ? bestSellers : [...Array(4)].map((_, i) => ({
                _id: `bestseller-${i}`,
                name: ['Classic Rose', 'Tropical Mix', 'Zen Garden', 'Spring Bouquet'][i],
                price: [3500, 2800, 2200, 4500][i],
                colour: ['Red', 'Mixed', 'Green', 'Mixed'][i],
                size: 'LARGE',
                category: [['BOUQUETS'], ['BOUQUETS'], ['POT'], ['BOUQUETS']][i],
                mediaUrl: [],
              }))).map((product: any, index) => (
                <AnimatedSection key={product._id} delay={index * 100} direction="scale">
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={product.mediaUrl?.[0]?.url || [
                      'https://images.unsplash.com/photo-1518882605630-8eb256a2c4c7?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=500&fit=crop',
                      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=500&fit=crop',
                    ][index % 4]}
                    isBestSeller
                  />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Customization CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-elevated mb-8 animate-pulse-soft">
                <Wand2 className="w-10 h-10 text-foreground" />
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Create Your Dream
                <span className="text-gradient block">Arrangement</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Use our AI-powered customization tool to design the perfect flower arrangement. 
                Choose colors, flowers, and styles—see it before you buy!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="xl" asChild className="group">
                  <Link to="/customize">
                    <Sparkles className="mr-2 w-5 h-5" />
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/gallery">
                    Browse Gallery
                  </Link>
                </Button>
              </div>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                {['Choose Colors', 'Select Flowers', 'AI Preview', 'Order Custom'].map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 bg-card/80 rounded-full text-sm font-medium text-foreground shadow-soft"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
