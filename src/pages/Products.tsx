import { useState, useEffect } from 'react';
import { giftApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import ClientNavbar from '@/components/ClientNavbar';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  mediaUrl: { url: string; public_id: string; _id: string }[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const navigate = useNavigate();
  const categories = ['POT', 'BOQUETS'];
  const sizes = ['SMALL', 'MEDIUM', 'LARGE'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    console.log('Filtering products with', { searchTerm, selectedCategory, selectedSize });
  }, [products, searchTerm, selectedCategory, selectedSize]);

  const fetchProducts = async () => {
    try {
      const data = await giftApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.colour.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category.includes(selectedCategory));
    }

    if (selectedSize) {
      filtered = filtered.filter((p) => p.size === selectedSize);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSize(null);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedSize;

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our exquisite range of handcrafted bouquets and beautiful potted plants
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or colour..."
                  className="pl-12"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center mr-2">
                <Filter className="w-4 h-4 mr-1" />
                Category:
              </span>
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'secondary'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                >
                  {cat === 'BOQUETS' ? 'Bouquets' : 'Pots'}
                </Badge>
              ))}
              <span className="text-sm text-muted-foreground flex items-center mx-2">
                Size:
              </span>
              {sizes.map((size) => (
                <Badge
                  key={size}
                  variant={selectedSize === size ? 'default' : 'secondary'}
                  className="cursor-pointer transition-all hover:scale-105 bg-accent text-accent-foreground"
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                >
                  {size.charAt(0) + size.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {products.length === 0
                  ? 'No products available yet.'
                  : 'No products match your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={product.mediaUrl?.[0]?.url}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;
