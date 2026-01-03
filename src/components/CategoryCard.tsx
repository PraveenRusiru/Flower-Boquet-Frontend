import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  count: number;
  slug: string;
}

const CategoryCard = ({ name, description, imageUrl, count, slug }: CategoryCardProps) => {
  return (
    <Link
      to={`/categories?filter=${slug}`}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer block"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
      
      {/* Decorative Circle */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-card/80 text-sm font-medium mb-1">{count}+ Products</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-card mb-2">
            {name}
          </h3>
          <p className="text-card/70 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {description}
          </p>
          <div className="flex items-center gap-2 text-card font-medium">
            <span className="text-sm">Explore</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
      
      {/* Hover Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-3xl transition-colors duration-300" />
    </Link>
  );
};

export default CategoryCard;
