import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import ProductCardEnhanced from '@/components/ProductCardEnhanced';
import AnimatedSection from '@/components/AnimatedSection';
import { giftApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react';

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'large'>('grid');

  const filter = searchParams.get('filter') || 'all';

  const categories = [
    { id: 'all', label: 'All Products', count: 0 },
    { id: 'boquets', label: 'BOQUETS', count: 0 },
    { id: 'pot', label: 'POT', count: 0 },
    { id: 'flowers', label: 'FLOWERS', count: 0 },
    { id: 'keytag', label: 'KEYTAG', count: 0 },
    { id: 'giftbox', label: 'GIFTBOX', count: 0 },
    { id: 'custom', label: 'Custom Designs', count: 0 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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

  const filteredProducts = products.filter((product) => {
    // console.log('Product Categories:', product.category, 'Filter:', filter);
    if (filter === 'all') return true;
    return product.category.some((cat: string) => 
      cat.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: cat.id === 'all' 
      ? products.length 
      : products.filter((p) => p.category.some((c: string) => c.toLowerCase().includes(cat.id))).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Shop by Category
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our handcrafted collections designed for every style and occasion
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Category Filters */}
          <AnimatedSection className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categoriesWithCount.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filter === cat.id ? 'hero' : 'outline'}
                  onClick={() => setSearchParams(cat.id === 'all' ? {} : { filter: cat.id })}
                  className="rounded-full"
                >
                  {cat.label}
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${filter === cat.id ? 'bg-card/20 text-current' : ''}`}
                  >
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </AnimatedSection>

          {/* Toolbar */}
          <AnimatedSection delay={100} className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('grid')}
                className={view === 'grid' ? 'bg-primary/10' : ''}
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('large')}
                className={view === 'large' ? 'bg-primary/10' : ''}
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
            </div>
          </AnimatedSection>

          {/* Products Grid */}
          {loading ? (
            <div className={`grid gap-6 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid gap-6 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredProducts.map((product, index) => (
                <AnimatedSection key={product._id} delay={index * 50} direction="scale">
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={product.mediaUrl?.[0]?.url || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=500&fit=crop'}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchParams({})}
                className="mt-4"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
