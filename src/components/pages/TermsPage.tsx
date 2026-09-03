import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold tracking-widest uppercase mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <p>
            Welcome to Lumina. These terms and conditions outline the rules and regulations for the use of our website and services.
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Lumina if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">1. License</h3>
          <p>
            Unless otherwise stated, Lumina and/or its licensors own the intellectual property rights for all material on Lumina. All intellectual property rights are reserved. You may access this from Lumina for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">2. Hyperlinking to our Content</h3>
          <p>
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">3. Content Liability</h3>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">4. Reservation of Rights</h3>
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};
