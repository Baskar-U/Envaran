import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Check, Star, Heart, Eye, MessageSquare, Users, Zap, Shield, Gift, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to compress image before converting to base64
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export default function Premium() {
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'1month'>('1month');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errors, setErrors] = useState<{transactionId?: string; screenshot?: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = {
    id: '1month',
    name: '1 Month Premium',
    price: 299,
    originalPrice: 399,
    discount: '25% OFF',
    period: '1 month',
    qrCode: '/3month.jpg',
    popular: true
  };

  const features = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "View Contact Details",
      description: "See phone numbers and email addresses of all profiles"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Unlimited Messages",
      description: "Send unlimited messages to any profile"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Advanced Matching",
      description: "Get priority matching with advanced algorithms"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Profile Boost",
      description: "Your profile appears first in search results"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Notifications",
      description: "Get instant notifications for likes and matches"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Verified Badge",
      description: "Get a verified badge on your profile"
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: "Exclusive Events",
      description: "Access to exclusive matrimony events"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Priority Support",
      description: "24/7 priority customer support"
    }
  ];

  const handleUpgrade = () => {
    setIsPaymentOpen(true);
  };

  const validateForm = () => {
    const newErrors: {transactionId?: string; screenshot?: string} = {};
    
    // Validate transaction ID
    if (!transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    } else if (transactionId.trim().length < 5) {
      newErrors.transactionId = 'Transaction ID must be at least 5 characters';
    }
    
    // Validate screenshot
    if (!screenshot) {
      newErrors.screenshot = 'Payment screenshot is required';
    } else {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(screenshot.type)) {
        newErrors.screenshot = 'Only PNG, JPG, and JPEG files are allowed';
      }
      
      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (screenshot.size > maxSize) {
        newErrors.screenshot = 'File size must be less than 5MB';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous errors
      setErrors(prev => ({ ...prev, screenshot: undefined }));
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, screenshot: 'Only PNG, JPG, and JPEG files are allowed' }));
        return;
      }
      
      // Validate file size
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, screenshot: 'File size must be less than 5MB' }));
        return;
      }
      
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitPayment = async () => {
    if (!firebaseUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit payment",
        variant: "destructive",
      });
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Compress image to reduce size
      const compressedBase64 = await compressImage(screenshot!, 800, 0.6);
      
      // Check if compressed image is still too large (Firestore limit is ~1MB)
      const sizeInBytes = (compressedBase64.length * 3) / 4; // Approximate base64 to bytes
      if (sizeInBytes > 900000) { // 900KB limit to be safe
        toast({
          title: "Image Too Large",
          description: "Please use a smaller image or compress it further.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Add payment record to Firestore with compressed base64 screenshot
      await addDoc(collection(db, 'payments'), {
        userId: firebaseUser.uid,
        userEmail: firebaseUser.email,
        userName: firebaseUser.displayName || 'Unknown',
        plan: selectedPlan,
        planName: plan.name,
        planDuration: plan.period,
        amount: plan.price,
        originalPrice: plan.originalPrice,
        discount: plan.discount,
        transactionId: transactionId.trim(),
        screenshotUrl: `${Date.now()}_${screenshot!.name}`, // Store filename for reference
        screenshotBase64: compressedBase64, // Store compressed base64 data
        status: 'pending',
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null
      });

      // Show success dialog
      setShowSuccessDialog(true);
      setIsPaymentOpen(false);
      
      // Reset form
      setTransactionId('');
      setScreenshot(null);
      setScreenshotPreview(null);
      setErrors({});

      toast({
        title: "Payment Submitted Successfully!",
        description: "Your payment has been submitted for review. You'll be notified once approved.",
      });

    } catch (error) {
      // console.error('Error submitting payment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Upgrade to <span className="text-yellow-300">Premium</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Unlock unlimited access to contact details, advanced matching, and exclusive features
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plan Selection */}
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <Card 
                className="relative cursor-pointer transition-all duration-200 hover:shadow-lg ring-2 ring-orange-500 shadow-xl border-orange-300"
                onClick={() => setSelectedPlan('1month')}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Premium Package
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">₹{plan.originalPrice}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {plan.discount}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* All Premium Features */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">View Contact Details</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Unlimited Messages</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Advanced Search Filters</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Profile Boost (3x Visibility)</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">View Raasi Charts</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Advanced Matching</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Verified Badge</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Exclusive Events Access</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Priority Support</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Video Call Initiation</h4>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Early Access to New Features</h4>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan('1month');
                      handleUpgrade();
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Dialog */}
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Complete Payment</DialogTitle>
                <DialogDescription className="text-center">
                  Scan the QR code and provide payment details
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                {/* Left Side - QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-lg max-w-sm">
                    {/* QR Code Image */}
                    <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
                      <img 
                        src={plan.qrCode} 
                        alt={`${plan.name} QR Code`} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // console.error('Failed to load QR code image:', e);
                          // Show a fallback message
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center text-gray-500">
                                <p class="text-sm">QR Code Image</p>
                                <p class="text-xs">(${plan.qrCode} not found)</p>
                                <p class="text-xs mt-2">Check console for details</p>
                              </div>
                            `;
                          }
                        }}
                        onLoad={() => {
                          // console.log('✅ QR code image loaded successfully');
                        }}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        crossOrigin="anonymous"
                      />
                    </div>
                    
                    {/* QR code image contains all payment details */}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 text-center">Scan to pay with any UPI app</p>
                  
                  {/* Payment Details */}
                  <div className="mt-4 text-center space-y-1">
                    <p className="text-sm text-gray-600">
                      Amount: <span className="font-semibold">₹{plan.price}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Plan: <span className="font-semibold">{plan.name}</span>
                    </p>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Transaction ID Input */}
                    <div className="space-y-2">
                      <Label htmlFor="transactionId" className="text-base font-medium">Transaction ID *</Label>
                      <Input
                        id="transactionId"
                        type="text"
                        placeholder="Enter your transaction ID"
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value);
                          // Clear error when user starts typing
                          if (errors.transactionId) {
                            setErrors(prev => ({ ...prev, transactionId: undefined }));
                          }
                        }}
                        className={`w-full h-12 text-base ${errors.transactionId ? 'border-red-500' : ''}`}
                      />
                      {errors.transactionId && (
                        <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
                      )}
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="screenshot" className="text-base font-medium">Payment Screenshot *</Label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center min-h-[200px] flex flex-col items-center justify-center ${
                        errors.screenshot ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}>
                        {screenshotPreview ? (
                          <div className="space-y-4 w-full">
                            <img 
                              src={screenshotPreview} 
                              alt="Screenshot preview" 
                              className="max-w-full h-40 object-contain mx-auto rounded border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeScreenshot}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove Screenshot
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Click to upload payment screenshot</p>
                              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB (will be compressed automatically)</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-2"
                            >
                              Choose File
                            </Button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </div>
                      {errors.screenshot && (
                        <p className="text-red-500 text-sm mt-2">{errors.screenshot}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 text-base"
                      onClick={() => setIsPaymentOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-12 text-base bg-green-500 hover:bg-green-600"
                      onClick={handleSubmitPayment}
                      disabled={isProcessing || !transactionId.trim() || !screenshot}
                    >
                      {isProcessing ? 'Submitting...' : 'Submit Payment'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              Premium Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get access to exclusive features that will help you find your perfect match faster
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">🎉 Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your payment has been submitted successfully
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Payment Submitted Successfully</h3>
              <p className="text-sm text-gray-600">
                Thank you for registering for premium! Our team will review your payment and make your profile premium within 5 minutes.
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Thank you for your patience.
              </p>
            </div>
            
            <Button 
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = '/';
              }}
            >
              Continue to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
