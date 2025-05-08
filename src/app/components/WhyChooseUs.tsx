import React from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const reasons = [
    "Built with privacy as a core principle, not an afterthought",
    "No complicated wallet addresses to remember",
    "Send crypto as easily as sending a GIF",
    "Web3-native experience with Web2 level of simplicity",
    "Customizable security settings for your comfort level"
  ];

  return (
    <section id="why-3lite" className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose 3lite?</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              3lite Messenger isn't just another messaging app. We've reimagined communication for the crypto era.
            </p>
            
            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-indigo-300 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-indigo-50">{reason}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 relative z-10">
              <div className="flex items-center mb-6">
                <MessageSquare className="w-8 h-8 text-indigo-300 mr-3" />
                <h3 className="text-2xl font-bold">What Users Say</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="italic text-indigo-100 mb-3">
                    "3lite has completely changed how I interact with my crypto-holding friends. Sending ETH is now as simple as sending a message!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium mr-3">
                      A
                    </div>
                    <p className="font-medium">Alex, early user</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="italic text-indigo-100 mb-3">
                    "As someone working in Web3, I needed a communication tool that understood crypto. 3lite is exactly what I was looking for."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-medium mr-3">
                      S
                    </div>
                    <p className="font-medium">Sarah, community manager</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/3 -right-8 w-24 h-24 bg-purple-500/20 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-500/20 rounded-full filter blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;