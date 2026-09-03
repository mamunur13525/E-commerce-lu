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
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Share2,
  Save,
  Globe,
  ExternalLink,
  MessageCircle,
  Building2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { HeroSlide, FacebookReview } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
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

  const [activeSection, setActiveSection] = useState<'hero' | 'testimonials' | 'announcements' | 'contact' | 'social'>('hero');

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

  // Contact Information State
  const [contactForm, setContactForm] = useState({
    email: storeSettings.contactInfo?.email || 'concierge@lumina-studio.com',
    notificationEmail: storeSettings.notificationEmail || 'concierge@lumina-studio.com',
    phone: storeSettings.contactInfo?.phone || '+1 (555) 234-5678',
    whatsapp: storeSettings.contactInfo?.whatsapp || '+1 (555) 234-5678',
    address: storeSettings.contactInfo?.address || '142 Mercer Street, Soho',
    city: storeSettings.contactInfo?.city || 'New York',
    country: storeSettings.contactInfo?.country || 'United States',
    zip: storeSettings.contactInfo?.zip || '10012',
    hours: storeSettings.contactInfo?.hours || 'Monday - Friday: 9:00 AM - 6:00 PM EST',
    supportNote: storeSettings.contactInfo?.supportNote || 'Direct concierge support and personalized sizing consultations.',
  });

  // Social Media Links State
  const [socialForm, setSocialForm] = useState({
    instagram: storeSettings.socialLinks?.instagram || 'https://instagram.com/lumina_archive',
    facebook: storeSettings.socialLinks?.facebook || 'https://facebook.com/lumina.archive',
    twitter: storeSettings.socialLinks?.twitter || 'https://x.com/lumina_archive',
    youtube: storeSettings.socialLinks?.youtube || '',
    tiktok: storeSettings.socialLinks?.tiktok || '',
    pinterest: storeSettings.socialLinks?.pinterest || 'https://pinterest.com/lumina_design',
    linkedin: storeSettings.socialLinks?.linkedin || '',
  });

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
      title: '',
      subtitle: '',
      tagline: '',
      image: '',
      ctaText: '',
      ctaLink: 'shop',
      badge: ''
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
      authorAvatar: '',
      authorLocation: '',
      rating: 5,
      timeAgo: '',
      content: '',
      productMentioned: '',
      verifiedPurchase: true,
      likes: 0,
      comments: 0,
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

  // Contact Info Handlers
  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      notificationEmail: contactForm.notificationEmail.trim(),
      contactInfo: {
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        address: contactForm.address.trim(),
        city: contactForm.city.trim(),
        country: contactForm.country.trim(),
        zip: contactForm.zip.trim(),
        hours: contactForm.hours.trim(),
        whatsapp: contactForm.whatsapp.trim(),
        supportNote: contactForm.supportNote.trim(),
      }
    });
    addToast('Contact Info Saved', 'Studio contact information has been updated for clients and footer.', 'success');
  };

  // Social Links Handlers
  const handleSaveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      socialLinks: {
        instagram: socialForm.instagram.trim(),
        facebook: socialForm.facebook.trim(),
        twitter: socialForm.twitter.trim(),
        youtube: socialForm.youtube.trim(),
        tiktok: socialForm.tiktok.trim(),
        pinterest: socialForm.pinterest.trim(),
        linkedin: socialForm.linkedin.trim(),
      }
    });
    addToast('Social Media Links Updated', 'Footer and Contact page social links have been updated.', 'success');
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
            Manage banner slides, testimonials, announcement bar, contact info, and footer social links.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs gap-1">
          {[
            { id: 'hero', label: `Hero Slides (${heroSlides.length})` },
            { id: 'testimonials', label: `Testimonials (${facebookReviews.length})` },
            { id: 'announcements', label: 'Store Banner & Promos' },
            { id: 'contact', label: 'Contact Info' },
            { id: 'social', label: 'Footer & Socials' },
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

            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="display-announcement-switch"
                checked={showAnnouncement}
                onCheckedChange={setShowAnnouncement}
              />
              <label htmlFor="display-announcement-switch" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                Display top announcement bar on customer site
              </label>
            </div>

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

      {/* SECTION 4: CONTACT INFORMATION */}
      {activeSection === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 bg-white rounded-3xl border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Concierge & Contact Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure customer support email, phone hotline, atelier address, and opening hours.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleSaveContactInfo} className="space-y-4">
                {/* Communication channels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Public Concierge Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="concierge@lumina-studio.com"
                        className="bg-slate-50 rounded-xl text-xs pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Admin Notification Email
                    </label>
                    <div className="relative">
                      <Bell className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={contactForm.notificationEmail}
                        onChange={e => setContactForm({ ...contactForm, notificationEmail: e.target.value })}
                        placeholder="admin@lumina-studio.com"
                        className="bg-slate-50 rounded-xl text-xs pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Telephone / Support Line
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={contactForm.phone}
                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+1 (555) 234-5678"
                        className="bg-slate-50 rounded-xl text-xs pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      WhatsApp Direct Number
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={contactForm.whatsapp}
                        onChange={e => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                        placeholder="+1 (555) 234-5678"
                        className="bg-slate-50 rounded-xl text-xs pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Atelier / Studio Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={contactForm.address}
                      onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                      placeholder="142 Mercer Street, Soho"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">City</label>
                    <Input
                      value={contactForm.city}
                      onChange={e => setContactForm({ ...contactForm, city: e.target.value })}
                      placeholder="New York"
                      className="bg-slate-50 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Country</label>
                    <Input
                      value={contactForm.country}
                      onChange={e => setContactForm({ ...contactForm, country: e.target.value })}
                      placeholder="United States"
                      className="bg-slate-50 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">ZIP / Postal</label>
                    <Input
                      value={contactForm.zip}
                      onChange={e => setContactForm({ ...contactForm, zip: e.target.value })}
                      placeholder="10012"
                      className="bg-slate-50 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Operating Hours & Support Note */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Concierge Hours
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={contactForm.hours}
                      onChange={e => setContactForm({ ...contactForm, hours: e.target.value })}
                      placeholder="Monday - Friday: 9:00 AM - 6:00 PM EST"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Support Note / Studio Promise
                  </label>
                  <Textarea
                    rows={2}
                    value={contactForm.supportNote}
                    onChange={e => setContactForm({ ...contactForm, supportNote: e.target.value })}
                    placeholder="Direct concierge support and personalized sizing consultations."
                    className="bg-slate-50 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11 px-6 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Information</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 bg-slate-950 text-white rounded-3xl border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Customer Preview</span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase border-slate-700 text-slate-300">
                  Contact Us Page
                </Badge>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Concierge Email</p>
                    <p className="font-semibold text-white mt-0.5">{contactForm.email || 'None specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Direct Telephone</p>
                    <p className="font-semibold text-white mt-0.5">{contactForm.phone || 'None specified'}</p>
                    {contactForm.whatsapp && (
                      <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 inline" /> WhatsApp available
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Physical Atelier</p>
                    <p className="font-semibold text-white mt-0.5">{contactForm.address || 'Address not configured'}</p>
                    <p className="text-slate-400 text-[11px]">{contactForm.city} {contactForm.zip && `· ${contactForm.zip}`} {contactForm.country && `· ${contactForm.country}`}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Operating Schedule</p>
                    <p className="font-semibold text-white mt-0.5">{contactForm.hours || 'Hours not set'}</p>
                  </div>
                </div>

                {contactForm.supportNote && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                    "{contactForm.supportNote}"
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Automatic Sync</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Updating your contact details automatically updates the <strong>Contact Us</strong> page, the <strong>Footer</strong> concierge panel, and customer order confirmation emails.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 5: FOOTER & SOCIAL MEDIA CHANNELS */}
      {activeSection === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 bg-white rounded-3xl border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Footer & Social Media Links
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect your brand profiles to display clickable icons in the footer and contact sections.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleSaveSocialLinks} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Instagram Profile URL
                  </label>
                  <div className="relative">
                    <Instagram className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.instagram}
                      onChange={e => setSocialForm({ ...socialForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/lumina_archive"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Facebook Page URL
                  </label>
                  <div className="relative">
                    <Facebook className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.facebook}
                      onChange={e => setSocialForm({ ...socialForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/lumina.archive"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Twitter / X Profile URL
                  </label>
                  <div className="relative">
                    <Twitter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.twitter}
                      onChange={e => setSocialForm({ ...socialForm, twitter: e.target.value })}
                      placeholder="https://x.com/lumina_archive"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    YouTube Channel URL
                  </label>
                  <div className="relative">
                    <Youtube className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.youtube}
                      onChange={e => setSocialForm({ ...socialForm, youtube: e.target.value })}
                      placeholder="https://youtube.com/@lumina"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Pinterest Board URL
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.pinterest}
                      onChange={e => setSocialForm({ ...socialForm, pinterest: e.target.value })}
                      placeholder="https://pinterest.com/lumina_design"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    TikTok URL
                  </label>
                  <div className="relative">
                    <Share2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.tiktok}
                      onChange={e => setSocialForm({ ...socialForm, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@lumina"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    LinkedIn Company URL
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={socialForm.linkedin}
                      onChange={e => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/company/lumina-studio"
                      className="bg-slate-50 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11 px-6 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Social Media Links</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Live Footer Preview */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 bg-[#0c0d0e] text-white rounded-3xl border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Footer Display</span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase border-slate-700 text-slate-300">
                  Global Footer
                </Badge>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Active Social Channels</p>
                <div className="flex flex-wrap gap-2.5">
                  {socialForm.instagram && (
                    <a
                      href={socialForm.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.facebook && (
                    <a
                      href={socialForm.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.twitter && (
                    <a
                      href={socialForm.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.youtube && (
                    <a
                      href={socialForm.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.pinterest && (
                    <a
                      href={socialForm.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="Pinterest"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.tiktok && (
                    <a
                      href={socialForm.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="TikTok"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  )}
                  {socialForm.linkedin && (
                    <a
                      href={socialForm.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5"
                      title="LinkedIn"
                    >
                      <Building2 className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-[11px] text-slate-400">
                    Channels with configured URLs appear automatically in the footer row. If you leave a field empty, that social icon is hidden from customers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
