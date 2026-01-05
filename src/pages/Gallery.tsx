import { useState, useEffect } from 'react';
import { libraryApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Image } from 'lucide-react';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';

interface LibraryItem {
  _id: string;
  title: string;
  mediaUrl: { url: string; public_id: string; _id: string }[];
}

const Gallery = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await libraryApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }

    try {
      const data = await libraryApi.findByName(searchTerm);
      setItems(data.libraries || []);
    } catch (error) {
      console.error('Search failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Inspiration Gallery
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our collection of beautiful flower arrangements and find inspiration for your next order
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2 max-w-md mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search gallery..."
                className="pl-12"
              />
            </div>
            <Button onClick={handleSearch} variant="hero">
              Search
            </Button>
            {searchTerm && (
              <Button variant="ghost" onClick={() => { setSearchTerm(''); fetchItems(); }}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading gallery...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? 'No images found matching your search.' : 'Gallery is empty.'}
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {items.map((item, index) => (
                <Card
                  key={item._id}
                  className="break-inside-avoid overflow-hidden gradient-card border-0 shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer group animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => item.mediaUrl?.[0]?.url && setSelectedImage({ url: item.mediaUrl[0].url, title: item.title })}
                >
                  {item.mediaUrl && item.mediaUrl.length > 0 ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={item.mediaUrl[0].url}
                        alt={item.title}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-square w-full flex items-center justify-center gradient-primary">
                      <Image className="w-12 h-12 text-foreground/50" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground line-clamp-2">
                      {item.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
          <Footer/>
      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-foreground/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-card hover:text-card/80"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-elevated"
            />
            <p className="text-card font-display text-xl text-center mt-4">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
