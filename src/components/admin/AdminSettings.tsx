import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sliders, 
  Sparkles, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  MessageSquare, 
  Check, 
  Layers,
  Megaphone,
  Bell,
  Link as LinkIcon
} from 'lucide-react';
import { HeroSlide, FacebookReview } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export const AdminSettings: React.FC = () => {
  const { 
    heroSlides, 
    updateHeroSlides, 
    facebookReviews, 
    updateFacebookReviews, 
    addFacebookReview,
    deleteFacebookReview,
    updateFacebookReview,
    storeSettings, 
    updateStoreSettings, 
    addToast 
  } = useStore();

  const [activeSection, setActiveSection] = useState<'hero' | 'testimonials' | 'announcements'>('hero');

  // Hero Slide Edit State
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false);
  const [editingSlideIdx, setEditingSlideIdx] = useState<number | null>(null);
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    id: 'hero-new',
    title: 'Minimalist Artisan Archive',
    subtitle: 'Hand-dyed linen & Japanese ceramics',
    tagline: 'Spring Release',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&q=80',
    ctaText: 'Explore Collection',
    ctaLink: 'shop',
    badge: 'Limited Run'
  });

  // Testimonial Edit State
  const [isTestimonialDrawerOpen, setIsTestimonialDrawerOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<FacebookReview | null>(null);
  const [testForm, setTestForm] = useState<Partial<FacebookReview>>({
    authorName: '',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    authorLocation: 'New York, NY',
    rating: 5,
    timeAgo: '2 days ago',
    content: '',
    productMentioned: 'Japanese Canvas Chore Coat',
    verifiedPurchase: true,
    likes: 24,
    comments: 3,
    shares: 2
  });

  // Announcement State
  const [announcementText, setAnnouncementText] = useState(storeSettings.announcementText);
  const [showAnnouncement, setShowAnnouncement] = useState(storeSettings.showAnnouncement);
  const [promoCode, setPromoCode] = useState(storeSettings.promoCode);
  const [promoDiscount, setPromoDiscount] = useState(storeSettings.promoDiscountPercent);

  // Hero Slide Handlers
  const handleOpenEditSlide = (slide: HeroSlide, idx: number) => {
    setEditingSlideIdx(idx);
    setSlideForm({ ...slide });
    setIsSlideDrawerOpen(true);
  };

  const handleOpenAddSlide = () => {
    setEditingSlideIdx(null);
    setSlideForm({
      id: `hero-${Date.now()}`,
      title: 'Heirloom Studio Editions',
      subtitle: 'Limited seasonal batch releases handcrafted in Kyoto',
      tagline: 'New Season',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&q=80',
      ctaText: 'Shop New Arrivals',
      ctaLink: 'shop',
      badge: 'Exclusive'
    });
    setIsSlideDrawerOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlideIdx !== null) {
      const updated = [...heroSlides];
      updated[editingSlideIdx] = slideForm;
      updateHeroSlides(updated);
      addToast('Hero Slide Updated', 'Changes applied to the home hero carousel.', 'success');
    } else {
      updateHeroSlides([...heroSlides, slideForm]);
      addToast('Hero Slide Added', 'New slide added to the hero carousel.', 'success');
    }
    setIsSlideDrawerOpen(false);
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      addToast('Cannot Delete', 'At least one hero slide is required.', 'error');
      return;
    }
    const updated = heroSlides.filter((_, i) => i !== idx);
    updateHeroSlides(updated);
    addToast('Slide Removed', 'Hero slide deleted.', 'info');
  };

  // Testimonial Handlers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestForm({
      authorName: '',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
      authorLocation: 'San Francisco, CA',
      rating: 5,
      timeAgo: 'Just now',
      content: 'The drape and weave of this piece is exceptional. Superb quality.',
      productMentioned: 'Linen Overshirt',
      verifiedPurchase: true,
      likes: 12,
      comments: 1,
      shares: 0
    });
    setIsTestimonialDrawerOpen(true);
  };

  const handleOpenEditTestimonial = (test: FacebookReview) => {
    setEditingTestimonial(test);
    setTestForm(test);
    setIsTestimonialDrawerOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.authorName || !testForm.content) return;

    if (editingTestimonial) {
      updateFacebookReview(editingTestimonial.id, testForm);
      addToast('Testimonial Updated', 'Customer story updated.', 'success');
    } else {
      addFacebookReview({
        authorName: testForm.authorName!,
        authorAvatar: testForm.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
        authorLocation: testForm.authorLocation || 'Verified Buyer',
        rating: Number(testForm.rating || 5),
        timeAgo: 'Recently',
        content: testForm.content!,
        productMentioned: testForm.productMentioned || 'Studio Piece',
        verifiedPurchase: !!testForm.verifiedPurchase,
        likes: Number(testForm.likes || 15),
        comments: Number(testForm.comments || 2),
        shares: Number(testForm.shares || 1),
      });
      addToast('Testimonial Published', 'New customer review added to the live slider.', 'success');
    }
    setIsTestimonialDrawerOpen(false);
  };

  // Announcement Handlers
  const handleSaveAnnouncements = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      announcementText,
      showAnnouncement,
      promoCode,
      promoDiscountPercent: Number(promoDiscount)
    });
    addToast('Settings Saved', 'Top store banner and global promotions updated.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Storefront Settings & Visual Customization
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the hero banner slides, customer testimonial carousel, and announcement notifications.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          {[
            { id: 'hero', label: `Hero Slides (${heroSlides.length})` },
            { id: 'testimonials', label: `Testimonials (${facebookReviews.length})` },
            { id: 'announcements', label: 'Store Banner & Promos' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === tab.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: HERO SLIDER MANAGEMENT */}
      {activeSection === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Configure full-width banner slides shown on the homepage hero.</p>
            <Button
              onClick={handleOpenAddSlide}
              className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Slide</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => (
              <Card key={slide.id || idx} className="bg-white rounded-3xl border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-slate-900">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{slide.tagline}</span>
                      <h3 className="text-base font-black leading-tight">{slide.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{slide.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Button: <strong className="text-slate-900">{slide.ctaText}</strong></span>
                    <Badge variant="outline" className="text-[10px] font-mono font-bold">Slide #{idx + 1}</Badge>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEditSlide(slide, idx)}
                    className="rounded-xl text-xs font-bold h-8"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Slide</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteSlide(idx)}
                    className="rounded-xl text-xs font-bold h-8 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: TESTIMONIALS & REVIEWS SLIDER */}
      {activeSection === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage stories shown in the "Real Stories from Satisfied Owners" 1-second auto slider.
            </p>
            <Button
              onClick={handleOpenAddTestimonial}
              className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facebookReviews.map(test => (
              <Card key={test.id} className="p-4 bg-white rounded-3xl border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img src={test.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{test.authorName}</p>
                        <p className="text-[10px] text-slate-400">{test.authorLocation}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < test.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3 italic">
                    "{test.content}"
                  </p>

                  <Badge variant="secondary" className="text-[9px] px-2 py-0.5">
                    Product: {test.productMentioned}
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEditTestimonial(test)}
                    className="rounded-xl text-xs font-bold h-8"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Remove review by ${test.authorName}?`)) {
                        deleteFacebookReview(test.id);
                      }
                    }}
                    className="rounded-xl text-xs font-bold h-8 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ANNOUNCEMENT BAR & PROMOTIONS */}
      {activeSection === 'announcements' && (
        <Card className="p-6 bg-white rounded-3xl border-slate-200/80 shadow-xs max-w-2xl">
          <h3 className="text-base font-black text-slate-950 mb-1">
            Top Banner Announcement & Header Promo
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure site-wide notification bar text and the global promotional discount banner.
          </p>

          <form onSubmit={handleSaveAnnouncements} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Announcement Message
              </label>
              <Input
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="Complimentary worldwide shipping on orders over $150 · Hand-numbered pieces"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={e => setShowAnnouncement(e.target.checked)}
                className="rounded"
              />
              <span>Display top announcement bar on customer site</span>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Default Promo Code
                </label>
                <Input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="LUMINA15"
                  className="bg-slate-50 rounded-xl text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Promo Discount %
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={promoDiscount}
                  onChange={e => setPromoDiscount(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11 px-6"
            >
              Save Announcement Settings
            </Button>
          </form>
        </Card>
      )}

      {/* Hero Slide Edit Sheet */}
      <Sheet open={isSlideDrawerOpen} onOpenChange={setIsSlideDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-black text-slate-950">
              {editingSlideIdx !== null ? 'Edit Hero Banner Slide' : 'Add New Hero Slide'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Configure high-res photography, headlines, and call-to-action routing.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveSlide} className="space-y-4 pt-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Tagline</label>
              <Input
                value={slideForm.tagline}
                onChange={e => setSlideForm({ ...slideForm, tagline: e.target.value })}
                placeholder="Spring / Summer Archive"
                className="bg-slate-50 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Main Headline</label>
              <Input
                required
                value={slideForm.title}
                onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                placeholder="Timeless Artisan Garments"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Subtitle Description</label>
              <textarea
                rows={2}
                value={slideForm.subtitle}
                onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                placeholder="Hand-woven textures and studio ceramics..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Slide Image URL</label>
              <Input
                required
                value={slideForm.image}
                onChange={e => setSlideForm({ ...slideForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Button Text</label>
                <Input
                  value={slideForm.ctaText}
                  onChange={e => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                  placeholder="Explore Collection"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Badge Text</label>
                <Input
                  value={slideForm.badge || ''}
                  onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                  placeholder="Limited Batch"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11"
              >
                <span>Save Hero Slide</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSlideDrawerOpen(false)}
                className="rounded-xl text-xs font-bold h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Testimonial Edit Sheet */}
      <Sheet open={isTestimonialDrawerOpen} onOpenChange={setIsTestimonialDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-black text-slate-950">
              {editingTestimonial ? 'Edit Customer Testimonial' : 'Add Customer Review Story'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Displayed in the 2-in-a-row live review ticker with auto-slide.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveTestimonial} className="space-y-4 pt-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Author Name</label>
                <Input
                  required
                  value={testForm.authorName || ''}
                  onChange={e => setTestForm({ ...testForm, authorName: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Location</label>
                <Input
                  value={testForm.authorLocation || ''}
                  onChange={e => setTestForm({ ...testForm, authorLocation: e.target.value })}
                  placeholder="Paris, France"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Avatar Image URL</label>
              <Input
                value={testForm.authorAvatar || ''}
                onChange={e => setTestForm({ ...testForm, authorAvatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Product Mentioned</label>
              <Input
                value={testForm.productMentioned || ''}
                onChange={e => setTestForm({ ...testForm, productMentioned: e.target.value })}
                placeholder="Japanese Canvas Chore Coat"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Review Text</label>
              <textarea
                rows={3}
                required
                value={testForm.content || ''}
                onChange={e => setTestForm({ ...testForm, content: e.target.value })}
                placeholder="The craftsmanship is unbelievable..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11"
              >
                <span>Save Testimonial</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTestimonialDrawerOpen(false)}
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
