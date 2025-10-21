// Browser Console Script to Migrate Profile Data to Registrations
// Copy and paste this entire script into your browser console

(async function migrateProfilesToRegistrations() {
  console.log('🚀 Starting profile to registration migration...');
  
  // Check if Firebase is ready
  if (!window.checkFirebaseReady()) {
    console.error('❌ Firebase is not ready. Please wait for the app to load completely.');
    return;
  }
  
  try {
    // Get all profiles
    const profilesRef = window.collection(window.db, 'profiles');
    const profilesSnapshot = await window.getDocs(profilesRef);
    
    if (profilesSnapshot.empty) {
      console.log('✅ No profiles found to migrate.');
      return;
    }
    
    console.log(`📄 Found ${profilesSnapshot.size} profiles to migrate...`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const profileDoc of profilesSnapshot.docs) {
      const profileData = profileDoc.data();
      const userId = profileData.userId || profileDoc.id;
      
      try {
        // Check if registration already exists for this user
        const registrationsRef = window.collection(window.db, 'registrations');
        const registrationQuery = window.query(registrationsRef, window.where('userId', '==', userId));
        const registrationSnapshot = await window.getDocs(registrationQuery);
        
        if (!registrationSnapshot.empty) {
          console.log(`⏭️ Skipping user ${userId}: registration already exists`);
          skippedCount++;
          continue;
        }
        
        // Generate Envaran ID
        const allRegistrationsQuery = window.query(registrationsRef);
        const allRegistrationsSnapshot = await window.getDocs(allRegistrationsQuery);
        const nextNumber = allRegistrationsSnapshot.size + 1;
        const envaranId = `envaran${String(nextNumber).padStart(3, '0')}`;
        
        // Create registration data from profile
        const registrationData = {
          userId: userId,
          status: 'completed',
          submittedAt: profileData.createdAt || new Date(),
          envaranId: envaranId,
          
          // Personal Details
          name: profileData.name || 'User',
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
        
        console.log(`📝 Creating registration for user ${userId} with Envaran ID: ${envaranId}`);
        
        // Create registration document
        await window.addDoc(registrationsRef, registrationData);
        
        console.log(`✅ Migrated profile for user ${userId}`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Error migrating profile for user ${userId}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n--- Migration Summary ---');
    console.log(`Total profiles found: ${profilesSnapshot.size}`);
    console.log(`Successfully migrated: ${migratedCount}`);
    console.log(`Skipped (already had registration): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('-------------------------');
    
    if (migratedCount > 0) {
      console.log('🎉 Migration completed! All profile data has been moved to the registrations collection.');
      console.log('🔄 You may want to refresh the page to see the updated data.');
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
})();











