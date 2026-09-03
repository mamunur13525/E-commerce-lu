import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  List, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  X,
  Package
} from 'lucide-react';
import { Category } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, addToast } = useStore();

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSubCollections, setFormSubCollections] = useState('All, Tops, Bottoms, Accessories');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('');
    setFormFeatured(false);
    setFormSubCollections('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description);
    setFormImage(cat.image);
    setFormFeatured(!!cat.featured);
    setFormSubCollections(cat.subCollections ? cat.subCollections.map(s => s.name).join(', ') : 'All');
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug = formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-');
    const subs = formSubCollections.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      itemCount: products.filter(p => p.category === slug).length || 5,
    }));

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName.trim(),
        slug,
        description: formDescription.trim(),
        image: formImage.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        featured: formFeatured,
        subCollections: subs,
      });
    } else {
      addCategory({
        name: formName.trim(),
        slug,
        description: formDescription.trim() || 'Curated departmental collection.',
        image: formImage.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        iconName: 'Layers',
        itemCount: 0,
        featured: formFeatured,
        subCollections: subs,
      });
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Departments & Categories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize catalog hierarchy, banner imagery, and sub-collection groupings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <Button
              size="icon"
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              onClick={() => setViewMode('card')}
              className="w-8 h-8 rounded-lg"
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="w-8 h-8 rounded-lg"
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            onClick={handleOpenAdd}
            className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Card Grid View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => {
            const productCount = products.filter(p => p.category === cat.slug).length;

            return (
              <Card 
                key={cat.id} 
                className="bg-white rounded-3xl border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    {cat.featured && (
                      <Badge className="absolute top-3 left-3 bg-slate-950 text-white font-bold text-[9px]">
                        Featured Dept
                      </Badge>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-950">{cat.name}</h3>
                      <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                        {productCount} items
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>

                    {/* Sub-collections tags */}
                    {cat.subCollections && cat.subCollections.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        {cat.subCollections.map(sub => (
                          <span key={sub.id} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(cat)}
                    className="rounded-xl text-xs font-bold h-8"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="rounded-xl text-xs font-bold h-8 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List Table View */}
      {viewMode === 'list' && (
        <Card className="bg-white rounded-3xl border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Category & Banner</th>
                <th className="py-3.5 px-4">Slug Identifier</th>
                <th className="py-3.5 px-4">Sub-Collections</th>
                <th className="py-3.5 px-4">Products Linked</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map(cat => {
                const productCount = products.filter(p => p.category === cat.slug).length;

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={cat.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{cat.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">/{cat.slug}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-600">
                        {cat.subCollections ? cat.subCollections.map(s => s.name).join(', ') : 'All'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {productCount} SKUs
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEdit(cat)}
                          className="w-8 h-8 rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="w-8 h-8 rounded-lg text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add / Edit Category Right Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-black text-slate-950">
              {editingCategory ? 'Edit Department' : 'Create New Category'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Configure banner imagery, slug routing, and sub-collections.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Category Name
              </label>
              <Input
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Heirloom Homeware"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                URL Slug (e.g. homeware)
              </label>
              <Input
                value={formSlug}
                onChange={e => setFormSlug(e.target.value)}
                placeholder="homeware"
                className="bg-slate-50 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Cover Banner Image URL
              </label>
              <Input
                value={formImage}
                onChange={e => setFormImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Sub-Collections (Comma-separated)
              </label>
              <Input
                value={formSubCollections}
                onChange={e => setFormSubCollections(e.target.value)}
                placeholder="Tops, Pants, Outerwear, Ceramics"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Brief category philosophy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="featured-category-switch"
                checked={formFeatured}
                onCheckedChange={setFormFeatured}
              />
              <label htmlFor="featured-category-switch" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                Show in Featured Navigation
              </label>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider h-11"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>{editingCategory ? 'Update Department' : 'Create Department'}</span>
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
