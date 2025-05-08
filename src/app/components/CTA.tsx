"use client";
import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send the email to a server
      setSubmitted(true);
    }
  };

  return (
    <section id="join-waitlist" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-400/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400/10 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the 3lite Revolution
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Be among the first to experience the future of messaging and crypto transactions. 
                Sign up for our waitlist and get early access.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium flex items-center justify-center hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap"
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">You're on the list!</h3>
                  <p className="text-gray-600">We'll notify you when 3lite is ready for early access.</p>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <div className="flex space-x-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-1" />
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-1" />
                    <span>Early access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-1" />
                    <span>Exclusive perks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;