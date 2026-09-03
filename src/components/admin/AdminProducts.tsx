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
  CheckCircle2,
  FolderPlus,
  Settings2,
  Palette,
  Ruler,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Product, ProductStatus } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { LexicalRichTextEditor } from './LexicalRichTextEditor';
import { ImageKitUploader } from '../common/ImageKitUploader';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory, 
    addToast 
  } = useStore();

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
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string>('Artisan, Handcrafted');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);

  // New User-Requested Product Attributes
  const [formEnableSizes, setFormEnableSizes] = useState(false);
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [newSizeInput, setNewSizeInput] = useState('');

  const [formEnableColors, setFormEnableColors] = useState(false);
  const [formColors, setFormColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Onyx Black', hex: '#1e293b' },
    { name: 'Warm Cream', hex: '#f1f5f9' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#0f172a');

  const [formProductStatus, setFormProductStatus] = useState<ProductStatus>('in_stock');
  const [formUnit, setFormUnit] = useState('pcs');
  const [formAllowOnlinePayment, setFormAllowOnlinePayment] = useState(true);
  const [formAllowCod, setFormAllowCod] = useState(true);

  // Inline Category Management in Product Drawer
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showManageCategories, setShowManageCategories] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormSku('');
    setFormPrice(0);
    setFormOriginalPrice(undefined);
    setFormCategory(categories[0]?.slug || 'general');
    setFormStock(0);
    setFormInStock(true);
    setFormDescription('');
    setFormDetailedDescription('');
    setFormImages([]);
    setFormTags('');
    setFormIsFeatured(false);
    setFormIsBestSeller(false);
    setFormEnableSizes(false);
    setFormSizes(['S', 'M', 'L', 'XL']);
    setNewSizeInput('');
    setFormEnableColors(false);
    setFormColors([
      { name: 'Onyx Black', hex: '#1e293b' },
      { name: 'Warm Cream', hex: '#f1f5f9' },
    ]);
    setNewColorName('');
    setNewColorHex('#0f172a');
    setFormProductStatus('in_stock');
    setFormUnit('pcs');
    setFormAllowOnlinePayment(true);
    setFormAllowCod(true);
    setEditingProduct(null);
    setIsAddingCategory(false);
    setNewCategoryName('');
    setShowManageCategories(false);
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
    setFormTags(product.tags ? product.tags.join(', ') : '');
    setFormIsFeatured(!!product.isFeatured);
    setFormIsBestSeller(!!product.isBestSeller);
    setFormEnableSizes(!!product.enableSizes);
    setFormSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']);
    setNewSizeInput('');
    setFormEnableColors(!!product.enableColors);
    setFormColors(product.colors && product.colors.length > 0 ? product.colors : [
      { name: 'Onyx Black', hex: '#1e293b' },
      { name: 'Warm Cream', hex: '#f1f5f9' },
    ]);
    setNewColorName('');
    setNewColorHex('#0f172a');
    setFormProductStatus(product.productStatus || (product.inStock ? 'in_stock' : 'out_of_stock'));
    setFormUnit(product.unit || 'pcs');
    setFormAllowOnlinePayment(product.allowOnlinePayment !== false);
    setFormAllowCod(product.allowCod !== false);
    setIsDrawerOpen(true);
  };

  // Direct Category Management Handlers
  const handleDirectAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) return;

    const trimmed = newCategoryName.trim();
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    
    // Check if category already exists
    const existing = categories.find(c => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setFormCategory(existing.slug);
      setIsAddingCategory(false);
      setNewCategoryName('');
      return;
    }

    addCategory({
      name: trimmed,
      slug,
      description: `${trimmed} collection and catalog department.`,
      image: formImages[0] || '',
      iconName: 'Layers',
      itemCount: 0,
      subCollections: [
        { id: 'all', name: 'All', slug: 'all', itemCount: 0 },
        { id: 'new', name: 'New Releases', slug: 'new', itemCount: 0 }
      ],
    });

    setFormCategory(slug);
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleDirectDeleteCategory = (id: string, name: string, slug: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id);
      if (formCategory === slug) {
        const remaining = categories.filter(c => c.id !== id);
        setFormCategory(remaining[0]?.slug || '');
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const parsedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const finalImages = formImages;

    const isStockAvailable = formProductStatus === 'out_of_stock' ? false : (Number(formStock) > 0 && formInStock);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim(),
        sku: formSku.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        category: formCategory,
        stockQuantity: Number(formStock),
        inStock: isStockAvailable,
        description: formDescription.trim(),
        detailedDescription: formDetailedDescription.trim() || formDescription.trim(),
        images: finalImages,
        tags: parsedTags,
        isFeatured: formIsFeatured,
        isBestSeller: formIsBestSeller,
        enableSizes: formEnableSizes,
        sizes: formEnableSizes ? formSizes : [],
        enableColors: formEnableColors,
        colors: formEnableColors ? formColors : [],
        productStatus: formProductStatus,
        unit: formUnit.trim() || 'pcs',
        allowOnlinePayment: formAllowOnlinePayment,
        allowCod: formAllowCod,
      });
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
        inStock: isStockAvailable,
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
        enableSizes: formEnableSizes,
        sizes: formEnableSizes ? formSizes : [],
        enableColors: formEnableColors,
        colors: formEnableColors ? formColors : [],
        productStatus: formProductStatus,
        unit: formUnit.trim() || 'pcs',
        allowOnlinePayment: formAllowOnlinePayment,
        allowCod: formAllowCod,
        createdAt: new Date().toISOString(),
      });
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Products
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store's items, pricing, and stock.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium gap-1.5 shadow-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 bg-slate-50 rounded-lg text-xs h-9 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 h-9 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <Card className="bg-white rounded-xl border-slate-200/80 shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4">Status & Stock</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'} 
                        alt={p.name} 
                        className="w-9 h-10 rounded-md object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-[180px] sm:max-w-xs">
                        <p className="font-medium text-slate-900 truncate">{p.name}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          {p.enableSizes && p.sizes && p.sizes.length > 0 && (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {p.sizes.length} sizes
                            </span>
                          )}
                          {p.enableColors && p.colors && p.colors.length > 0 && (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {p.colors.length} colors
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="capitalize text-xs text-slate-600">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono">
                      <span className="text-xs font-semibold text-slate-900">{formatCurrency(p.price)}</span>
                      {p.unit && (
                        <span className="text-[10px] text-slate-400 font-sans ml-1">/{p.unit}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {p.productStatus === 'out_of_stock' || !p.inStock ? (
                        <Badge variant="outline" className="text-[9px] font-bold text-rose-700 bg-rose-50 border-rose-200">
                          Out of Stock
                        </Badge>
                      ) : p.productStatus === 'pre_order' ? (
                        <Badge variant="outline" className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border-indigo-200">
                          Pre-Order ({p.stockQuantity})
                        </Badge>
                      ) : p.productStatus === 'draft' ? (
                        <Badge variant="outline" className="text-[9px] font-bold text-slate-700 bg-slate-100 border-slate-200">
                          Draft
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
                          In Stock ({p.stockQuantity})
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {p.allowCod !== false && (
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                          COD
                        </span>
                      )}
                      {p.allowOnlinePayment !== false && (
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                          Online
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenEdit(p)}
                        className="w-7 h-7 text-slate-600 hover:text-slate-900 rounded"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="w-7 h-7 text-slate-400 hover:text-rose-600 rounded"
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
            <SheetTitle className="text-xl font-bold text-slate-950">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Enter product details and images.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-4">
            {/* Title & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Name</label>
                <Input
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Linen Shirt"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">SKU</label>
                <Input
                  required
                  value={formSku}
                  onChange={e => setFormSku(e.target.value)}
                  placeholder="LUM-001"
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={e => setFormPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="bg-slate-50 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Original Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formOriginalPrice || ''}
                  onChange={e => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Category & Stock Management */}
            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Category</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManageCategories(prev => !prev)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>{showManageCategories ? 'Hide List' : `Manage (${categories.length})`}</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(prev => !prev)}
                    className="text-xs font-semibold text-slate-950 hover:text-slate-700 flex items-center gap-1 transition-colors bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Category</span>
                  </button>
                </div>
              </div>

              {/* Inline Add Category Field */}
              {isAddingCategory && (
                <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Add New Category</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDirectAddCategory();
                        }
                      }}
                      placeholder="e.g. Footwear, Watches, Shirts..."
                      className="text-xs bg-slate-50 rounded-lg h-9"
                    />
                    <Button
                      type="button"
                      onClick={() => handleDirectAddCategory()}
                      disabled={!newCategoryName.trim()}
                      className="bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold rounded-lg h-9 px-3 shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* Category Dropdown and Delete Action for Active Item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Select Category</label>
                  {categories.length === 0 ? (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                      <span>No categories yet.</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className="underline font-bold text-amber-900 ml-2"
                      >
                        Create One
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 h-10 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                      {formCategory && (
                        (() => {
                          const currentCat = categories.find(c => c.slug === formCategory);
                          if (!currentCat) return null;
                          return (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDirectDeleteCategory(currentCat.id, currentCat.name, currentCat.slug)}
                              title={`Delete category "${currentCat.name}"`}
                              className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          );
                        })()
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Stock Quantity</label>
                  <Input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="bg-white rounded-xl text-xs font-mono h-10"
                  />
                </div>
              </div>

              {/* Manage All Categories List / Chips with Quick Delete */}
              {showManageCategories && categories.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      All Categories (click trash to delete):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                    {categories.map(cat => {
                      const isSelected = formCategory === cat.slug;
                      return (
                        <div
                          key={cat.id}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setFormCategory(cat.slug)}
                            className="font-medium text-xs text-left"
                          >
                            {cat.name}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDirectDeleteCategory(cat.id, cat.name, cat.slug);
                            }}
                            title={`Delete category "${cat.name}"`}
                            className={`p-0.5 rounded hover:bg-rose-500 hover:text-white transition-colors ml-1 ${
                              isSelected ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Status & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Status</label>
                <select
                  value={formProductStatus}
                  onChange={e => setFormProductStatus(e.target.value as ProductStatus)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 h-10 focus:outline-none"
                >
                  <option value="in_stock">In Stock (Instant Checkout)</option>
                  <option value="out_of_stock">Out of Stock (Sold Out)</option>
                  <option value="pre_order">Pre-Order (Advance Order)</option>
                  <option value="draft">Draft (Preview Mode)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Unit</label>
                <div className="flex gap-1.5">
                  <Input
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    placeholder="e.g. pcs, pair, set"
                    className="bg-white rounded-xl text-xs h-10 flex-1"
                  />
                  <div className="flex gap-1">
                    {['pcs', 'pair', 'set', 'pack'].map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormUnit(u)}
                        className={`text-[10px] px-2 h-10 rounded-lg border font-medium transition-colors ${
                          formUnit === u ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ImageKit Upload & Preview (Sample images removed) */}
            <ImageKitUploader
              images={formImages}
              onImagesChange={setFormImages}
              maxImages={8}
              folder="/lumina-products"
              label="Product Images (ImageKit Upload & URL)"
              helperText="Upload files directly to ImageKit or paste image links. All sample images removed."
            />

            {/* Product Sizes Section */}
            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Product Sizes</span>
                    <span className="text-[11px] text-slate-500">Enable size variants for customer selection</span>
                  </div>
                </div>
                <Switch
                  checked={formEnableSizes}
                  onCheckedChange={setFormEnableSizes}
                />
              </div>

              {formEnableSizes && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 mr-1">Presets:</span>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (!formSizes.includes(sz)) {
                            setFormSizes(prev => [...prev, sz]);
                          }
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        + {sz}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newSizeInput}
                      onChange={e => setNewSizeInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSizeInput.trim() && !formSizes.includes(newSizeInput.trim())) {
                            setFormSizes(prev => [...prev, newSizeInput.trim()]);
                            setNewSizeInput('');
                          }
                        }
                      }}
                      placeholder="Add custom size (e.g. 32, EU 42, 100ml)..."
                      className="bg-white rounded-xl text-xs h-9"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newSizeInput.trim() && !formSizes.includes(newSizeInput.trim())) {
                          setFormSizes(prev => [...prev, newSizeInput.trim()]);
                          setNewSizeInput('');
                        }
                      }}
                      disabled={!newSizeInput.trim()}
                      className="rounded-xl text-xs h-9 px-3 bg-slate-900 text-white shrink-0"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Active sizes chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formSizes.map((sz, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                      >
                        {sz}
                        <button
                          type="button"
                          onClick={() => setFormSizes(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-rose-300 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Colors Section */}
            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Product Colors</span>
                    <span className="text-[11px] text-slate-500">Enable color variants for this item</span>
                  </div>
                </div>
                <Switch
                  checked={formEnableColors}
                  onCheckedChange={setFormEnableColors}
                />
              </div>

              {formEnableColors && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 mr-1">Palettes:</span>
                    {[
                      { name: 'Onyx Black', hex: '#0f172a' },
                      { name: 'Snow White', hex: '#ffffff' },
                      { name: 'Warm Cream', hex: '#f8fafc' },
                      { name: 'Slate Gray', hex: '#64748b' },
                      { name: 'Forest Olive', hex: '#166534' },
                      { name: 'Burgundy', hex: '#881337' },
                      { name: 'Navy Blue', hex: '#1e3a8a' },
                      { name: 'Camel Tan', hex: '#b45309' },
                    ].map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          if (!formColors.some(c => c.name === preset.name)) {
                            setFormColors(prev => [...prev, preset]);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={newColorName}
                      onChange={e => setNewColorName(e.target.value)}
                      placeholder="Color Name (e.g. Cobalt)"
                      className="bg-white rounded-xl text-xs h-9 sm:col-span-2"
                    />
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={e => setNewColorHex(e.target.value)}
                        className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                        title="Pick color code"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newColorName.trim()) {
                            setFormColors(prev => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
                            setNewColorName('');
                          }
                        }}
                        disabled={!newColorName.trim()}
                        className="rounded-xl text-xs h-9 px-3 bg-slate-900 text-white flex-1"
                      >
                        Add Color
                      </Button>
                    </div>
                  </div>

                  {/* Active colors chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                        <span>{color.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormColors(prev => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options Section */}
            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Payment Options</span>
                  <span className="text-[11px] text-slate-500">Configure accepted payment methods for this product</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Online Payment</span>
                    <span className="text-[10px] text-slate-500">Cards, Apple Pay, Wallet</span>
                  </div>
                  <Switch
                    checked={formAllowOnlinePayment}
                    onCheckedChange={setFormAllowOnlinePayment}
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-slate-500">Pay when order delivered</span>
                  </div>
                  <Switch
                    checked={formAllowCod}
                    onCheckedChange={setFormAllowCod}
                  />
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Short Description</label>
              <textarea
                rows={2}
                required
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Description</label>
              <LexicalRichTextEditor
                key={editingProduct ? editingProduct.id : 'new-product-editor'}
                value={formDetailedDescription}
                onChange={setFormDetailedDescription}
                placeholder="Write full product details and description..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tags</label>
              <Input
                value={formTags}
                onChange={e => setFormTags(e.target.value)}
                placeholder="e.g. Summer, Linen, Classic (comma-separated)"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2">
              <label className="flex items-center gap-3 text-xs font-semibold text-slate-800 cursor-pointer select-none">
                <Switch
                  id="featured-hero-switch"
                  checked={formIsFeatured}
                  onCheckedChange={setFormIsFeatured}
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-semibold text-slate-800 cursor-pointer select-none">
                <Switch
                  id="bestseller-badge-switch"
                  checked={formIsBestSeller}
                  onCheckedChange={setFormIsBestSeller}
                />
                <span>Bestseller</span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold text-xs h-11"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>{editingProduct ? 'Save Changes' : 'Add Product'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-xl text-xs font-semibold h-11"
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
