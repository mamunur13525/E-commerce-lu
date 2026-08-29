import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  X, 
  Upload, 
  DollarSign, 
  Layers, 
  Tag, 
  FileText,
  Sliders,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formCategory, setFormCategory] = useState('apparel');
  const [formStock, setFormStock] = useState<number>(25);
  const [formInStock, setFormInStock] = useState(true);
  const [formDescription, setFormDescription] = useState('');
  const [formDetailedDescription, setFormDetailedDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string>('Artisan, Handcrafted');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormSku(`LUM-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(100);
    setFormOriginalPrice(undefined);
    setFormCategory(categories[0]?.slug || 'apparel');
    setFormStock(25);
    setFormInStock(true);
    setFormDescription('');
    setFormDetailedDescription('');
    setFormImageUrl('');
    setFormImages(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80']);
    setFormTags('Artisan, Bestseller');
    setFormIsFeatured(false);
    setFormIsBestSeller(false);
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormCategory(product.category);
    setFormStock(product.stockQuantity);
    setFormInStock(product.inStock);
    setFormDescription(product.description);
    setFormDetailedDescription(product.detailedDescription || product.description);
    setFormImages(product.images || []);
    setFormImageUrl('');
    setFormTags(product.tags ? product.tags.join(', ') : '');
    setFormIsFeatured(!!product.isFeatured);
    setFormIsBestSeller(!!product.isBestSeller);
    setIsDrawerOpen(true);
  };

  const handleAddImageUrl = () => {
    if (formImageUrl.trim()) {
      setFormImages(prev => [...prev, formImageUrl.trim()]);
      setFormImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  // ImageKit / Preset Asset Quick Select
  const handleQuickAddPreset = (url: string) => {
    setFormImages(prev => [...prev, url]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const parsedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const finalImages = formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim(),
        sku: formSku.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        category: formCategory,
        stockQuantity: Number(formStock),
        inStock: Number(formStock) > 0 && formInStock,
        description: formDescription.trim(),
        detailedDescription: formDetailedDescription.trim() || formDescription.trim(),
        images: finalImages,
        tags: parsedTags,
        isFeatured: formIsFeatured,
        isBestSeller: formIsBestSeller,
      });
      addToast('Product Updated', `${formName} specifications updated.`, 'success');
    } else {
      addProduct({
        name: formName.trim(),
        slug: formName.toLowerCase().replace(/\s+/g, '-'),
        sku: formSku.trim() || `LUM-${Math.floor(1000 + Math.random() * 9000)}`,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        category: formCategory,
        subCategory: 'all',
        stockQuantity: Number(formStock),
        inStock: Number(formStock) > 0 && formInStock,
        description: formDescription.trim() || 'Handcrafted artisan lifestyle product.',
        detailedDescription: formDetailedDescription.trim() || formDescription.trim(),
        images: finalImages,
        tags: parsedTags,
        rating: 5.0,
        reviewCount: 1,
        isFeatured: formIsFeatured,
        isBestSeller: formIsBestSeller,
        isNewArrival: true,
        isPopular: true,
        createdAt: new Date().toISOString(),
      });
      addToast('Product Created', `${formName} added to the catalog.`, 'success');
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
      addToast('Product Deleted', `${name} has been removed.`, 'info');
    }
  };

  // Filtered List
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Products & Inventory Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product pricing, ImageKit photos, rich descriptions, and stock quantities.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by title, SKU, tags or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 rounded-xl text-xs h-10 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 h-10 focus:outline-none"
          >
            <option value="all">All Departments ({products.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <Card className="bg-white rounded-3xl border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Sale Price</th>
                <th className="py-3.5 px-4">Inventory</th>
                <th className="py-3.5 px-4">Tags & Flags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-10 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                        <p className="font-bold text-slate-900 truncate">{p.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className="capitalize text-[10px] font-bold text-slate-700">
                      {p.category}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-black text-slate-950 text-xs block">{formatCurrency(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatCurrency(p.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.inStock && p.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="font-bold font-mono text-slate-800">{p.stockQuantity} in stock</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isBestSeller && <Badge className="bg-slate-950 text-white text-[9px] py-0">Bestseller</Badge>}
                      {p.isFeatured && <Badge className="bg-amber-400 text-slate-950 font-bold text-[9px] py-0">Featured</Badge>}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenEdit(p)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-200"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="w-8 h-8 rounded-lg hover:bg-rose-100 text-rose-600"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Product Right Side Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-black text-slate-950">
              {editingProduct ? 'Edit Product Specifications' : 'Add New Product to Catalog'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Configure pricing, ImageKit links, descriptions, and stock quantities.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-5">
            {/* Title & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Product Title</label>
                <Input
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Japanese Canvas Chore Coat"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">SKU</label>
                <Input
                  required
                  value={formSku}
                  onChange={e => setFormSku(e.target.value)}
                  placeholder="LUM-001"
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Pricing: Price and Original/Final Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Current Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={e => setFormPrice(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Original Price (Strike-through)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formOriginalPrice || ''}
                  onChange={e => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional original price"
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Category & Stock Management */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Department / Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 h-10"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Stock Quantity</label>
                <Input
                  type="number"
                  required
                  value={formStock}
                  onChange={e => setFormStock(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Image Gallery & ImageKit Upload Link */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Product Images (ImageKit / Unsplash URL)</label>
              
              <div className="flex gap-2">
                <Input
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://ik.imagekit.io/...)"
                  className="bg-slate-50 rounded-xl text-xs flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddImageUrl} 
                  variant="secondary"
                  className="rounded-xl text-xs font-bold"
                >
                  Add Image
                </Button>
              </div>

              {/* Quick ImageKit Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
                {[
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
                  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
                  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
                  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
                ].map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickAddPreset(url)}
                    className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300 hover:opacity-80 flex-shrink-0"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Active Image Previews */}
              <div className="flex flex-wrap gap-2 pt-1">
                {formImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Short Summary</label>
              <textarea
                rows={2}
                required
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Brief summary for shop cards..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            {/* Rich Detailed Description */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Rich Description & Craftsmanship Details</label>
              <textarea
                rows={4}
                value={formDetailedDescription}
                onChange={e => setFormDetailedDescription(e.target.value)}
                placeholder="Detailed story, yarn composition, care instructions..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
              />
            </div>

            {/* Tags & Flags */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Tags (Comma-separated)</label>
              <Input
                value={formTags}
                onChange={e => setFormTags(e.target.value)}
                placeholder="Artisan, Linen, Limited Edition"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={e => setFormIsFeatured(e.target.checked)}
                  className="rounded"
                />
                <span>Featured Hero Item</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsBestSeller}
                  onChange={e => setFormIsBestSeller(e.target.checked)}
                  className="rounded"
                />
                <span>Bestseller Badge</span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider h-11"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-xl text-xs font-bold h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

    </div>
  );
};
