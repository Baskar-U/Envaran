import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRegistrationByUserId } from "@/lib/firebaseAuth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Save, X, Camera, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RaasiImageDisplay from "@/components/RaasiImageDisplay";

interface ProfileData {
  age: number;
  gender: string;
  location: string;
  profession: string;
  professionOther?: string;
  bio: string;
  education: string;
  educationOther?: string;
  educationSpecification?: string;
  educationSpecificationOther?: string;
  relationshipStatus: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  smoking?: string;
  drinking?: string;
  lifestyle?: string;
  hobbies?: string;
  kidsPreference: string;
  verified: boolean;
  profileImageUrl?: string;
}

interface RegistrationData {
  id: string;
  userId: string;
  status: string;
  submittedAt: Date;
  envaranId?: string;
  
  // Personal Details
  name: string;
  gender: string;
  dateOfBirth: string;
  motherTongue: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  
  // Family Details
  fatherName: string;
  fatherJob: string;
  fatherAlive: string;
  motherName: string;
  motherJob: string;
  motherAlive: string;
  orderOfBirth: string;
  
  // Physical Attributes
  height: string;
  weight: string;
  bloodGroup: string;
  complexion: string;
  disability: string;
  diet: string;
  
  // Education & Occupation
  qualification: string;
  incomePerMonth: string;
  job: string;
  placeOfJob: string;
  
  // Communication Details
  presentAddress: string;
  permanentAddress: string;
  contactNumber: string;
  contactPerson: string;
  
  // Astrology Details
  ownHouse: string;
  star: string;
  laknam: string;
  timeOfBirth: {
    hour: string;
    minute: string;
    period: string;
  };
  raasi: string;
  gothram: string;
  placeOfBirth: string;
  padam: string;
  dossam: string;
  nativity: string;
  
  // Horoscope Details
  horoscopeRequired: string;
  balance: string;
  dasa: string;
  dasaPeriod: {
    years: string;
    months: string;
    days: string;
  };
  
  // Partner Expectations
  partnerExpectations: {
    job: string;
    preferredAgeFrom: number;
    preferredAgeTo: number;
    jobPreference: string;
    diet: string;
    maritalStatus: string[];
    subCaste: string;
    comments: string;
  };
  
  // Additional Details
  otherDetails: string;
  description: string;
  
  // Images
  raasiImage?: string; // Base64 encoded Raasi chart image
  profileImage?: string; // Base64 encoded profile image
  profileImageUrl?: string; // Base64 image data for profile photos
}

export default function Profile() {
  const { user, firebaseUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [editingRegistration, setEditingRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, [firebaseUser]);

  const fetchProfile = async () => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    try {
      // console.log('Fetching profile for user:', firebaseUser.uid);
      
      // First try to fetch registration data (preferred source)
      const registrationData = await getRegistrationByUserId(firebaseUser.uid);
      
      if (registrationData) {
        // console.log('Registration data fetched successfully:', registrationData);
        setRegistration(registrationData);
        
        // Create profile data from registration
        const profileData: ProfileData = {
          age: registrationData.dateOfBirth ? calculateAge(registrationData.dateOfBirth) : 0,
          gender: registrationData.gender || '',
          location: registrationData.presentAddress || '',
          profession: registrationData.job || '',
          professionOther: '',
          bio: registrationData.otherDetails || '',
          education: registrationData.qualification || '',
          educationOther: '',
          educationSpecification: '',
          educationSpecificationOther: '',
          relationshipStatus: registrationData.maritalStatus || '',
          religion: registrationData.religion || '',
          caste: registrationData.caste || '',
          subCaste: registrationData.subCaste || '',
          motherTongue: registrationData.motherTongue || '',
          smoking: '',
          drinking: '',
          lifestyle: '',
          hobbies: '',
          kidsPreference: '',
          verified: true,
          profileImageUrl: registrationData.profileImageUrl || ''
        };
        
        // console.log('Profile data created from registration:', profileData);
        // console.log('Profile image URL from registration:', registrationData.profileImageUrl);
        setProfile(profileData);
      } else {
        // console.log('No registration data found, creating empty profile');
        // Initialize empty profile if no data exists
        const initialProfile: ProfileData = {
          age: user?.dateOfBirth ? calculateAge(user.dateOfBirth) : 0,
          gender: user?.gender || '',
          location: '',
          profession: '',
          professionOther: '',
          bio: '',
          education: '',
          educationOther: '',
          educationSpecification: '',
          educationSpecificationOther: '',
          relationshipStatus: '',
          religion: user?.religion || '',
          caste: user?.caste || '',
          subCaste: user?.subCaste || '',
          motherTongue: '',
          smoking: '',
          drinking: '',
          lifestyle: '',
          hobbies: '',
          kidsPreference: '',
          verified: false,
          profileImageUrl: user?.profileImageUrl || ''
        };
        setProfile(initialProfile);
      }
    } catch (error) {
      // console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    try {
      const today = new Date();
      let birthDate: Date;
      
      // Handle DD-MM-YYYY format (common in Indian context)
      if (dateOfBirth.includes('-') && dateOfBirth.split('-')[0].length === 2) {
        const [day, month, year] = dateOfBirth.split('-');
        birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Try parsing as is (for other formats)
        birthDate = new Date(dateOfBirth);
      }
      
      // Check if the date is valid
      if (isNaN(birthDate.getTime())) {
        // console.warn('Invalid date format:', dateOfBirth);
        return 0;
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      // console.error('Error calculating age for date:', dateOfBirth, error);
      return 0;
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image compression function
  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Check if compressed image is still too large (Firestore limit is ~1MB)
        const sizeInBytes = (compressedBase64.length * 3) / 4;
        const maxSize = 900000; // ~900KB to be safe
        
        if (sizeInBytes > maxSize) {
          // Try with lower quality
          const lowerQuality = Math.max(0.1, quality - 0.2);
          const newCompressedBase64 = canvas.toDataURL('image/jpeg', lowerQuality);
          resolve(newCompressedBase64);
        } else {
          resolve(compressedBase64);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !firebaseUser) return;

    setUploadingPhoto(true);
    try {
      // Check file size first (before compression)
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      if (selectedImage.size > maxFileSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        setUploadingPhoto(false);
        return;
      }

      // Compress image
      toast({
        title: "Compressing image...",
        description: "Please wait while we optimize your image for upload.",
      });
      
      const imageBase64 = await compressImage(selectedImage);
      
      // Check final size
      const sizeInBytes = (imageBase64.length * 3) / 4;
      const maxSize = 900000; // ~900KB
      
      if (sizeInBytes > maxSize) {
        toast({
          title: "Image too large",
          description: "Please select a smaller image or try a different format.",
          variant: "destructive",
        });
        setUploadingPhoto(false);
        return;
      }

             // Update profile with base64 image data
       if (profile && registration) {
         const updatedProfile = { ...profile, profileImageUrl: imageBase64 };
         setProfile(updatedProfile);
         
         // Always use the correct userId from registration data to update the document
         const { doc, updateDoc } = await import('firebase/firestore');
         const { db } = await import('@/lib/firebase');
         
         // Use the registration document ID (which is the correct userId) to update
         const registrationRef = doc(db, 'registrations', registration.id);
         
         // Update the existing registration document with new profileImageUrl
         await updateDoc(registrationRef, {
           profileImageUrl: imageBase64
         });
         
         // console.log('✅ Profile photo updated in existing registration document using userId:', registration.id);
       }

             // Clear selected image and preview
       setSelectedImage(null);
       setImagePreview(null);
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
       }

       // Refresh profile data to show the updated photo
       await fetchProfile();

       toast({
         title: "Photo uploaded successfully!",
         description: "Your profile photo has been updated.",
       });
    } catch (error: any) {
      // console.error('Error uploading image:', error);
      
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!firebaseUser) return;

    try {
             // Update profile to remove image URL
       if (profile && registration) {
         const updatedProfile = { ...profile, profileImageUrl: '' };
         setProfile(updatedProfile);
         
         // Always use the correct userId from registration data to update the document
         const { doc, updateDoc } = await import('firebase/firestore');
         const { db } = await import('@/lib/firebase');
         
         // Use the registration document ID (which is the correct userId) to update
         const registrationRef = doc(db, 'registrations', registration.id);
         
         // Update the existing registration document to remove profileImageUrl
         await updateDoc(registrationRef, {
           profileImageUrl: ''
         });
         
         // console.log('✅ Profile photo removed from existing registration document using userId:', registration.id);
       }

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error) {
      // console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartEdit = () => {
    if (registration) {
      setEditingRegistration({ ...registration });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingRegistration(null);
    setIsEditing(false);
  };



  const handleSave = async () => {
    if (!editingRegistration || !firebaseUser) return;
    
    setSaving(true);
    try {
      // console.log('Saving registration data:', editingRegistration);
      
      // Update the registration document with the edited data
      const registrationRef = doc(db, 'registrations', editingRegistration.id);
      
      // Create update object with all editable fields
      const updateData: any = {
        updatedAt: new Date()
      };
      
      // Personal Details
      if (editingRegistration.name) updateData.name = editingRegistration.name;
      if (editingRegistration.gender) updateData.gender = editingRegistration.gender;
      if (editingRegistration.dateOfBirth) updateData.dateOfBirth = editingRegistration.dateOfBirth;
      if (editingRegistration.motherTongue) updateData.motherTongue = editingRegistration.motherTongue;
      if (editingRegistration.maritalStatus) updateData.maritalStatus = editingRegistration.maritalStatus;
      if (editingRegistration.religion) updateData.religion = editingRegistration.religion;
      if (editingRegistration.caste) updateData.caste = editingRegistration.caste;
      if (editingRegistration.subCaste) updateData.subCaste = editingRegistration.subCaste;
      
      // Family Details
      if (editingRegistration.fatherName) updateData.fatherName = editingRegistration.fatherName;
      if (editingRegistration.fatherJob) updateData.fatherJob = editingRegistration.fatherJob;
      if (editingRegistration.fatherAlive) updateData.fatherAlive = editingRegistration.fatherAlive;
      if (editingRegistration.motherName) updateData.motherName = editingRegistration.motherName;
      if (editingRegistration.motherJob) updateData.motherJob = editingRegistration.motherJob;
      if (editingRegistration.motherAlive) updateData.motherAlive = editingRegistration.motherAlive;
      if (editingRegistration.orderOfBirth) updateData.orderOfBirth = editingRegistration.orderOfBirth;
      
      // Physical Attributes
      if (editingRegistration.height) updateData.height = editingRegistration.height;
      if (editingRegistration.weight) updateData.weight = editingRegistration.weight;
      if (editingRegistration.bloodGroup) updateData.bloodGroup = editingRegistration.bloodGroup;
      if (editingRegistration.complexion) updateData.complexion = editingRegistration.complexion;
      if (editingRegistration.disability) updateData.disability = editingRegistration.disability;
      if (editingRegistration.diet) updateData.diet = editingRegistration.diet;
      
      // Education & Occupation
      if (editingRegistration.qualification) updateData.qualification = editingRegistration.qualification;
      if (editingRegistration.incomePerMonth) updateData.incomePerMonth = editingRegistration.incomePerMonth;
      if (editingRegistration.job) updateData.job = editingRegistration.job;
      if (editingRegistration.placeOfJob) updateData.placeOfJob = editingRegistration.placeOfJob;
      
      // Communication Details
      if (editingRegistration.presentAddress) updateData.presentAddress = editingRegistration.presentAddress;
      if (editingRegistration.permanentAddress) updateData.permanentAddress = editingRegistration.permanentAddress;
      if (editingRegistration.contactNumber) updateData.contactNumber = editingRegistration.contactNumber;
      if (editingRegistration.contactPerson) updateData.contactPerson = editingRegistration.contactPerson;
      
      // Astrology Details
      if (editingRegistration.ownHouse) updateData.ownHouse = editingRegistration.ownHouse;
      if (editingRegistration.star) updateData.star = editingRegistration.star;
      if (editingRegistration.laknam) updateData.laknam = editingRegistration.laknam;
      if (editingRegistration.timeOfBirth) updateData.timeOfBirth = editingRegistration.timeOfBirth;
      if (editingRegistration.raasi) updateData.raasi = editingRegistration.raasi;
      if (editingRegistration.gothram) updateData.gothram = editingRegistration.gothram;
      if (editingRegistration.placeOfBirth) updateData.placeOfBirth = editingRegistration.placeOfBirth;
      if (editingRegistration.padam) updateData.padam = editingRegistration.padam;
      if (editingRegistration.dossam) updateData.dossam = editingRegistration.dossam;
      if (editingRegistration.nativity) updateData.nativity = editingRegistration.nativity;
      
      // Horoscope Details
      if (editingRegistration.horoscopeRequired) updateData.horoscopeRequired = editingRegistration.horoscopeRequired;
      if (editingRegistration.balance) updateData.balance = editingRegistration.balance;
      if (editingRegistration.dasa) updateData.dasa = editingRegistration.dasa;
      if (editingRegistration.dasaPeriod) updateData.dasaPeriod = editingRegistration.dasaPeriod;
      
      // Partner Expectations
      if (editingRegistration.partnerExpectations) updateData.partnerExpectations = editingRegistration.partnerExpectations;
      
      // Additional Details
      if (editingRegistration.otherDetails) updateData.otherDetails = editingRegistration.otherDetails;
      if (editingRegistration.description) updateData.description = editingRegistration.description;
      
      // console.log('Update data to be saved:', updateData);
      
      // Test the update
      const result = await updateDoc(registrationRef, updateData);
      // console.log('Update result:', result);
      
      // Update the main registration state
      setRegistration(editingRegistration);
      setEditingRegistration(null);
      setIsEditing(false);
      
      // Refresh profile data to reflect changes
      await fetchProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      // console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navigation />
        <div className="flex items-center justify-center py-20">
        <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">Manage your profile information and preferences</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* User Summary Card */}
            <div className="lg:col-span-1">
              <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Profile Photo Section */}
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage 
                        src={imagePreview || profile?.profileImageUrl || registration?.profileImageUrl || user?.profileImageUrl} 
                        alt="Profile"
                      />
                      <AvatarFallback className="text-3xl">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Photo Upload Controls */}
                    <div className="space-y-2">
                          <input
                        ref={fileInputRef}
                            type="file"
                            accept="image/*"
                        onChange={handleImageSelect}
                            className="hidden"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                        disabled={uploadingPhoto}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Max 5MB • JPG, PNG, GIF
                      </p>
                      
                      {selectedImage && (
                        <div className="space-y-2">
                          <Button
                            onClick={handleImageUpload}
                            size="sm"
                            className="w-full"
                            disabled={uploadingPhoto}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingPhoto ? 'Saving...' : 'Save Photo'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="w-full"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                      </div>
                    )}
                      
                      {(profile?.profileImageUrl || registration?.profileImageUrl) && !selectedImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="w-full text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Photo
                        </Button>
                      )}
                  </div>
                    </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {registration?.name || user?.fullName || user?.email}
                  </h3>
                  {registration?.envaranId && (
                    <div className="mb-4">
                      <Label htmlFor="envaranId">Envaran ID</Label>
                      <p className="text-blue-600 font-mono font-bold py-2">{registration.envaranId}</p>
                    </div>
                  )}
                  
                  {/* Description Section */}
                  <div className="mb-6">
                    <Label htmlFor="description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={editingRegistration?.description || ''}
                        onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Tell others about yourself, your interests, hobbies, what you're looking for in a partner..."
                        rows={4}
                        className="mt-2 resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 mt-2 whitespace-pre-wrap">
                        {registration?.description || 'No description provided yet.'}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This description helps others get to know you better.
                    </p>
                  </div>
                  
                  {/* Complete Registration Notice */}
                  {registration?.id === 'temp' && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Complete Your Registration
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>You have a basic profile. Complete the full registration to unlock all features and get better matches.</p>
                            <div className="mt-2">
                              <Button
                                size="sm"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => window.location.href = '/register'}
                              >
                                Complete Registration
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Member since:</span>
                      <span>{registration?.submittedAt ? new Date(registration.submittedAt).toLocaleDateString() : 'Invalid Date'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profile status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                    </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={isEditing ? handleCancelEdit : handleStartEdit}
                        className="flex items-center gap-2"
                      >
                        {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="age">Age</Label>
                      <p className="text-gray-900 py-2">{profile?.age || 'Not specified'}</p>
                    </div>

                  <div>
                      <Label htmlFor="gender">Gender</Label>
                      <p className="text-gray-900 py-2 capitalize">{profile?.gender || 'Not specified'}</p>
                    </div>

                  <div>
                      <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editingRegistration?.presentAddress || ''}
                        onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, presentAddress: e.target.value } : null)}
                        placeholder="City, State"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile?.location || 'Not specified'}</p>
                    )}
                    </div>

                  <div>
                      <Label htmlFor="profession">Profession</Label>
                    {isEditing ? (
                      <Input
                        id="profession"
                        value={editingRegistration?.job || ''}
                        onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, job: e.target.value } : null)}
                        placeholder="Enter your profession"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile?.profession || 'Not specified'}</p>
                    )}
                    </div>

                  <div>
                      <Label htmlFor="education">Education</Label>
                    {isEditing ? (
                      <Input
                        id="education"
                        value={editingRegistration?.qualification || ''}
                        onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, qualification: e.target.value } : null)}
                        placeholder="Enter your education"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile?.education || 'Not specified'}</p>
                    )}
                    </div>

                  <div>
                      <Label htmlFor="relationshipStatus">Relationship Status</Label>
                      <p className="text-gray-900 py-2">{profile?.relationshipStatus || 'Not specified'}</p>
                    </div>
                    </div>

                {/* Additional Editable Details */}
                {isEditing && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          value={editingRegistration?.height || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, height: e.target.value } : null)}
                          placeholder="e.g., 5'8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={editingRegistration?.weight || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, weight: e.target.value } : null)}
                          placeholder="e.g., 70 kg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input
                          id="bloodGroup"
                          value={editingRegistration?.bloodGroup || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, bloodGroup: e.target.value } : null)}
                          placeholder="e.g., A+"
                        />
                      </div>
                      <div>
                        <Label htmlFor="diet">Diet</Label>
                        <Input
                          id="diet"
                          value={editingRegistration?.diet || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, diet: e.target.value } : null)}
                          placeholder="e.g., Vegetarian"
                        />
                      </div>
                      <div>
                        <Label htmlFor="income">Monthly Income</Label>
                        <Input
                          id="income"
                          value={editingRegistration?.incomePerMonth || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, incomePerMonth: e.target.value } : null)}
                          placeholder="e.g., ₹50,000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="placeOfJob">Place of Job</Label>
                        <Input
                          id="placeOfJob"
                          value={editingRegistration?.placeOfJob || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, placeOfJob: e.target.value } : null)}
                          placeholder="e.g., Chennai"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="otherDetails">Additional Details</Label>
                        <Textarea
                          id="otherDetails"
                          value={editingRegistration?.otherDetails || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, otherDetails: e.target.value } : null)}
                          placeholder="Tell us more about yourself..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.dateOfBirth || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                            placeholder="DD-MM-YYYY"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.dateOfBirth || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Mother Tongue</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.motherTongue || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, motherTongue: e.target.value } : null)}
                            placeholder="e.g., Tamil"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.motherTongue || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Religion</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.religion || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, religion: e.target.value } : null)}
                            placeholder="e.g., Hindu"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.religion || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Caste</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.caste || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, caste: e.target.value } : null)}
                            placeholder="e.g., Brahmin"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.caste || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Sub Caste</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.subCaste || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, subCaste: e.target.value } : null)}
                            placeholder="e.g., Iyer"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.subCaste || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Height</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.height || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, height: e.target.value } : null)}
                            placeholder="e.g., 5'8"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.height || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Weight</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.weight || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, weight: e.target.value } : null)}
                            placeholder="e.g., 70 kg"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.weight ? `${registration.weight} kg` : 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Blood Group</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.bloodGroup || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, bloodGroup: e.target.value } : null)}
                            placeholder="e.g., A+"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.bloodGroup || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Complexion</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.complexion || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, complexion: e.target.value } : null)}
                            placeholder="e.g., Fair"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.complexion || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Diet</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.diet || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, diet: e.target.value } : null)}
                            placeholder="e.g., Vegetarian"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.diet || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Income</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.incomePerMonth || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, incomePerMonth: e.target.value } : null)}
                            placeholder="e.g., ₹50,000"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.incomePerMonth ? `₹${registration.incomePerMonth}` : 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Place of Work</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.placeOfJob || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, placeOfJob: e.target.value } : null)}
                            placeholder="e.g., Chennai"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.placeOfJob || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Family Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Family Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Father's Name</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.fatherName || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, fatherName: e.target.value } : null)}
                            placeholder="Father's name"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.fatherName || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Father's Occupation</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.fatherJob || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, fatherJob: e.target.value } : null)}
                            placeholder="Father's occupation"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.fatherJob || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Father Alive</Label>
                        {isEditing ? (
                          <Select value={editingRegistration?.fatherAlive || ''} onValueChange={(value) => setEditingRegistration(prev => prev ? { ...prev, fatherAlive: value } : null)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-900 py-2">{registration.fatherAlive || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Mother's Name</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.motherName || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, motherName: e.target.value } : null)}
                            placeholder="Mother's name"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.motherName || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Mother's Occupation</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.motherJob || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, motherJob: e.target.value } : null)}
                            placeholder="Mother's occupation"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.motherJob || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Mother Alive</Label>
                        {isEditing ? (
                          <Select value={editingRegistration?.motherAlive || ''} onValueChange={(value) => setEditingRegistration(prev => prev ? { ...prev, motherAlive: value } : null)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-900 py-2">{registration.motherAlive || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Order of Birth</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.orderOfBirth || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, orderOfBirth: e.target.value } : null)}
                            placeholder="e.g., First, Second"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.orderOfBirth || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Astrology Details from Registration */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Astrology Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Star (Nakshatra)</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.star || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, star: e.target.value } : null)}
                            placeholder="e.g., Rohini"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.star || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label>Jaadhagam (Raasi) Chart</Label>
                        <div className="mt-2">
                          <RaasiImageDisplay
                            raasiImage={registration.raasiImage}
                            isOwner={true}
                            isPremium={false}
                            onUpgrade={() => {
                              // Handle upgrade to premium
                              toast({
                                title: "Upgrade to Premium",
                                description: "Contact support to upgrade your account and view all Raasi charts.",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Gothram</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.gothram || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, gothram: e.target.value } : null)}
                            placeholder="e.g., Kashyapa"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.gothram || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Place of Birth</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.placeOfBirth || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, placeOfBirth: e.target.value } : null)}
                            placeholder="e.g., Chennai"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.placeOfBirth || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Time of Birth</Label>
                        {isEditing ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              value={editingRegistration?.timeOfBirth?.hour || ''}
                              onChange={(e) => setEditingRegistration(prev => prev ? { 
                                ...prev, 
                                timeOfBirth: { 
                                  ...prev.timeOfBirth, 
                                  hour: e.target.value 
                                } 
                              } : null)}
                              placeholder="Hour"
                            />
                            <Input
                              value={editingRegistration?.timeOfBirth?.minute || ''}
                              onChange={(e) => setEditingRegistration(prev => prev ? { 
                                ...prev, 
                                timeOfBirth: { 
                                  ...prev.timeOfBirth, 
                                  minute: e.target.value 
                                } 
                              } : null)}
                              placeholder="Minute"
                            />
                            <Select 
                              value={editingRegistration?.timeOfBirth?.period || ''} 
                              onValueChange={(value) => setEditingRegistration(prev => prev ? { 
                                ...prev, 
                                timeOfBirth: { 
                                  ...prev.timeOfBirth, 
                                  period: value 
                                } 
                              } : null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <p className="text-gray-900 py-2">
                            {registration.timeOfBirth ? 
                              `${registration.timeOfBirth.hour}:${registration.timeOfBirth.minute} ${registration.timeOfBirth.period}` : 
                              'Not specified'}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Manglik</Label>
                        {isEditing ? (
                          <Select value={editingRegistration?.laknam || ''} onValueChange={(value) => setEditingRegistration(prev => prev ? { ...prev, laknam: value } : null)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manglik">Yes</SelectItem>
                              <SelectItem value="Non-Manglik">No</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-900 py-2">{registration.laknam === 'Manglik' ? 'Yes' : 'No'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Partner Expectations from Registration */}
                {registration?.partnerExpectations && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Partner Expectations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Age Range</Label>
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editingRegistration?.partnerExpectations?.preferredAgeFrom || ''}
                              onChange={(e) => setEditingRegistration(prev => prev ? { 
                                ...prev, 
                                partnerExpectations: { 
                                  ...prev.partnerExpectations, 
                                  preferredAgeFrom: parseInt(e.target.value) || 0 
                                } 
                              } : null)}
                              placeholder="From"
                              type="number"
                            />
                            <Input
                              value={editingRegistration?.partnerExpectations?.preferredAgeTo || ''}
                              onChange={(e) => setEditingRegistration(prev => prev ? { 
                                ...prev, 
                                partnerExpectations: { 
                                  ...prev.partnerExpectations, 
                                  preferredAgeTo: parseInt(e.target.value) || 0 
                                } 
                              } : null)}
                              placeholder="To"
                              type="number"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 py-2">
                            {registration.partnerExpectations.preferredAgeFrom} - {registration.partnerExpectations.preferredAgeTo} years
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Preferred Job</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.partnerExpectations?.job || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { 
                              ...prev, 
                              partnerExpectations: { 
                                ...prev.partnerExpectations, 
                                job: e.target.value 
                              } 
                            } : null)}
                            placeholder="e.g., Software Engineer"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.partnerExpectations.job || 'Any'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Preferred Diet</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.partnerExpectations?.diet || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { 
                              ...prev, 
                              partnerExpectations: { 
                                ...prev.partnerExpectations, 
                                diet: e.target.value 
                              } 
                            } : null)}
                            placeholder="e.g., Vegetarian"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{registration.partnerExpectations.diet || 'Any'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Preferred Marital Status</Label>
                        {isEditing ? (
                          <Input
                            value={editingRegistration?.partnerExpectations?.maritalStatus?.join(', ') || ''}
                            onChange={(e) => setEditingRegistration(prev => prev ? { 
                              ...prev, 
                              partnerExpectations: { 
                                ...prev.partnerExpectations, 
                                maritalStatus: e.target.value.split(',').map(s => s.trim()) 
                              } 
                            } : null)}
                            placeholder="e.g., Never Married, Divorced"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">
                            {registration.partnerExpectations.maritalStatus?.join(', ') || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Additional Comments</Label>
                      {isEditing ? (
                        <Textarea
                          value={editingRegistration?.partnerExpectations?.comments || ''}
                          onChange={(e) => setEditingRegistration(prev => prev ? { 
                            ...prev, 
                            partnerExpectations: { 
                              ...prev.partnerExpectations, 
                              comments: e.target.value 
                            } 
                          } : null)}
                          placeholder="Any additional preferences..."
                          rows={3}
                        />
                      ) : (
                        registration.partnerExpectations.comments && (
                          <p className="text-gray-900 py-2">{registration.partnerExpectations.comments}</p>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                {registration && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                    {isEditing ? (
                      <Textarea
                        value={editingRegistration?.otherDetails || ''}
                        onChange={(e) => setEditingRegistration(prev => prev ? { ...prev, otherDetails: e.target.value } : null)}
                        placeholder="Tell us more about yourself..."
                        rows={4}
                      />
                    ) : (
                      registration.otherDetails && (
                        <p className="text-gray-900 py-2">{registration.otherDetails}</p>
                      )
                    )}
                  </div>
                )}

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    </div>
                )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      
      <Footer />
    </div>
  );
}
