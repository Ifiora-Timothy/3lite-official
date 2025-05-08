import React from 'react';
import { 
  MessageSquare, 
  Shield, 
  Zap, 
  Palette, 
  Layers 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time encrypted messaging",
      description: "Send and receive messages instantly with end-to-end encryption to keep your conversations private."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Crypto wallet integration",
      description: "Seamlessly connect your favorite crypto wallets for instant transfers without leaving the app."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning-fast transfers",
      description: "Send crypto to friends in seconds, not minutes, with low transaction fees."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "User-friendly design",
      description: "Enjoy a clean, intuitive interface designed for both crypto natives and newcomers."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-chain support",
      description: "Use your preferred blockchain networks including Ethereum, Solana, and more."
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Features</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how 3lite Messenger transforms how you communicate and transact in the digital age.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;