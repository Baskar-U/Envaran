// Firebase Schema Update Script
// This script adds the new image fields to existing registration documents
// Run this in the browser console on your Firebase project

// Instructions:
// 1. Open your Firebase project in the browser
// 2. Go to Firestore Database
// 3. Open the browser console (F12)
// 4. Copy and paste this entire script
// 5. Press Enter to run

// Make sure to replace 'your-project-id' with your actual Firebase project ID
const PROJECT_ID = 'your-project-id'; // Replace with your actual project ID

// Initialize Firebase (you'll need to get these values from your Firebase config)
const firebaseConfig = {
  // Get these values from your Firebase project settings
  apiKey: "your-api-key",
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateRegistrationDocuments() {
  try {
    console.log('🔄 Starting to update registration documents...');
    
    // Get all documents from the registrations collection
    const registrationsRef = collection(db, 'registrations');
    const snapshot = await getDocs(registrationsRef);
    
    console.log(`📊 Found ${snapshot.size} registration documents to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each document
    for (const docSnapshot of snapshot.docs) {
      try {
        const docRef = doc(db, 'registrations', docSnapshot.id);
        const docData = docSnapshot.data();
        
        // Check if the document already has the new fields
        if (docData.raasiImage !== undefined && docData.profileImage !== undefined) {
          console.log(`⏭️  Document ${docSnapshot.id} already has image fields, skipping...`);
          continue;
        }
        
        // Prepare update data
        const updateData = {};
        
        // Add raasiImage field if it doesn't exist
        if (docData.raasiImage === undefined) {
          updateData.raasiImage = '';
        }
        
        // Add profileImage field if it doesn't exist
        if (docData.profileImage === undefined) {
          updateData.profileImage = '';
        }
        
        // Update the document
        await updateDoc(docRef, updateData);
        
        console.log(`✅ Updated document ${docSnapshot.id}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating document ${docSnapshot.id}:`, error);
        errorCount++;
      }
    }
    
    console.log('🎉 Update completed!');
    console.log(`✅ Successfully updated: ${updatedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    
    if (errorCount === 0) {
      console.log('🎊 All documents updated successfully!');
    } else {
      console.log('⚠️  Some documents had errors. Check the console for details.');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during update:', error);
  }
}

// Alternative method using Firebase Admin SDK (if you have access to server-side code)
function generateServerSideUpdateScript() {
  return `
// Server-side update script (Node.js with Firebase Admin SDK)
const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure you have the service account key)
const serviceAccount = require('./path-to-your-service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: '${PROJECT_ID}'
});

const db = admin.firestore();

async function updateAllRegistrations() {
  try {
    console.log('🔄 Starting batch update of registration documents...');
    
    const registrationsRef = db.collection('registrations');
    const snapshot = await registrationsRef.get();
    
    console.log(\`📊 Found \${snapshot.size} documents to update\`);
    
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore batch limit
    
    snapshot.docs.forEach((docSnapshot) => {
      const docRef = registrationsRef.doc(docSnapshot.id);
      const docData = docSnapshot.data();
      
      // Only update if fields don't exist
      if (docData.raasiImage === undefined || docData.profileImage === undefined) {
        const updateData = {};
        
        if (docData.raasiImage === undefined) {
          updateData.raasiImage = '';
        }
        
        if (docData.profileImage === undefined) {
          updateData.profileImage = '';
        }
        
        batch.update(docRef, updateData);
        batchCount++;
        
        // Commit batch when it reaches the limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(\`✅ Committed batch of \${batchCount} updates\`);
          batchCount = 0;
        }
      }
    });
    
    // Commit remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(\`✅ Committed final batch of \${batchCount} updates\`);
    }
    
    console.log('🎉 All registration documents updated successfully!');
    
  } catch (error) {
    console.error('💥 Error during batch update:', error);
  }
}

// Run the update
updateAllRegistrations();
  `;
}

// Instructions for running the script
console.log(`
🚀 Firebase Schema Update Script
================================

This script will add the following fields to all existing registration documents:
- raasiImage: string (Base64 encoded image)
- profileImage: string (Base64 encoded image)

📋 Before running:
1. Replace 'your-project-id' with your actual Firebase project ID
2. Replace the Firebase config values with your actual config
3. Make sure you have the necessary permissions

🔧 To run the client-side script:
1. Open your Firebase project in the browser
2. Go to Firestore Database
3. Open browser console (F12)
4. Paste this script and press Enter
5. Call: updateRegistrationDocuments()

🔧 To run the server-side script:
1. Save the generated server script to a .js file
2. Install Firebase Admin SDK: npm install firebase-admin
3. Add your service account key file
4. Run: node update-script.js

⚠️  Important Notes:
- This will add empty string values for the new fields
- Existing data will not be modified
- Make sure to backup your data before running
- Test on a small subset first if you have many documents

Ready to proceed? Call updateRegistrationDocuments() when ready.
`);

// Export the function for use
window.updateRegistrationDocuments = updateRegistrationDocuments;
window.generateServerSideUpdateScript = generateServerSideUpdateScript;

