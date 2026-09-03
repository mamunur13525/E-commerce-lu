import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <p>
            At Lumina, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Lumina and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Information we collect</h3>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">How we use your information</h3>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Log Files</h3>
          <p>
            Lumina follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>
        </div>
      </div>
    </div>
  );
};
