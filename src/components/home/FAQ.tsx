import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { cn } from '../../lib/utils';

const FAQs = [
  {
    question: "How long does shipping take?",
    answer: "We offer complimentary standard shipping worldwide, which generally takes 3-5 business days. Express shipping options are available at checkout for next-day or 2-day delivery depending on your location."
  },
  {
    question: "Do you offer international returns?",
    answer: "Yes, we accept returns from anywhere in the world within 30 days of receipt. All items must be in their original, unworn condition with tags attached. Please note that return shipping fees may apply depending on your region."
  },
  {
    question: "Are your materials sustainably sourced?",
    answer: "Absolutely. We are committed to ethical production. All our fabrics are traceable and we partner with mills that prioritize sustainable practices, low-impact dyes, and fair labor conditions."
  },
  {
    question: "How should I care for my Lumina pieces?",
    answer: "Each garment comes with specific care instructions. Generally, we recommend cold washing and laying flat to dry to preserve the fibers and shape. We advise against harsh chemical dry cleaning unless explicitly stated."
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "Orders can be modified or canceled within 1 hour of placement. After that, they enter our fulfillment queue and cannot be changed. However, you can easily initiate a return once the package arrives."
  }
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold tracking-widest uppercase mb-4">
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            <span>Support & Details</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our products, shipping, and return policies. Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        <div className="space-y-4">
          {FAQs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={cn(
                  "border rounded-3xl transition-all duration-300 overflow-hidden",
                  isOpen ? "border-slate-300 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className={cn("text-sm sm:text-base font-bold", isOpen ? "text-slate-950" : "text-slate-800")}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 bg-white border border-slate-200 shadow-sm",
                    isOpen ? "rotate-180" : ""
                  )}>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm leading-relaxed",
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
