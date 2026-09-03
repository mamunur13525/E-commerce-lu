import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

export const ContactUsPage: React.FC = () => {
  const { storeSettings, addToast, navigateTo } = useStore();
  const { contactInfo, socialLinks } = storeSettings;

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('general');
  const [formOrderNumber, setFormOrderNumber] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast('Copied to clipboard', text, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      addToast('Missing Fields', 'Please complete all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast(
        'Inquiry Transmitted', 
        `Thank you ${formName.trim()}. Our concierge will review and reply to ${formEmail.trim()} within 24 hours.`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Intro Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-medium tracking-wider mb-4">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DIRECT CLIENT CONCIERGE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
            Get in Touch
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about an artisan garment, bespoke sizing, custom order status, or international delivery? Our studio concierge is at your service.
          </p>
        </div>

        {/* Grid Layout: Contact Info & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Studio Information (Direct from storeSettings) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Contact Cards */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Studio Information</span>
              </h2>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Concierge Email
                  </span>
                  <a 
                    href={`mailto:${contactInfo?.email || 'support@lumina.com'}`}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors block truncate"
                  >
                    {contactInfo?.email || 'support@lumina.com'}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(contactInfo?.email || 'support@lumina.com', 'email')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 mt-1 font-medium"
                  >
                    {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'email' ? 'Copied' : 'Copy address'}</span>
                  </button>
                </div>
              </div>

              {/* Phone / Hotline */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Studio Telephone
                  </span>
                  <a 
                    href={`tel:${contactInfo?.phone || '+15552345678'}`}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors block"
                  >
                    {contactInfo?.phone || '+1 (555) 234-5678'}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toll-free client concierge line</p>
                </div>
              </div>

              {/* WhatsApp if available */}
              {contactInfo?.whatsapp && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      WhatsApp Messaging
                    </span>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors block"
                    >
                      {contactInfo.whatsapp}
                    </a>
                    <p className="text-[11px] text-slate-500 mt-0.5">Direct chat for styling advice</p>
                  </div>
                </div>
              )}

              {/* Physical Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Flagship Studio & Atelier
                  </span>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    {contactInfo?.address || '142 Mercer Street, Soho'}<br />
                    {contactInfo?.city || 'New York'}, {contactInfo?.zip || '10012'} {contactInfo?.country || 'United States'}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Operating Hours
                  </span>
                  <p className="text-sm font-medium text-slate-800">
                    {contactInfo?.hours || 'Monday – Friday: 9:00 AM – 6:00 PM EST'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Closed on select international holidays</p>
                </div>
              </div>

              {/* Support Note */}
              {contactInfo?.supportNote && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                  <span>{contactInfo.supportNote}</span>
                </div>
              )}
            </div>

            {/* Social Media Channels Card (Direct from storeSettings.socialLinks) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Follow & Connect With Us
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Join our community across social platforms for lookbooks, craft journals, and early collection previews.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-rose-600" />
                    <span>Instagram</span>
                  </a>
                )}
                {socialLinks?.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook</span>
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5 text-sky-500" />
                    <span>Twitter / X</span>
                  </a>
                )}
                {socialLinks?.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube</span>
                  </a>
                )}
                {socialLinks?.pinterest && (
                  <a
                    href={socialLinks.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-red-700" />
                    <span>Pinterest</span>
                  </a>
                )}
                {socialLinks?.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-900" />
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting LUMINA Studio. We have registered your message and dispatched a confirmation to <strong>{formEmail}</strong>.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormMessage('');
                        setFormOrderNumber('');
                      }}
                      variant="outline"
                      className="rounded-xl text-xs font-semibold"
                    >
                      Send Another Message
                    </Button>
                    <Button
                      onClick={() => navigateTo('shop')}
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fill out the form below and an artisan concierge advisor will get back to you promptly.
                    </p>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="bg-slate-50/60 rounded-xl text-xs h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        placeholder="eleanor@example.com"
                        className="bg-slate-50/60 rounded-xl text-xs h-10"
                      />
                    </div>
                  </div>

                  {/* Subject & Order Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Topic of Inquiry
                      </label>
                      <select
                        value={formSubject}
                        onChange={e => setFormSubject(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 h-10 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      >
                        <option value="general">General Studio Inquiry</option>
                        <option value="order">Order Status & Tracking</option>
                        <option value="sizing">Sizing & Material Guidance</option>
                        <option value="custom">Custom & Bespoke Commission</option>
                        <option value="returns">Exchange & Return Request</option>
                        <option value="press">Press & Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Order Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        value={formOrderNumber}
                        onChange={e => setFormOrderNumber(e.target.value)}
                        placeholder="e.g. LUM-89421"
                        className="bg-slate-50/60 rounded-xl text-xs h-10 font-mono"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formMessage}
                      onChange={e => setFormMessage(e.target.value)}
                      placeholder="Please let us know how we can assist you..."
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      Average response time: under 4 business hours.
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold px-5 h-10 gap-2 shadow-xs"
                    >
                      {isSubmitting ? (
                        <span>Transmitting...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

            </div>

            {/* Quick Assistance Help Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div 
                onClick={() => navigateTo('track-order')}
                className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-slate-400 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700">Track an Existing Order</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Check live shipment status & carrier dispatch</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>

              <div 
                onClick={() => navigateTo('terms')}
                className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-slate-400 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700">Shipping & Return Policy</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Read our 30-day guarantee and delivery terms</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
