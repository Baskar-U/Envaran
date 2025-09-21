import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';

// Function to generate Envaran ID
const generateEnvaranId = async (): Promise<string> => {
  try {
    // Get the count of existing registrations to determine the next ID
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, orderBy('submittedAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    let nextNumber = 1;
    if (!querySnapshot.empty) {
      // Get all registrations to count them properly
      const allRegistrationsQuery = query(registrationsRef);
      const allRegistrationsSnapshot = await getDocs(allRegistrationsQuery);
      nextNumber = allRegistrationsSnapshot.size + 1;
    }
    
    return `envaran${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    // console.error('Error generating Envaran ID:', error);
    // Fallback to timestamp-based ID
    return `envaran${Date.now().toString().slice(-3)}`;
  }
};

interface RegistrationFormData {
  // Personal Details
  name: string;
  gender: string;
  dateOfBirth: string;
  age: number | null;
  motherTongue: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  
  // Account Type (automatically set to free for new registrations)
  plan: 'free';
  
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
  timeOfBirthHour: string;
  timeOfBirthMinute: string;
  timeOfBirthPeriod: string;
  raasi: string;
  raasiImage: string; // Base64 encoded image
  gothram: string;
  placeOfBirth: string;
  padam: string;
  dossam: string;
  nativity: string;
  
  // Horoscope Details
  horoscopeRequired: string;
  balance: string;
  dasa: string;
  dasaPeriodYears: string;
  dasaPeriodMonths: string;
  dasaPeriodDays: string;
  
  // Partner Expectations
  partnerJob: string;
  preferredAgeFrom: string;
  preferredAgeTo: string;
  jobPreference: string;
  partnerDiet: string;
  partnerMaritalStatus: string[];
  partnerCaste: string;
  partnerSubCaste: string;
  partnerComments: string;
  
  // Additional Details
  otherDetails: string;
  description: string;
  
  // Images
  profileImage: string; // Base64 encoded profile image
  
  // Account Details
  email: string;
  password: string;
  confirmPassword: string;
}

// Caste data structure
interface CasteData {
  [casteName: string]: string[];
}

const RegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [generatedEnvaranId, setGeneratedEnvaranId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [casteData, setCasteData] = useState<CasteData>({});
  const [availableSubCastes, setAvailableSubCastes] = useState<string[]>([]);
  const [availablePartnerSubCastes, setAvailablePartnerSubCastes] = useState<string[]>(['NILL']);
  const [isLoadingCasteData, setIsLoadingCasteData] = useState(true);

  // Load caste data from CSV
  useEffect(() => {
    const loadCasteData = async () => {
      setIsLoadingCasteData(true);
      
      // Set fallback data immediately
      const fallbackData = {
        // Hindu Castes
        'ABLAKAROR': ['NILL'],
        'ADIDRAVIDAR': ['.PALLAR', 'BARBAR', 'KUAVAR', 'KURAVAR', 'MARUTHAVARI', 'MURUTHUAR', 'PADAIYACHI', 'PANDITAR', 'PARAYAR'],
        'ACHARY': ['NILL'],
        'AGAMUDIYAR': ['NILL'],
        'AMBALAAR': ['MOOPANAAR'],
        'ARUNDUDHI': ['NILL'],
        'ARUNTHATHIYAR': ['PADAIYACHI', 'SAKKELIAR'],
        'AYYAR': ['TENKALAI'],
        'BANDARAM': ['ANDI'],
        'BANNIYAR': ['PADAIYACHI'],
        'BRAHMIN': ['AADISAIVER', 'AYAN', 'AYYANGAR', 'IYYAR'],
        'CHETTIYAR': ['THELUGU', 'THOLUVA', 'VANIBA', 'VANIYAR', 'VELLACHETTIYAR'],
        'DULUVAR': ['VELLALAR'],
        'GOUNDER': ['NILL'],
        'GRAMANI': ['NILL'],
        'IYYAR': ['DASINGAR', 'GURKAL', 'KURUKAL', 'PRAGASARANAM', 'NILL'],
        'KARUNEGAR': ['NILL'],
        'KONAR': ['VELLALAR', 'YADAV', 'YADAVAR', 'NILL'],
        'MUTHIRIAR': ['AMBALAM', 'SANGUNTHAN'],
        'NADAR': ['GRAMANI', 'HINDU', 'HINDUNADAR', 'KAMRAJ', 'MARAMERINADAR', 'NADAR', 'PANANARAYAN', 'R.C.NADAR', 'SAANAR'],
        'NAIDU': ['CHERULAI', 'CHETTYNAIDU', 'GAVAR', 'JANGAM', 'KAMMAVAR', 'KAVARA', 'PALIJANAIDU', 'SANARNAIDU', 'VADUGAN', 'VALAYAR'],
        'NAIKAR': ['NILL'],
        'NAVITHAR': ['BARBAR'],
        'PANDARAM': ['ANDI'],
        'PANDITHAR': ['BARBAR', 'MARUTHAVARI'],
        'PILLAI': ['KAGATHA', 'KARKALA', 'NAIR', 'PANIKKAR', 'SAIVA', 'SOLEYAVELALOR', 'SOLIAR', 'SOLIYA', 'THEVA', 'THOLUVA', 'THOLUVAVELLALAR', 'THULLAM', 'VEERAGUL', 'VEERAKODAI', 'VEERAVELLAR', 'VELLALAR', 'VERAGUDIVELLALAR'],
        'RAWHAR': ['NILL'],
        'REDDIYAR': ['NILL'],
        'REDDY': ['NILL'],
        'SERULAI': ['AGAMUDAIYAR'],
        'SETIYAR': ['VANIBA'],
        'SHAWRASTRA': ['NILL'],
        'SOLEYA': ['VELLALAR'],
        'VALLALAR': ['GOUNDAR', 'GURAVEL', 'PILLAI'],
        'VANAR': ['NILL'],
        'VANIYAR': ['CHADIYAR', 'DHOBI', 'DOBI', 'GOUNDAR', 'KARKATHAVELLALAR', 'KOUNDA', 'NAIKAR', 'NNAYAKKAR'],
        'VELLALAR': ['ESAI', 'GOUNDAR', 'KARAKADU', 'KARKATHAPILLAI', 'KARKATHAVELALAR', 'KURUMBAR', 'PILLAI', 'SAIVA', 'SOLEYA', 'THOLUVAVELLALAR', 'VEERAKODAI'],
        'VISHWAKARMA': ['ACHARY', 'ASARI', 'NADAR'],
        'YADAVAR': ['GANAR', 'GONAR', 'KONAR', 'YADAVAR'],
        
        // Muslim Castes
        'MUSLIM': ['LABBAI', 'LEPPAI', 'RABBAN', 'RAVUTHUR', 'SYED']
      };
      
      setCasteData(fallbackData);
      
      try {
        const response = await fetch('/caste.csv');
        if (!response.ok) {
          throw new Error('CSV file not found');
        }
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        const casteMap: CasteData = {};
        let currentCaste = '';
        
        for (let i = 1; i < lines.length; i++) { // Skip header
          const columns = lines[i].split(',');
          const caste = columns[4]?.trim();
          const subCaste = columns[5]?.trim();
          
          
          if (caste && caste !== '') {
            currentCaste = caste;
            if (subCaste && subCaste !== '') {
              casteMap[currentCaste] = [subCaste];
            } else {
              casteMap[currentCaste] = ['NILL'];
            }
          } else if (subCaste && subCaste !== '' && currentCaste) {
            if (casteMap[currentCaste]) {
              casteMap[currentCaste].push(subCaste);
            }
          }
        }
        
        // Only update if we successfully parsed data and it doesn't contain invalid values
        const hasInvalidValues = Object.keys(casteMap).some(key => key.includes(';') || key.includes('300') || key.includes('0'));
        
        if (Object.keys(casteMap).length > 0 && !hasInvalidValues) {
          setCasteData(casteMap);
        }
      } catch (error) {
        // console.error('Error loading caste data:', error);
        // Fallback data is already set above
      } finally {
        setIsLoadingCasteData(false);
      }
    };
    
    loadCasteData();
  }, []);

  const [formData, setFormData] = useState<RegistrationFormData>({
    // Personal Details
    name: '',
    gender: '',
    dateOfBirth: '',
    age: null,
    motherTongue: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    subCaste: '',
    
    // Account Type (automatically set to free for new registrations)
            plan: 'free',
    
    // Family Details
    fatherName: '',
    fatherJob: '',
    fatherAlive: '',
    motherName: '',
    motherJob: '',
    motherAlive: '',
    orderOfBirth: '',
    
    // Physical Attributes
    height: '',
    weight: '',
    bloodGroup: '',
    complexion: '',
    disability: '',
    diet: '',
    
    // Education & Occupation
    qualification: '',
    incomePerMonth: '',
    job: '',
    placeOfJob: '',
    
    // Communication Details
    presentAddress: '',
    permanentAddress: '',
    contactNumber: '',
    contactPerson: '',
    
    // Astrology Details
    ownHouse: '',
    star: '',
    laknam: '',
    timeOfBirthHour: '',
    timeOfBirthMinute: '',
    timeOfBirthPeriod: '',
    raasi: '',
    raasiImage: '',
    gothram: '',
    placeOfBirth: '',
    padam: '',
    dossam: '',
    nativity: '',
    
    // Horoscope Details
    horoscopeRequired: '',
    balance: '',
    dasa: '',
    dasaPeriodYears: '',
    dasaPeriodMonths: '',
    dasaPeriodDays: '',
    
    // Partner Expectations
    partnerJob: '',
    preferredAgeFrom: '',
    preferredAgeTo: '',
    jobPreference: '',
    partnerDiet: '',
    partnerMaritalStatus: [],
    partnerCaste: '',
    partnerSubCaste: '',
    partnerComments: '',
    
    // Additional Details
    otherDetails: '',
    description: '',
    
    // Images
    profileImage: '',
    
    // Account Details
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Clean up any invalid caste values when casteData loads
  useEffect(() => {
    if (Object.keys(casteData).length > 0 && formData.caste && !casteData[formData.caste]) {
      handleInputChange('caste', '');
      handleInputChange('subCaste', '');
      setAvailableSubCastes([]);
    }
  }, [casteData, formData.caste]);

  // Safeguard against corrupted casteData
  useEffect(() => {
    const hasInvalidKeys = Object.keys(casteData).some(key => key.includes(';') || key.includes('300') || key.includes('0'));
    if (hasInvalidKeys) {
      const fallbackData = {
        // Hindu Castes
        'ABLAKAROR': ['NILL'],
        'ADIDRAVIDAR': ['.PALLAR', 'BARBAR', 'KUAVAR', 'KURAVAR', 'MARUTHAVARI', 'MURUTHUAR', 'PADAIYACHI', 'PANDITAR', 'PARAYAR'],
        'ACHARY': ['NILL'],
        'AGAMUDIYAR': ['NILL'],
        'AMBALAAR': ['MOOPANAAR'],
        'ARUNDUDHI': ['NILL'],
        'ARUNTHATHIYAR': ['PADAIYACHI', 'SAKKELIAR'],
        'AYYAR': ['TENKALAI'],
        'BANDARAM': ['ANDI'],
        'BANNIYAR': ['PADAIYACHI'],
        'BRAHMIN': ['AADISAIVER', 'AYAN', 'AYYANGAR', 'IYYAR'],
        'CHETTIYAR': ['THELUGU', 'THOLUVA', 'VANIBA', 'VANIYAR', 'VELLACHETTIYAR'],
        'DULUVAR': ['VELLALAR'],
        'GOUNDER': ['NILL'],
        'GRAMANI': ['NILL'],
        'IYYAR': ['DASINGAR', 'GURKAL', 'KURUKAL', 'PRAGASARANAM', 'NILL'],
        'KARUNEGAR': ['NILL'],
        'KONAR': ['VELLALAR', 'YADAV', 'YADAVAR', 'NILL'],
        'MUTHIRIAR': ['AMBALAM', 'SANGUNTHAN'],
        'NADAR': ['GRAMANI', 'HINDU', 'HINDUNADAR', 'KAMRAJ', 'MARAMERINADAR', 'NADAR', 'PANANARAYAN', 'R.C.NADAR', 'SAANAR'],
        'NAIDU': ['CHERULAI', 'CHETTYNAIDU', 'GAVAR', 'JANGAM', 'KAMMAVAR', 'KAVARA', 'PALIJANAIDU', 'SANARNAIDU', 'VADUGAN', 'VALAYAR'],
        'NAIKAR': ['NILL'],
        'NAVITHAR': ['BARBAR'],
        'PANDARAM': ['ANDI'],
        'PANDITHAR': ['BARBAR', 'MARUTHAVARI'],
        'PILLAI': ['KAGATHA', 'KARKALA', 'NAIR', 'PANIKKAR', 'SAIVA', 'SOLEYAVELALOR', 'SOLIAR', 'SOLIYA', 'THEVA', 'THOLUVA', 'THOLUVAVELLALAR', 'THULLAM', 'VEERAGUL', 'VEERAKODAI', 'VEERAVELLAR', 'VELLALAR', 'VERAGUDIVELLALAR'],
        'RAWHAR': ['NILL'],
        'REDDIYAR': ['NILL'],
        'REDDY': ['NILL'],
        'SERULAI': ['AGAMUDAIYAR'],
        'SETIYAR': ['VANIBA'],
        'SHAWRASTRA': ['NILL'],
        'SOLEYA': ['VELLALAR'],
        'VALLALAR': ['GOUNDAR', 'GURAVEL', 'PILLAI'],
        'VANAR': ['NILL'],
        'VANIYAR': ['CHADIYAR', 'DHOBI', 'DOBI', 'GOUNDAR', 'KARKATHAVELLALAR', 'KOUNDA', 'NAIKAR', 'NNAYAKKAR'],
        'VELLALAR': ['ESAI', 'GOUNDAR', 'KARAKADU', 'KARKATHAPILLAI', 'KARKATHAVELALAR', 'KURUMBAR', 'PILLAI', 'SAIVA', 'SOLEYA', 'THOLUVAVELLALAR', 'VEERAKODAI'],
        'VISHWAKARMA': ['ACHARY', 'ASARI', 'NADAR'],
        'YADAVAR': ['GANAR', 'GONAR', 'KONAR', 'YADAVAR'],
        
        // Muslim Castes
        'MUSLIM': ['LABBAI', 'LEPPAI', 'RABBAN', 'RAVUTHUR', 'SYED']
      };
      setCasteData(fallbackData);
    }
  }, [casteData]);

  const handleInputChange = (field: keyof RegistrationFormData, value: string | string[] | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle caste selection and update sub-caste options
  const handleCasteChange = (caste: string) => {
    // Validate that the selected caste exists in our data
    if (!casteData[caste] && caste !== '') {
      handleInputChange('caste', '');
      setAvailableSubCastes([]);
      return;
    }
    
    handleInputChange('caste', caste);
    handleInputChange('subCaste', ''); // Clear sub-caste when caste changes

    // Update available sub-castes based on selected caste
    if (casteData[caste]) {
      setAvailableSubCastes(casteData[caste]);
    } else {
      setAvailableSubCastes(['NILL']);
    }
  };

  // Handle partner caste selection and update partner sub-caste options
  const handlePartnerCasteChange = (caste: string) => {
    // Validate that the selected caste exists in our data
    if (!casteData[caste] && caste !== '') {
      handleInputChange('partnerCaste', '');
      setAvailablePartnerSubCastes([]);
      return;
    }
    
    handleInputChange('partnerCaste', caste);
    handleInputChange('partnerSubCaste', ''); // Clear sub-caste when caste changes

    // Update available partner sub-castes based on selected caste
    if (casteData[caste]) {
      setAvailablePartnerSubCastes(casteData[caste]);
    } else {
      setAvailablePartnerSubCastes(['NILL']);
    }
  };

  const handleInputChangeEvent = (field: keyof RegistrationFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(field, e.target.value);
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    
    // Parse DD-MM-YYYY format
    const parts = dateOfBirth.split('-');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };

  // Function to handle date of birth change with age calculation
  const handleDateOfBirthChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as DD-MM-YYYY
    let formattedValue = '';
    if (digitsOnly.length >= 1) formattedValue += digitsOnly.substring(0, 2);
    if (digitsOnly.length >= 3) formattedValue += '-' + digitsOnly.substring(2, 4);
    if (digitsOnly.length >= 5) formattedValue += '-' + digitsOnly.substring(4, 8);
    
    handleInputChange('dateOfBirth', formattedValue);
    const calculatedAge = calculateAge(formattedValue);
    handleInputChange('age', calculatedAge);
  };

  const validateAllSteps = () => {
    // Check all required steps
    for (let step = 1; step <= totalSteps; step++) {
      const originalStep = currentStep;
      setCurrentStep(step);
      
      if (!validateCurrentStep()) {
        setCurrentStep(originalStep);
        return false;
      }
    }
    
    // Additional validation for email and password
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in email and password.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllSteps()) {
      return;
    }
    
    setIsSubmitting(true);
    setShowLoadingPopup(true);

    try {
      // First, create the Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const newUser = userCredential.user;

      // Generate Envaran ID
      const envaranId = await generateEnvaranId();
      setGeneratedEnvaranId(envaranId);
      
      // Prepare data for Firebase
      const registrationData = {
        userId: newUser.uid,
        envaranId: envaranId,
        status: 'completed',
        submittedAt: new Date(),
        
        // Personal Details
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        motherTongue: formData.motherTongue,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste,
        
        // Account Type (automatically set to free for new registrations)
        plan: 'free',
        
        // Family Details
        fatherName: formData.fatherName,
        fatherJob: formData.fatherJob,
        fatherAlive: formData.fatherAlive,
        motherName: formData.motherName,
        motherJob: formData.motherJob,
        motherAlive: formData.motherAlive,
        orderOfBirth: formData.orderOfBirth,
        
        // Physical Attributes
        height: formData.height,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        complexion: formData.complexion,
        disability: formData.disability,
        diet: formData.diet,
        
        // Education & Occupation
        qualification: formData.qualification,
        incomePerMonth: formData.incomePerMonth,
        job: formData.job,
        placeOfJob: formData.placeOfJob,
        
        // Communication Details
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        contactNumber: formData.contactNumber,
        contactPerson: formData.contactPerson,
        
        // Astrology Details
        ownHouse: formData.ownHouse,
        star: formData.star,
        laknam: formData.laknam,
        timeOfBirth: {
          hour: formData.timeOfBirthHour,
          minute: formData.timeOfBirthMinute,
          period: formData.timeOfBirthPeriod
        },
        raasi: formData.raasi,
        raasiImage: formData.raasiImage,
        gothram: formData.gothram,
        placeOfBirth: formData.placeOfBirth,
        padam: formData.padam,
        dossam: formData.dossam,
        nativity: formData.nativity,
        
        // Horoscope Details
        horoscopeRequired: formData.horoscopeRequired,
        balance: formData.balance,
        dasa: formData.dasa,
        dasaPeriod: {
          years: formData.dasaPeriodYears,
          months: formData.dasaPeriodMonths,
          days: formData.dasaPeriodDays
        },
        
        // Partner Expectations
        partnerExpectations: {
          job: formData.partnerJob,
          preferredAgeFrom: parseInt(formData.preferredAgeFrom) || 0,
          preferredAgeTo: parseInt(formData.preferredAgeTo) || 0,
          jobPreference: formData.jobPreference,
          diet: formData.partnerDiet,
          maritalStatus: formData.partnerMaritalStatus,
          caste: formData.partnerCaste,
          subCaste: formData.partnerSubCaste,
          comments: formData.partnerComments
        },
        
        // Additional Details
        otherDetails: formData.otherDetails,
        description: formData.description,
        
        // Images
        profileImage: (() => {
          // console.log('💾 RegistrationForm: Saving profile image to database...');
          // console.log('📊 RegistrationForm: Profile image data:', {
          //   hasImage: !!formData.profileImage,
          //   length: formData.profileImage?.length || 0,
          //   preview: formData.profileImage?.substring(0, 50) + '...' || 'No image'
          // });
          return formData.profileImage;
        })(),
        profileImageUrl: (() => {
          // console.log('💾 RegistrationForm: Saving profile image URL to database...');
          // console.log('📊 RegistrationForm: Profile image URL data:', {
          //   hasImage: !!formData.profileImage,
          //   length: formData.profileImage?.length || 0,
          //   preview: formData.profileImage?.substring(0, 50) + '...' || 'No image'
          // });
          return formData.profileImage; // Also save to profileImageUrl field
        })(),
        
        // Metadata
        approvedAt: null,
        approvedBy: null,
        rejectionReason: null
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'registrations'), registrationData);

      // Show success popup with Envaran ID
      setShowSuccessPopup(true);

    } catch (error: any) {
      // console.error('Error creating account:', error);
      
      let errorMessage = "There was an error creating your account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please use a different email or try logging in instead.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password with at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({
        title: "Account Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowLoadingPopup(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Details
        if (!formData.name || !formData.gender || !formData.dateOfBirth || 
            !formData.motherTongue || !formData.maritalStatus || !formData.religion) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        
        // Validate date format (DD-MM-YYYY)
        if (formData.dateOfBirth) {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          if (!dateRegex.test(formData.dateOfBirth)) {
            toast({
              title: "Invalid Date Format",
              description: "Please enter date in DD-MM-YYYY format (e.g., 15-08-1990).",
              variant: "destructive",
            });
            return false;
          }
          
          // Validate if age is calculated
          if (formData.age === null) {
            toast({
              title: "Invalid Date",
              description: "Please enter a valid date of birth.",
              variant: "destructive",
            });
            return false;
          }
          
          // Validate minimum age (18 years)
          if (formData.age < 18) {
            toast({
              title: "Age Requirement",
              description: "You must be at least 18 years old to register.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      case 2: // Family Details
        if (!formData.fatherName || !formData.fatherAlive || 
            !formData.motherName || !formData.motherAlive) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 3: // Physical Attributes & Education
        // No required fields for this step, so always return true
        return true;
        
      case 4: // Contact Information
        if (!formData.presentAddress || !formData.contactNumber) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 5: // Astrology Details
        // No required fields for this step, so always return true
        return true;
        
      case 6: // Partner Expectations
        // No required fields for this step, so always return true
        return true;
        
      case 7: // Account Creation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields marked with * before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords Don't Match",
            description: "Password and confirm password must be the same.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.password.length < 6) {
          toast({
            title: "Password Too Short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
        
      default:
        return true;
    }
  };


  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>
      
      {/* Profile Image Upload */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ImageUpload
            label="Profile Photo"
            value={formData.profileImage}
            onChange={(base64) => {
              // console.log('📝 RegistrationForm: Profile image onChange triggered');
              // console.log('📊 RegistrationForm: Base64 data received:', {
              //   length: base64.length,
              //   preview: base64.substring(0, 50) + '...',
              //   hasData: base64.length > 0
              // });
              // console.log('🔄 RegistrationForm: Calling handleInputChange for profileImage...');
              handleInputChange('profileImage', base64);
              // console.log('✅ RegistrationForm: Profile image updated in form data');
            }}
            placeholder="Upload your profile photo"
            required={false}
            maxSizeMB={5}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChangeEvent('name')}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth * (DD-MM-YYYY)</Label>
          <Input
            id="dateOfBirth"
            type="text"
            placeholder="DD-MM-YYYY (e.g., 15-08-1990)"
            value={formData.dateOfBirth}
            onChange={(e) => handleDateOfBirthChange(e.target.value)}
            maxLength={10}
            required
          />
          {formData.age !== null && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Age: {formData.age} years old
            </p>
          )}
          {formData.dateOfBirth && formData.age === null && (
            <p className="text-sm text-red-600 mt-1">
              ❌ Please enter a valid date
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="motherTongue">Mother Tongue *</Label>
          <Select value={formData.motherTongue} onValueChange={(value) => handleInputChange('motherTongue', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mother tongue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tamil">Tamil</SelectItem>
              <SelectItem value="Telugu">Telugu</SelectItem>
              <SelectItem value="Kannada">Kannada</SelectItem>
              <SelectItem value="Malayalam">Malayalam</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
              <SelectItem value="Gujarati">Gujarati</SelectItem>
              <SelectItem value="Punjabi">Punjabi</SelectItem>
              <SelectItem value="Odia">Odia</SelectItem>
              <SelectItem value="Assamese">Assamese</SelectItem>
              <SelectItem value="Sanskrit">Sanskrit</SelectItem>
              <SelectItem value="Urdu">Urdu</SelectItem>
              <SelectItem value="Sindhi">Sindhi</SelectItem>
              <SelectItem value="Kashmiri">Kashmiri</SelectItem>
              <SelectItem value="Konkani">Konkani</SelectItem>
              <SelectItem value="Manipuri">Manipuri</SelectItem>
              <SelectItem value="Nepali">Nepali</SelectItem>
              <SelectItem value="Bodo">Bodo</SelectItem>
              <SelectItem value="Santhali">Santhali</SelectItem>
              <SelectItem value="Maithili">Maithili</SelectItem>
              <SelectItem value="Dogri">Dogri</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unmarried">Unmarried</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="religion">Religion *</Label>
          <Select value={formData.religion} onValueChange={(value) => {
            handleInputChange('religion', value);
            // Clear caste when religion changes
            handleInputChange('caste', '');
            handleInputChange('subCaste', '');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Muslim">Muslim</SelectItem>
              <SelectItem value="Christian">Christian</SelectItem>
              <SelectItem value="Sikh">Sikh</SelectItem>
              <SelectItem value="Buddhist">Buddhist</SelectItem>
              <SelectItem value="Jain">Jain</SelectItem>
              <SelectItem value="Parsi">Parsi</SelectItem>
              <SelectItem value="Jewish">Jewish</SelectItem>
              <SelectItem value="Atheist">Atheist</SelectItem>
              <SelectItem value="Agnostic">Agnostic</SelectItem>
              <SelectItem value="Spiritual">Spiritual</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="caste">Caste</Label>
          <Select value={formData.caste} onValueChange={handleCasteChange} disabled={isLoadingCasteData}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingCasteData ? "Loading castes..." : "Select caste"} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(casteData)
                .filter(caste => caste && caste.trim() !== '' && !caste.includes(';'))
                .map((caste) => (
                  <SelectItem key={caste} value={caste}>
                    {caste}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subCaste">Sub Caste</Label>
          <Select value={formData.subCaste} onValueChange={(value) => handleInputChange('subCaste', value)} disabled={!formData.caste || isLoadingCasteData}>
            <SelectTrigger>
              <SelectValue placeholder={!formData.caste ? "Select caste first" : "Select sub caste"} />
            </SelectTrigger>
            <SelectContent>
              {availableSubCastes.map((subCaste) => (
                <SelectItem key={subCaste} value={subCaste}>
                  {subCaste}
                </SelectItem>
              ))}











            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Family Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father Details - Left Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-blue-600 border-b pb-2">Father's Details</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fatherJob">Father's Occupation</Label>
              <Select value={formData.fatherJob} onValueChange={(value) => handleInputChange('fatherJob', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government Employee">Government Employee</SelectItem>
                  <SelectItem value="Private Employee">Private Employee</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Lawyer">Lawyer</SelectItem>
                  <SelectItem value="Farmer">Farmer</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fatherAlive">Father Alive *</Label>
              <Select value={formData.fatherAlive} onValueChange={(value) => handleInputChange('fatherAlive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mother Details - Right Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-pink-600 border-b pb-2">Mother's Details</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="motherJob">Mother's Occupation</Label>
              <Select value={formData.motherJob} onValueChange={(value) => handleInputChange('motherJob', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homemaker">Homemaker</SelectItem>
                  <SelectItem value="Government Employee">Government Employee</SelectItem>
                  <SelectItem value="Private Employee">Private Employee</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motherAlive">Mother Alive *</Label>
              <Select value={formData.motherAlive} onValueChange={(value) => handleInputChange('motherAlive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Order of Birth - Full Width */}
      <div className="mt-6">
        <Label htmlFor="orderOfBirth">Order of Birth</Label>
        <Select value={formData.orderOfBirth} onValueChange={(value) => handleInputChange('orderOfBirth', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First">First</SelectItem>
            <SelectItem value="Second">Second</SelectItem>
            <SelectItem value="Third">Third</SelectItem>
            <SelectItem value="Fourth">Fourth</SelectItem>
            <SelectItem value="Fifth">Fifth</SelectItem>
            <SelectItem value="Only Child">Only Child</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Physical Attributes & Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            placeholder="e.g., 5'8&quot;"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="complexion">Complexion</Label>
          <Select value={formData.complexion} onValueChange={(value) => handleInputChange('complexion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Wheatish">Wheatish</SelectItem>
              <SelectItem value="Dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="disability">Any Disability</Label>
          <Select value={formData.disability} onValueChange={(value) => handleInputChange('disability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="diet">Diet</Label>
          <Select value={formData.diet} onValueChange={(value) => handleInputChange('diet', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="Eggetarian">Eggetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="qualification">Educational Qualification</Label>
          <Select value={formData.qualification} onValueChange={(value) => handleInputChange('qualification', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="CA">CA (Chartered Accountant)</SelectItem>
              <SelectItem value="CS">CS (Company Secretary)</SelectItem>
              <SelectItem value="ICWA">ICWA</SelectItem>
              <SelectItem value="MBBS">MBBS</SelectItem>
              <SelectItem value="BDS">BDS</SelectItem>
              <SelectItem value="B.Tech">B.Tech</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
              <SelectItem value="BBA">BBA</SelectItem>
              <SelectItem value="MBA">MBA</SelectItem>
              <SelectItem value="LLB">LLB</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="incomePerMonth">Monthly Income</Label>
          <Select value={formData.incomePerMonth} onValueChange={(value) => handleInputChange('incomePerMonth', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below 25,000">Below ₹25,000</SelectItem>
              <SelectItem value="25,000 - 50,000">₹25,000 - ₹50,000</SelectItem>
              <SelectItem value="50,000 - 75,000">₹50,000 - ₹75,000</SelectItem>
              <SelectItem value="75,000 - 1,00,000">₹75,000 - ₹1,00,000</SelectItem>
              <SelectItem value="1,00,000 - 2,00,000">₹1,00,000 - ₹2,00,000</SelectItem>
              <SelectItem value="2,00,000 - 5,00,000">₹2,00,000 - ₹5,00,000</SelectItem>
              <SelectItem value="Above 5,00,000">Above ₹5,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="job">Occupation</Label>
          <Select value={formData.job} onValueChange={(value) => handleInputChange('job', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Government Employee">Government Employee</SelectItem>
              <SelectItem value="Private Employee">Private Employee</SelectItem>
              <SelectItem value="Engineer">Engineer</SelectItem>
              <SelectItem value="Lawyer">Lawyer</SelectItem>
              <SelectItem value="CA">Chartered Accountant</SelectItem>
              <SelectItem value="Banking">Banking</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="placeOfJob">Place of Work</Label>
          <Select value={formData.placeOfJob} onValueChange={(value) => handleInputChange('placeOfJob', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select work location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Jaipur">Jaipur</SelectItem>
              <SelectItem value="Lucknow">Lucknow</SelectItem>
              <SelectItem value="Patna">Patna</SelectItem>
              <SelectItem value="Bhopal">Bhopal</SelectItem>
              <SelectItem value="Indore">Indore</SelectItem>
              <SelectItem value="Vadodara">Vadodara</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Nagpur">Nagpur</SelectItem>
              <SelectItem value="Vishakhapatnam">Vishakhapatnam</SelectItem>
              <SelectItem value="Coimbatore">Coimbatore</SelectItem>
              <SelectItem value="Madurai">Madurai</SelectItem>
              <SelectItem value="Salem">Salem</SelectItem>
              <SelectItem value="Tiruchirappalli">Tiruchirappalli</SelectItem>
              <SelectItem value="Vellore">Vellore</SelectItem>
              <SelectItem value="Erode">Erode</SelectItem>
              <SelectItem value="Tiruppur">Tiruppur</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="presentAddress">Present Address *</Label>
          <Textarea
            id="presentAddress"
            value={formData.presentAddress}
            onChange={(e) => handleInputChange('presentAddress', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="permanentAddress">Permanent Address</Label>
          <Textarea
            id="permanentAddress"
            value={formData.permanentAddress}
            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Jaadhagam (Raasi) Image</h3>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ImageUpload
            label="Jaadhagam (Raasi) Image"
            value={formData.raasiImage}
            onChange={(base64) => handleInputChange('raasiImage', base64)}
            placeholder="Upload your Raasi chart image"
            required={false}
            maxSizeMB={5}
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Partner Expectations & Additional Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="partnerJob">Preferred Partner Job</Label>
          <Select value={formData.partnerJob} onValueChange={(value) => handleInputChange('partnerJob', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any</SelectItem>
              <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preferredAgeFrom">Preferred Age From</Label>
            <Input
              id="preferredAgeFrom"
              type="number"
              value={formData.preferredAgeFrom}
              onChange={(e) => handleInputChange('preferredAgeFrom', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preferredAgeTo">Preferred Age To</Label>
            <Input
              id="preferredAgeTo"
              type="number"
              value={formData.preferredAgeTo}
              onChange={(e) => handleInputChange('preferredAgeTo', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="jobPreference">Job Preference</Label>
          <Select value={formData.jobPreference} onValueChange={(value) => handleInputChange('jobPreference', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Optional">Optional</SelectItem>
              <SelectItem value="Required">Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="partnerDiet">Preferred Partner Diet</Label>
          <Select value={formData.partnerDiet} onValueChange={(value) => handleInputChange('partnerDiet', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="Any">Any</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="partnerCaste">Preferred Caste</Label>
          <Select value={formData.partnerCaste} onValueChange={(value) => handlePartnerCasteChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(casteData).map((caste) => (
                <SelectItem key={caste} value={caste}>
                  {caste}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="partnerSubCaste">Preferred Sub Caste</Label>
          <Select value={formData.partnerSubCaste} onValueChange={(value) => handleInputChange('partnerSubCaste', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {availablePartnerSubCastes.map((subCaste) => (
                <SelectItem key={subCaste} value={subCaste}>
                  {subCaste}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="partnerComments">Partner Preferences Comments</Label>
          <Textarea
            id="partnerComments"
            value={formData.partnerComments}
            onChange={(e) => handleInputChange('partnerComments', e.target.value)}
            placeholder="Any specific preferences or requirements..."
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="otherDetails">Additional Details</Label>
          <Textarea
            id="otherDetails"
            value={formData.otherDetails}
            onChange={(e) => handleInputChange('otherDetails', e.target.value)}
            placeholder="Any additional information about yourself, achievements, hobbies, etc..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create Your Account & Complete Profile</h3>
      
      {/* Account Creation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-6">
        <Label htmlFor="description">Tell Us About Yourself</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Write a brief description about yourself, your interests, hobbies, what you're looking for in a partner, or anything else you'd like others to know about you..."
          rows={4}
          className="resize-none mt-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          This description will be visible on your profile and help others get to know you better. You can always edit this later.
        </p>
      </div>
      
      {/* Completion Notice */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Ready to Create Your Profile!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>You're all set! Click the submit button below to create your account and start finding your perfect match.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Matrimony Registration Form</CardTitle>
            <CardDescription>
              Complete your profile to find your perfect match. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
      
      {/* Loading Popup */}
      <Dialog open={showLoadingPopup} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Creating Your Account...
            </DialogTitle>
            <DialogDescription className="text-center">
              Please wait while we set up your profile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">
                Setting up your account and generating your Envaran ID...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              🎉 Account Created Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Welcome to Envaran Matrimony
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your account has been created and your profile is now visible to everyone.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-800 mb-2">Your Envaran ID:</p>
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {generatedEnvaranId}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Save this ID - you'll need it for your profile
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✅ Profile created and active<br/>
                  ✅ Ready to find matches<br/>
                  ✅ All features unlocked
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => {
                  setShowSuccessPopup(false);
                  window.location.href = '/';
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Go to Home
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessPopup(false);
                  window.location.href = '/profile';
                }}
                variant="outline"
                className="px-6"
              >
                View Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
