import { useState, useEffect } from "react";
import { giftApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface ProductImage {
  url: string;
  public_id: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  mediaUrl: ProductImage[];
}

type ImageSlot = {
  file: File | null; // newly selected file
  previewUrl: string | null; // blob url preview
  existing?: ProductImage; // existing image from DB (edit mode)
  removeExisting?: boolean; // mark existing for delete
};

const MAX_SLOTS = 5;

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    colour: "",
    size: "SMALL",
    category: "POT",
  });

  // 5-slot “industry style” image picker
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await giftApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupPreviews = () => {
    setImageSlots((prev) => {
      prev.forEach((s) => {
        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      });
      return prev;
    });
  };

  const resetForm = () => {
    cleanupPreviews();

    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      colour: "",
      size: "SMALL",
      category: "POT",
    });

    setImageSlots(
      Array.from({ length: MAX_SLOTS }, () => ({
        file: null,
        previewUrl: null,
      }))
    );
  };

  const handleEdit = (product: Product) => {
    // cleanup old previews from previous usage
    cleanupPreviews();

    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      colour: product.colour,
      size: product.size,
      category: product.category?.[0] || "POT",
    });

    // preload existing images into 5 slots
    setImageSlots(
      Array.from({ length: MAX_SLOTS }, (_, i) => ({
        file: null,
        previewUrl: null,
        existing: product.mediaUrl?.[i],
        removeExisting: false,
      }))
    );

    setIsDialogOpen(true);
  };

  // Change this if your backend expects a different key for multiple images
  const IMAGE_FIELD_KEY = "image";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // 1) Update details (JSON)
        await giftApi.updateDetails({
          giftId: editingProduct._id,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          colour: formData.colour,
          size: formData.size,
          category: formData.category,
        });

        // 2) Delete images (by public_id) if user marked any
        const publicIdsToDelete = imageSlots
          .filter((s) => s.existing && s.removeExisting)
          .map((s) => s.existing!.public_id);

        if (publicIdsToDelete.length > 0) {
          // IMPORTANT: adjust function name + payload to match your giftApi
          publicIdsToDelete.forEach(async (publicId) => {
            const deletingImg=await giftApi.deleteImages({
              giftId: editingProduct._id,
              publicId,
            });
            console.log("Deleted image response:",deletingImg);
          });
          // await giftApi.deleteImages({
          //   giftId: editingProduct._id,
          //   publicId: publicIdsToDelete,
          // });
        }

        // 3) Upload new images (multipart)
        const newFiles = imageSlots
          .filter((s) => s.file)
          .map((s) => s.file!) as File[];

        if (newFiles.length > 0) {
          const fd = new FormData();
          fd.append("giftId", editingProduct._id);
          newFiles.forEach((file) => fd.append(IMAGE_FIELD_KEY, file));

          // IMPORTANT: adjust function name to match your giftApi
          await giftApi.updateImages(fd);
        }

        toast.success("Product updated successfully");
      } else {
        // CREATE product (multipart)
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        fd.append("price", formData.price);
        fd.append("colour", formData.colour);
        fd.append("size", formData.size);
        fd.append("category", formData.category);

        const filesToUpload = imageSlots
          .filter((s) => s.file)
          .map((s) => s.file!) as File[];

        filesToUpload.forEach((file) => fd.append(IMAGE_FIELD_KEY, file));

        await giftApi.create(fd);

        toast.success("Product created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      const fetchGifts=fetchProducts();
      console.log("Fetched gifts:",fetchGifts);
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Products
          </h2>
          <p className="text-muted-foreground">
            Manage your flower arrangements and pots
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg gradient-card border-0">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Rose Bouquet"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (Rs.)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="1500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Colour</Label>
                  <Input
                    value={formData.colour}
                    onChange={(e) =>
                      setFormData({ ...formData, colour: e.target.value })
                    }
                    placeholder="Pink"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) =>
                      setFormData({ ...formData, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POT">Pot</SelectItem>
                      <SelectItem value="BOQUETS">Bouquet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Beautiful handcrafted arrangement..."
                />
              </div>

              {/* 5 Image Slots */}
              <div className="space-y-2">
                <Label>Images (max 5)</Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageSlots.map((slot, index) => {
                    const showUrl =
                      slot.previewUrl ?? slot.existing?.url ?? null;
                    const markedDelete =
                      !!slot.existing && !!slot.removeExisting;

                    return (
                      <div
                        key={index}
                        className="rounded-lg border bg-card p-2"
                      >
                        {/* REAL INPUT (hidden) */}
                        <Input
                          id={`img-slot-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const input = e.currentTarget;
                            const file = input.files?.[0] ?? null;
                            if (!file) return;

                            // safer total <= 5 calculation
                            const existingAfterDelete = imageSlots.filter(
                              (s) => s.existing && !s.removeExisting
                            ).length;

                            const newFilesOtherSlots = imageSlots.filter(
                              (s, i) => i !== index && !!s.file
                            ).length;

                            const total =
                              existingAfterDelete + newFilesOtherSlots + 1;
                            if (total > MAX_SLOTS) {
                              toast.error(
                                "You can upload only 5 images total."
                              );
                              input.value = "";
                              return;
                            }

                            const preview = URL.createObjectURL(file);

                            setImageSlots((prev) =>
                              prev.map((s, i) => {
                                if (i !== index) return s;

                                if (s.previewUrl)
                                  URL.revokeObjectURL(s.previewUrl); // avoid leaks [web:443]

                                return {
                                  ...s,
                                  file,
                                  previewUrl: preview,
                                  // replacing existing => mark old for delete
                                  removeExisting: s.existing
                                    ? true
                                    : s.removeExisting,
                                };
                              })
                            );

                            // allow selecting same file again
                            input.value = "";
                          }}
                        />

                        {/* CLICKABLE PREVIEW AREA (acts like upload input) */}
                        <label
                          htmlFor={`img-slot-${index}`}
                          className="block cursor-pointer select-none"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                            {showUrl ? (
                              <img
                                src={showUrl}
                                alt={`image-${index + 1}`}
                                className={`h-full w-full object-cover ${
                                  markedDelete ? "opacity-40" : ""
                                }`}
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center text-xs text-muted-foreground gap-1">
                                <div className="font-medium">
                                  Click to upload
                                </div>
                                <div>Slot {index + 1}</div>
                              </div>
                            )}

                            {/* small overlay hint */}
                            <div className="absolute inset-0 flex items-end justify-center  ">
                          <div className="rounded bg-black/50  px-2 py-1 text-[11px] text-white">
                            {showUrl ? "Click to replace" : "Upload"}
                          </div>
                        </div>


                            {markedDelete && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white bg-black/40">
                                Marked for delete
                              </div>
                            )}
                          </div>
                        </label>

                        {/* ACTIONS */}
                        <div className="mt-2 flex gap-2">
                          {/* <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() =>
                              document
                                .getElementById(`img-slot-${index}`)
                                ?.click()
                            }
                          >
                            {showUrl ? "Replace" : "Upload"}
                          </Button> */}

                          <Button
                            type="button"
                            variant="destructive"
                              className="h-8 w-8"   // override if you want smaller than default
                            onClick={(ev) => {
                              ev.preventDefault(); // important: don't trigger label click
                              ev.stopPropagation(); // important: don't trigger label click

                              setImageSlots((prev) =>
                                prev.map((s, i) => {
                                  if (i !== index) return s;

                                  if (s.previewUrl)
                                    URL.revokeObjectURL(s.previewUrl); // [web:443]

                                  // if existing and no new file, toggle mark delete
                                  if (s.existing && !s.file) {
                                    return {
                                      ...s,
                                      removeExisting: !s.removeExisting,
                                    };
                                  }

                                  // clear newly selected file
                                  return { ...s, file: null, previewUrl: null };
                                })
                              );
                            }}
                          >
                            <Trash2 className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Upload/Replace images per slot. Removing an existing image
                  marks it for deletion until you submit.
                </p>
              </div>

              <Button type="submit" variant="hero" className="w-full">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card className="gradient-card border-0 shadow-soft">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No products yet. Add your first product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden gradient-card border-0 shadow-soft hover:shadow-card transition-all group"
            >
              <div className="relative aspect-square bg-secondary">
                {product.mediaUrl && product.mediaUrl.length > 0 ? (
                  <img
                    src={product.mediaUrl[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center gradient-primary">
                    <span className="text-5xl">🌸</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.category.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    {product.size}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-foreground line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.colour}
                </p>
                <p className="font-display text-lg font-bold text-foreground mt-1">
                  Rs. {product.price.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsTab;

// import { useState, useEffect } from 'react';
// import { giftApi } from '@/lib/api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';
// import { Plus, Edit, Trash2, Image, Package } from 'lucide-react';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   colour: string;
//   size: string;
//   category: string[];
//   mediaUrl: { url: string; public_id: string; _id: string }[];
// }

// const ProductsTab = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     colour: '',
//     size: 'SMALL',
//     category: 'POT',
//   });
//   const [imageFile, setImageFile] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [deletedPublicIds, setDeletedPublicIds] = useState<string[]>([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const data = await giftApi.getAll();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       toast.error('Failed to fetch products');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (editingProduct) {
//         await giftApi.updateDetails({
//           giftId: editingProduct._id,
//           name: formData.name,
//           description: formData.description,
//           price: Number(formData.price),
//           colour: formData.colour,
//           size: formData.size,
//           category: formData.category,
//         });

//         toast.success('Product updated successfully');
//       } else {
//         const formDataToSend = new FormData();
//         formDataToSend.append('name', formData.name);
//         formDataToSend.append('description', formData.description);
//         formDataToSend.append('price', formData.price);
//         formDataToSend.append('colour', formData.colour);
//         formDataToSend.append('size', formData.size);
//         formDataToSend.append('category', formData.category);
//         if (imageFile) {
//           imageFile.forEach((file) => {
//             formDataToSend.append('image', file);
//           });
//           // formDataToSend.append('image', imageFile);
//         }
//         await giftApi.create(formDataToSend);
//         toast.success('Product created successfully');
//       }

//       setIsDialogOpen(false);
//       resetForm();
//       fetchProducts();
//     } catch (error) {
//       toast.error('Failed to save product');
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       description: product.description || '',
//       price: String(product.price),
//       colour: product.colour,
//       size: product.size,
//       category: product.category[0] || 'POT',

//     });
//     setIsDialogOpen(true);
//   };

//   const resetForm = () => {
//     setEditingProduct(null);
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       colour: '',
//       size: 'SMALL',
//       category: 'POT',
//     });
//     setImageFile([]);
//     setImagePreviews([]);
//   setDeletedPublicIds([]);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-pulse text-muted-foreground">Loading products...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
//           <p className="text-muted-foreground">Manage your flower arrangements and pots</p>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>

//           <DialogTrigger asChild>
//             <Button variant="hero">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Product
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg gradient-card border-0">
//             <DialogHeader>
//               <DialogTitle className="font-display text-2xl">
//                 {editingProduct ? 'Edit Product' : 'Add New Product'}
//               </DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   placeholder="Rose Bouquet"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Price (Rs.)</Label>
//                   <Input
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                     placeholder="1500"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Colour</Label>
//                   <Input
//                     value={formData.colour}
//                     onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
//                     placeholder="Pink"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Size</Label>
//                   <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="SMALL">Small</SelectItem>
//                       <SelectItem value="MEDIUM">Medium</SelectItem>
//                       <SelectItem value="LARGE">Large</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Category</Label>
//                   <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="POT">Pot</SelectItem>
//                       <SelectItem value="BOQUETS">Bouquet</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Input
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   placeholder="Beautiful handcrafted arrangement..."
//                 />
//               </div>

//                 <div className="space-y-2">
//                   <Label>Image</Label>
//                   <Input
//                     type="file"
//                     accept="image/*"
//                      multiple={true}
//                     onChange={(e) =>

//                         {const files = Array.from(e.target.files ?? []); // FileList -> Array [web:409]
//                         const limited = files.slice(0, 5);

//                      // If editing and product already has images, enforce total <= 5
//                         const existingCount = editingProduct?.mediaUrl?.length ?? 0;
//                         const remainingSlots = Math.max(0, 5 - (existingCount - deletedPublicIds.length));
//                         const finalSelection = limited.slice(0, remainingSlots);

//                         setImageFile(finalSelection);
//                         setImagePreviews(finalSelection.map((f) => URL.createObjectURL(f)));
//                       // setImageFile(e.target.files?.[0] || null)
//                     }
//                       }
//                   />
//                 </div>

//               <Button type="submit" variant="hero" className="w-full">
//                 {editingProduct ? 'Update Product' : 'Create Product'}
//               </Button>
//               {editingProduct?.mediaUrl?.length ? (
//       <div className="space-y-2">
//       <Label>Existing Images</Label>

//     <div className="grid grid-cols-3 gap-2">
//       {editingProduct.mediaUrl.map((img) => {
//         const marked = deletedPublicIds.includes(img.public_id);

//         return (
//           <div key={img.public_id} className="relative">
//             <img
//               src={img.url}
//               className={`h-24 w-full rounded object-cover ${marked ? "opacity-40" : ""}`}
//               alt="product"
//             />

//             <Button
//               type="button"
//               size="icon"
//               variant={marked ? "secondary" : "destructive"}
//               className="absolute top-1 right-1"
//               onClick={(ev) => {
//                 ev.preventDefault();
//                 ev.stopPropagation();

//                 setDeletedPublicIds((prev) =>
//                   prev.includes(img.public_id)
//                     ? prev.filter((id) => id !== img.public_id)
//                     : [...prev, img.public_id]
//                 );
//               }}
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>
//         );
//       })}
//     </div>

//     <p className="text-xs text-muted-foreground">
//       Mark images to delete. They will be removed when you click “Update Product”.
//     </p>
//   </div>
//     ) : null}
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {products.length === 0 ? (
//         <Card className="gradient-card border-0 shadow-soft">
//           <CardContent className="py-12 text-center">
//             <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
//             <p className="text-muted-foreground">No products yet. Add your first product!</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <Card key={product._id} className="overflow-hidden gradient-card border-0 shadow-soft hover:shadow-card transition-all group">
//               <div className="relative aspect-square bg-secondary">
//                 {product.mediaUrl && product.mediaUrl.length > 0 ? (
//                   <img
//                     src={product.mediaUrl[0].url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center gradient-primary">
//                     <span className="text-5xl">🌸</span>
//                   </div>
//                 )}
//                 <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <Button size="icon" variant="secondary" onClick={() => handleEdit(product)}>
//                     <Edit className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//               <CardContent className="p-4">
//                 <div className="flex flex-wrap gap-1 mb-2">
//                   {product.category.map((cat) => (
//                     <Badge key={cat} variant="secondary" className="text-xs">
//                       {cat}
//                     </Badge>
//                   ))}
//                   <Badge className="bg-accent text-accent-foreground text-xs">{product.size}</Badge>
//                 </div>
//                 <h3 className="font-display font-semibold text-foreground line-clamp-1">{product.name}</h3>
//                 <p className="text-sm text-muted-foreground">{product.colour}</p>
//                 <p className="font-display text-lg font-bold text-foreground mt-1">
//                   Rs. {product.price.toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsTab;
