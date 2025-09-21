import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Lock } from 'lucide-react';
import PremiumUpgrade from './PremiumUpgrade';
import { upgradeToPremium } from '@/lib/premiumAuth';
import { useAuth } from '@/hooks/useAuth';

interface RaasiImageDisplayProps {
  raasiImage?: string;
  isOwner: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function RaasiImageDisplay({ 
  raasiImage, 
  isOwner, 
  isPremium, 
  onUpgrade 
}: RaasiImageDisplayProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user } = useAuth();

  if (!raasiImage) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No Raasi chart uploaded</p>
      </div>
    );
  }

  const shouldBlur = !isOwner && !isPremium;

  const handleUpgrade = async (planName: string, duration: number) => {
    if (!user?.id) return;
    
    setIsUpgrading(true);
    try {
      const result = await upgradeToPremium(user.id, planName, duration);
      if (result.success) {
        setShowUpgradeModal(false);
        if (onUpgrade) {
          onUpgrade();
        }
        // Refresh the page to update the user's premium status
        window.location.reload();
      } else {
        // console.error('Failed to upgrade user:', result.error);
      }
    } catch (error) {
      // console.error('Error upgrading user:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={raasiImage}
              alt="Raasi Chart"
              className={`w-full h-auto object-contain transition-all duration-300 ${
                shouldBlur ? 'blur-sm' : ''
              }`}
              style={{
                filter: shouldBlur ? 'blur(8px)' : 'none',
                maxHeight: '400px'
              }}
            />
            
            {/* Overlay for non-premium users */}
            {shouldBlur && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock className="w-12 h-12 mx-auto mb-4 opacity-75" />
                  <h3 className="text-lg font-semibold mb-2">Premium Content</h3>
                  <p className="text-sm mb-4">Upgrade to premium to view Raasi chart</p>
                  <Button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Upgrade to View
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Owner view - show clear image with edit option */}
      {isOwner && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">Your Raasi Chart</p>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      <PremiumUpgrade
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        isUpgrading={isUpgrading}
      />
    </div>
  );
}
