import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { Check, Eye, Link, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from './ui/sonner';

interface ProductCardProps {
  _id:string
  name: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  imageUrl?: string;
  onClick?: () => void;
}

const onClick = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  // Navigate to product detail page
  window.location.href = `/product/${e.currentTarget.getAttribute('data-id')}`;
} 
 

const ProductCard = ({ _id, name, price, colour, size, category, imageUrl, onClick }: ProductCardProps) => {
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
  return (
    // <Link to={`/product/${_id}`} >
    <Card
      className="group overflow-hidden cursor-pointer gradient-card border-0 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full gradient-primary flex items-center justify-center">
            <span className="text-6xl">🌸</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-card/90 hover:bg-card text-foreground backdrop-blur-sm">
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

        {/* <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-card font-medium">View Details</p>
        </div> */}
      </div>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {category.map((cat) => (
            <Badge key={cat} variant="secondary" className="bg-secondary/80 text-secondary-foreground text-xs">
              {cat}
            </Badge>
          ))}
          <Badge className="bg-accent text-accent-foreground text-xs">{size}</Badge>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{colour}</p>
          <p className="font-display text-xl font-bold text-foreground">
            Rs. {price.toLocaleString()}
          </p>
        </div>
      </CardContent>
      </Card>
      
  );
};

export default ProductCard;
