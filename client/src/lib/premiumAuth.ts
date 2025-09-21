import { 
  doc, 
  updateDoc, 
  getDoc,
  addDoc,
  collection
} from 'firebase/firestore';
import { db } from './firebase';

// Function to upgrade user to premium
export const upgradeToPremium = async (userId: string, planName: string, duration: number) => {
  try {
    // console.log(`Upgrading user ${userId} to ${planName} for ${duration} months`);
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);
    
    // Update user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      plan: 'premium',
      premiumPlan: planName,
      premiumDuration: duration,
      premiumExpiry: expiryDate,
      premiumActivatedAt: new Date(),
      lastUpdated: new Date()
    });
    
    // console.log('User upgraded to premium successfully');
    
    // Create premium activation notification
    const notificationData = {
      userId: userId,
      type: 'premium_activation',
      title: 'Premium Activated!',
      message: `Welcome to ${planName}! You now have access to all premium features.`,
      read: false,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
    // console.log('Premium activation notification created');
    
    return { success: true };
  } catch (error: any) {
    // console.error('Error upgrading user to premium:', error);
    return { success: false, error: error.message };
  }
};

// Function to check if user's premium is still active
export const checkPremiumStatus = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { isPremium: false, expired: false };
    }
    
    const userData = userSnap.data();
    const now = new Date();
    const expiryDate = userData.premiumExpiry?.toDate();
    
    if (!expiryDate) {
      return { isPremium: false, expired: false };
    }
    
    const isExpired = now > expiryDate;
    const isPremium = userData.plan === 'premium' && !isExpired;
    
    // If expired, downgrade to free
    if (isExpired && userData.plan === 'premium') {
      await updateDoc(userRef, {
        plan: 'free',
        lastUpdated: new Date()
      });
    }
    
    return { 
      isPremium, 
      expired: isExpired,
      expiryDate: expiryDate,
      planName: userData.premiumPlan,
      duration: userData.premiumDuration
    };
  } catch (error: any) {
    // console.error('Error checking premium status:', error);
    return { isPremium: false, expired: false };
  }
};










