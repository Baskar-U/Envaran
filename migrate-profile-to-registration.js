// Browser Console Script to Migrate Profile Data to Registration
// Copy and paste this entire script into your browser console

(async function migrateProfileToRegistration() {
  console.log('🚀 Starting profile to registration migration...');
  
  // Check if Firebase is ready
  if (!window.checkFirebaseReady()) {
    console.error('❌ Firebase is not ready. Please wait for the app to load completely.');
    return;
  }
  
  try {
    // Get current user
    const currentUser = window.auth?.currentUser;
    if (!currentUser) {
      console.error('❌ No current user found. Please log in first.');
      return;
    }
    
    console.log('👤 Current user:', currentUser.uid, currentUser.email);
    
    // Check if registration already exists
    const registrationsRef = window.collection(window.db, 'registrations');
    const registrationQuery = window.query(registrationsRef, window.where('userId', '==', currentUser.uid));
    const registrationSnapshot = await window.getDocs(registrationQuery);
    
    if (!registrationSnapshot.empty) {
      console.log('✅ Registration already exists for this user');
      registrationSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log('Registration data:', {
          id: doc.id,
          name: data.name,
          status: data.status,
          envaranId: data.envaranId
        });
      });
      return;
    }
    
    // Get profile data
    const profileRef = window.doc(window.db, 'profiles', currentUser.uid);
    const profileDoc = await window.getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      console.error('❌ No profile found for this user');
      return;
    }
    
    const profileData = profileDoc.data();
    console.log('📄 Profile data found:', profileData);
    
    // Generate Envaran ID
    const allRegistrationsQuery = window.query(registrationsRef);
    const allRegistrationsSnapshot = await window.getDocs(allRegistrationsQuery);
    const nextNumber = allRegistrationsSnapshot.size + 1;
    const envaranId = `envaran${String(nextNumber).padStart(3, '0')}`;
    
    // Create registration data from profile
    const registrationData = {
      userId: currentUser.uid,
      status: 'completed',
      submittedAt: profileData.createdAt || new Date(),
      envaranId: envaranId,
      
      // Personal Details
      name: currentUser.displayName || currentUser.email || 'User',
      gender: profileData.gender || '',
      dateOfBirth: '', // Not available in profile
      motherTongue: profileData.motherTongue || '',
      maritalStatus: profileData.relationshipStatus || '',
      religion: profileData.religion || '',
      caste: profileData.caste || '',
      subCaste: profileData.subCaste || '',
      
      // Family Details (not available in profile)
      fatherName: '',
      fatherJob: '',
      fatherAlive: '',
      motherName: '',
      motherJob: '',
      motherAlive: '',
      orderOfBirth: '',
      
      // Physical Attributes (not available in profile)
      height: '',
      weight: '',
      bloodGroup: '',
      complexion: '',
      disability: '',
      diet: '',
      
      // Education & Occupation
      qualification: profileData.education || '',
      incomePerMonth: '',
      job: profileData.profession || '',
      placeOfJob: '',
      
      // Communication Details
      presentAddress: profileData.location || '',
      permanentAddress: '',
      contactNumber: '',
      contactPerson: '',
      
      // Astrology Details (not available in profile)
      ownHouse: '',
      star: '',
      laknam: '',
      timeOfBirth: {
        hour: '',
        minute: '',
        period: ''
      },
      raasi: '',
      gothram: '',
      placeOfBirth: '',
      padam: '',
      dossam: '',
      nativity: '',
      
      // Horoscope Details (not available in profile)
      horoscopeRequired: '',
      balance: '',
      dasa: '',
      dasaPeriod: {
        years: '',
        months: '',
        days: ''
      },
      
      // Partner Expectations (not available in profile)
      partnerExpectations: {
        job: '',
        preferredAgeFrom: 0,
        preferredAgeTo: 0,
        jobPreference: '',
        diet: '',
        maritalStatus: [],
        subCaste: '',
        comments: ''
      },
      
      // Additional Details
      otherDetails: profileData.bio || '',
      description: '', // Will be filled by user later
      
      // Images
      profileImage: '',
      profileImageUrl: profileData.profileImageUrl || '',
      
      // Metadata
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
      migrationDate: new Date()
    };
    
    console.log('📝 Creating registration with data:', registrationData);
    
    // Create registration document
    const newRegistrationRef = await window.addDoc(registrationsRef, registrationData);
    
    console.log('✅ Registration created successfully with ID:', newRegistrationRef.id);
    console.log('🎉 Migration completed! Your profile data has been migrated to the registration system.');
    console.log('🆔 Your Envaran ID is:', envaranId);
    
    // Refresh the page to show updated data
    console.log('🔄 Refreshing page to show updated data...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
})();






