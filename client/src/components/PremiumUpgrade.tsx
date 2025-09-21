import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string, duration: number) => void;
  isUpgrading?: boolean;
}

const plans = [
  {
    id: '1month',
    name: '1 Month Premium',
    duration: 1,
    price: '₹299',
    originalPrice: '₹399',
    discount: '25% OFF',
    image: '/3month.jpg',
    features: [
      'View all Raasi charts',
      'Unlimited profile views',
      'Priority customer support',
      'Advanced search filters',
      'Profile boost (3x Visibility)',
      'Read receipts',
      'Exclusive events access',
      'Personalized matches',
      'Video call initiation',
      'Verified badge',
      'Advanced matching',
      'Early access to new features'
    ],
    popular: true
  }
];

export default function PremiumUpgrade({ isOpen, onClose, onUpgrade, isUpgrading = false }: PremiumUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowQRCode(true);
  };

  const handlePaymentComplete = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      onUpgrade(plan.name, plan.duration);
      toast({
        title: "Payment Received!",
        description: `Your ${plan.name} subscription has been activated.`,
      });
      onClose();
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                Upgrade to Premium
              </h2>
              <p className="text-gray-600">Unlock all features and find your perfect match faster</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          {!showQRCode ? (
            <div className="flex justify-center">
              <div className="max-w-md w-full">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    plan.popular ? 'ring-2 ring-yellow-500' : ''
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-lg text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {plan.discount}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full mt-6"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Complete Your Payment</h3>
                <p className="text-gray-600">
                  Scan the QR code below to pay for your {selectedPlanData?.name} subscription
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <img 
                        src={selectedPlanData?.image} 
                        alt={`Payment QR Code for ${selectedPlanData?.name}`}
                        className="w-full h-auto max-w-xs mx-auto rounded-lg"
                      />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-lg font-semibold">{selectedPlanData?.name}</p>
                      <p className="text-2xl font-bold text-green-600">{selectedPlanData?.price}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Scan QR code with any UPI app</p>
                      <p>• Payment will be processed instantly</p>
                      <p>• Your premium features will activate immediately</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex gap-4 justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQRCode(false)}
                >
                  Back to Plans
                </Button>
                <Button 
                  onClick={() => handlePaymentComplete(selectedPlan!)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isUpgrading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isUpgrading ? 'Processing...' : "I've Made Payment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
