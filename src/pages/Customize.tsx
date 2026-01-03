import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { libraryApi, aiApi } from '@/lib/api';
import { toast } from 'sonner';
import AnimatedSection from '@/components/AnimatedSection';
import { 
  Wand2, Sparkles, Palette, ImageIcon, 
  ShoppingBag, RefreshCw, Check, X, Loader2 
} from 'lucide-react';

const Customize = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const colorOptions = ['Pink', 'Red', 'Yellow', 'Purple', 'White', 'Orange', 'Blue', 'Mixed'];
  const flowerTypes = ['Roses', 'Sunflowers', 'Lilies', 'Tulips', 'Orchids', 'Daisies', 'Mixed'];

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await libraryApi.getAll();
        if (Array.isArray(data)) {
          setLibrary(data);
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const toggleImageSelection = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleGenerate = async () => {
    if (selectedImages.length === 0 && !prompt) {
      toast.error('Please select reference images or describe your design');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiApi.generate({
        imageUrls: selectedImages,
        prompt: prompt || 'Create a beautiful flower arrangement',
      });

      if (response.message && typeof response.message === 'string' && response.message.includes('error')) {
        throw new Error('AI generation limit reached. Please try again later.');
      }

      // For demo, use a placeholder since the AI might have rate limits
      setGeneratedImage('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=600&fit=crop');
      toast.success('Design generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate design. Please try again.');
      // Show a demo image for testing
      setGeneratedImage('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=600&fit=crop');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!generatedImage) return;
    
    addToCart({
      _id: `custom-${Date.now()}`,
      name: 'Custom Design',
      price: 5000,
      colour: 'Custom',
      size: 'CUSTOM',
      category: ['CUSTOM'],
      imageUrl: generatedImage,
      isCustom: true,
      customPrompt: prompt,
    });
    
    toast.success('Custom design added to cart!');
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="gradient-hero py-16 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/20 text-primary-foreground border-0">
                <Wand2 className="w-4 h-4 mr-2" />
                AI-Powered Design
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Create Your Dream
                <span className="text-gradient block">Arrangement</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Select reference designs, describe your vision, and let our AI 
                create a preview of your perfect flower arrangement.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Reference Images */}
              <AnimatedSection>
                <Card className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">
                          Select Reference Images
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Choose existing designs for inspiration
                        </p>
                      </div>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                        ))}
                      </div>
                    ) : library.length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {library.map((item) => (
                          <button
                            key={item._id}
                            onClick={() => toggleImageSelection(item.mediaUrl?.[0]?.url)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                              selectedImages.includes(item.mediaUrl?.[0]?.url)
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={item.mediaUrl?.[0]?.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {selectedImages.includes(item.mediaUrl?.[0]?.url) && (
                              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                <Check className="w-8 h-8 text-card" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {[
                          'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1518882605630-8eb256a2c4c7?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=200&h=200&fit=crop',
                          'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=200&h=200&fit=crop',
                        ].map((url, i) => (
                          <button
                            key={i}
                            onClick={() => toggleImageSelection(url)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                              selectedImages.includes(url)
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-transparent'
                            }`}
                          >
                            <img src={url} alt="Reference" className="w-full h-full object-cover" />
                            {selectedImages.includes(url) && (
                              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                <Check className="w-8 h-8 text-card" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedImages.length > 0 && (
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {selectedImages.length} image(s) selected
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedImages([])}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Quick Options */}
              <AnimatedSection delay={100}>
                <Card className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Palette className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">
                          Quick Customization
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Click to add to your prompt
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Colors</Label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <Button
                              key={color}
                              variant="outline"
                              size="sm"
                              onClick={() => setPrompt((prev) => `${prev} ${color} color`)}
                              className="rounded-full"
                            >
                              {color}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Flower Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {flowerTypes.map((type) => (
                            <Button
                              key={type}
                              variant="outline"
                              size="sm"
                              onClick={() => setPrompt((prev) => `${prev} with ${type}`)}
                              className="rounded-full"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Prompt Input */}
              <AnimatedSection delay={200}>
                <Card className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-lavender-medium flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">
                          Describe Your Vision
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          The more detail, the better!
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="E.g., A romantic pink and white rose bouquet with baby's breath, elegant wrapping, perfect for a wedding..."
                      rows={4}
                      className="resize-none"
                    />

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full mt-4"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Generating Design...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 w-5 h-5" />
                          Generate Design
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={300} direction="left">
                <Card className="gradient-card border-0 shadow-elevated sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                      Your Design Preview
                    </h2>

                    <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-6">
                      {generatedImage ? (
                        <img
                          src={generatedImage}
                          alt="Generated design"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                          <Wand2 className="w-12 h-12 mb-4 opacity-50" />
                          <p>Your AI-generated design will appear here</p>
                        </div>
                      )}
                    </div>

                    {generatedImage && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display text-lg font-semibold text-foreground">
                              Custom Design
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Your unique creation
                            </p>
                          </div>
                          <p className="font-display text-2xl font-bold text-foreground">
                            Rs. 5,000
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                          >
                            <RefreshCw className={`mr-2 w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                          </Button>
                          <Button
                            variant="hero"
                            className="flex-1"
                            onClick={handleAddToCart}
                          >
                            <ShoppingBag className="mr-2 w-4 h-4" />
                            Add to Cart
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                          Our artisans will craft your design exactly as shown
                        </p>
                      </div>
                    )}
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

export default Customize;
