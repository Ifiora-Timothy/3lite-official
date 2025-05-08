import React from 'react';
import { MessageSquare, Wallet, Lock } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, number }) => {
  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-md">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {number}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center max-w-xs">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
      title: "Start a conversation",
      description: "Connect with friends or business partners through secure, encrypted messaging.",
      number: 1
    },
    {
      icon: <Wallet className="w-8 h-8 text-purple-600" />,
      title: "Send/receive crypto",
      description: "Transfer crypto assets instantly within your chat, no complicated wallet addresses needed.",
      number: 2
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: "Stay secure",
      description: "Your messages and transactions are protected with end-to-end encryption.",
      number: 3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-indigo-50/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            3lite Messenger combines secure messaging with crypto functionality in three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;