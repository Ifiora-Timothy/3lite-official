import React, { useState } from 'react';
import { X, Send, Clock } from 'lucide-react';
import Button from '../UI/Button';
import Avatar from '../UI/Avatar';
import { Chat } from '@/types';

interface TransferModalProps {
  recipient: Chat;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ recipient, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '1.45', icon: '⧫' },
    { symbol: 'USDT', name: 'Tether', balance: '245.50', icon: '₮' },
    { symbol: 'MATIC', name: 'Polygon', balance: '156.78', icon: '◆' },
    { symbol: '3LITE', name: '3lite Token', balance: '340.00', icon: '✦' },
  ];
  
  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Simulate transaction
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 2000);
    }
  };
  
  const handleReset = () => {
    setStep(1);
    setSelectedToken('ETH');
    setAmount('');
    setMemo('');
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect w-full max-w-md rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isSuccess ? 'Transfer Complete' : 'Send Crypto Assets'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-hover-bg rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {isSuccess ? (
          <div className="text-center my-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Transaction Successful!
            </h3>
            <p className="opacity-70 mb-6">
              You sent {amount} {selectedToken} to {recipient.name}
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleReset}
              >
                Send Another
              </Button>
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Recipient */}
            <div className="glass-effect rounded-lg p-3 mb-5 flex items-center gap-3">
              <Avatar
                name={recipient.name}
                src={recipient.avatar}
                status={recipient.status}
                walletAddress={recipient.address}
              />
              <div>
                <h3 className="font-medium">{recipient.name}</h3>
                <p className="text-xs opacity-70">
                  {recipient.address || 'Wallet connected'}
                </p>
              </div>
            </div>
            
            {step === 1 ? (
              <>
                {/* Token Selection */}
                <div className="mb-5">
                  <h3 className="font-medium mb-3">Select Token</h3>
                  <div className="space-y-2">
                    {tokens.map(token => (
                      <div
                        key={token.symbol}
                        className={`
                          glass-effect rounded-lg p-3 cursor-pointer flex items-center justify-between
                          ${selectedToken === token.symbol ? 'glow-border' : 'hover:bg-hover-bg'}
                        `}
                        onClick={() => setSelectedToken(token.symbol)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-color/20 flex items-center justify-center text-xl">
                            {token.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{token.name}</h4>
                            <p className="text-xs opacity-70">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.balance}</p>
                          <p className="text-xs opacity-70">Available</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Amount and Memo */}
                <div className="mb-5">
                  <h3 className="font-medium mb-2">Amount</h3>
                  <div className="glass-effect rounded-lg p-3 flex items-center mb-4">
                    <input
                      type="number"
                      className="flex-1 bg-transparent border-none outline-none"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-color/20 flex items-center justify-center text-lg">
                        {tokens.find(t => t.symbol === selectedToken)?.icon}
                      </div>
                      <span className="font-medium">{selectedToken}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">Memo (Optional)</h3>
                  <div className="glass-effect rounded-lg p-3 mb-4">
                    <input
                      type="text"
                      className="w-full bg-transparent border-none outline-none"
                      placeholder="What's this for?"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                  
                  <div className="glass-effect rounded-lg p-3 flex justify-between text-sm">
                    <span className="opacity-70">Transaction Fee</span>
                    <span className="font-medium">~0.0005 ETH</span>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                fullWidth
                disabled={step === 2 && !amount}
                onClick={handleContinue}
                icon={isLoading ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
              >
                {step === 1 ? 'Continue' : isLoading ? 'Processing...' : 'Send Now'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Missing import
import { CheckCircle } from 'lucide-react';

export default TransferModal;