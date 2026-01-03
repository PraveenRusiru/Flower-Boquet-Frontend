import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardEnhancedProps {
  _id: string;
  name: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  imageUrl?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

const ProductCardEnhanced = ({
  _id,
  name,
  price,
  colour,
  size,
  category,
  imageUrl,
  isNew,
  isBestSeller,
}: ProductCardEnhancedProps) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id,
      name,
      price,
      colour,
      size,
      category,
      imageUrl,
    });
    setIsAdded(true);
    toast.success(`${name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/product/${_id}`}>
      <Card className="group overflow-hidden cursor-pointer gradient-card border-0 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <span className="text-7xl">🌸</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-accent text-accent-foreground font-semibold animate-pulse-soft">
                NEW
              </Badge>
            )}
            {isBestSeller && (
              <Badge className="bg-primary text-primary-foreground font-semibold">
                BEST SELLER
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked
                ? 'bg-destructive text-destructive-foreground scale-110'
                : 'bg-card/80 text-foreground hover:bg-card hover:scale-110'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-card/90 hover:bg-card text-foreground backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </Button>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className={`flex-1 transition-all ${
                isAdded
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {category.slice(0, 2).map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="bg-secondary/60 text-secondary-foreground text-[10px] uppercase tracking-wide"
              >
                {cat}
              </Badge>
            ))}
          </div>
          <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">{colour} • {size}</p>
            <p className="font-display text-lg font-bold text-foreground">
              Rs. {price.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCardEnhanced;
