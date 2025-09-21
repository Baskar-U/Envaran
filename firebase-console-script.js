// Firebase Console Script - Run this in the Firebase Console
// This script works with the Firebase console's existing setup

console.log('🚀 Firebase Console Schema Update Script');
console.log('Project: matrimony-events');

// Method 1: Manual approach using Firebase Console UI
function showManualInstructions() {
  console.log(`
📋 MANUAL APPROACH (Recommended):
================================

1. In the Firebase Console, go to Firestore Database
2. Click on the "registrations" collection
3. For each document:
   - Click on the document to open it
   - Click "Add field"
   - Add field name: "raasiImage", type: "string", value: ""
   - Click "Add field" again
   - Add field name: "profileImage", type: "string", value: ""
   - Click "Save"

This is the safest method for small datasets.
`);

  console.log(`
🔧 AUTOMATED APPROACH (For larger datasets):
==========================================

If you have many documents, you can use the Firebase CLI or create a simple Node.js script.

1. Install Firebase CLI: npm install -g firebase-tools
2. Login: firebase login
3. Initialize: firebase init firestore
4. Use the Node.js script I'll provide below
`);

  console.log(`
📊 CHECK CURRENT STRUCTURE:
==========================

To see what fields currently exist in your documents:
1. Go to Firestore Database
2. Click on "registrations" collection
3. Click on any document
4. Look at the field names listed

You should see fields like: name, gender, email, etc.
We need to add: raasiImage, profileImage
`);
}

// Method 2: Try to use the Firebase console's global objects
function tryFirebaseConsoleMethod() {
  try {
    // Check if we're in the Firebase console
    if (typeof window !== 'undefined' && window.location.hostname.includes('console.firebase.google.com')) {
      console.log('✅ You are in the Firebase Console');
      console.log('📋 Please use the manual approach described above');
      return true;
    } else {
      console.log('❌ You are not in the Firebase Console');
      console.log('📋 Please go to: https://console.firebase.google.com');
      return false;
    }
  } catch (error) {
    console.log('❌ Error detecting Firebase Console:', error);
    return false;
  }
}

// Method 3: Create a simple Node.js script for you to run locally
function generateNodeScript() {
  const nodeScript = `
// Node.js Script to Update Firebase Documents
// Save this as update-firebase.js and run with: node update-firebase.js

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./path-to-your-service-account-key.json'); // Download from Firebase Console > Project Settings > Service Accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'matrimony-events'
});

const db = admin.firestore();

async function updateAllRegistrations() {
  try {
    console.log('🔄 Starting to update registration documents...');
    
    const registrationsRef = db.collection('registrations');
    const snapshot = await registrationsRef.get();
    
    console.log(\`📊 Found \${snapshot.size} documents to update\`);
    
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;
    let totalUpdated = 0;
    
    snapshot.docs.forEach((docSnapshot) => {
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
        
        batch.update(docSnapshot.ref, updateData);
        batchCount++;
        totalUpdated++;
        
        // Commit batch when it reaches the limit
        if (batchCount >= BATCH_SIZE) {
          batch.commit();
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
    
    console.log('🎉 Update completed!');
    console.log(\`✅ Total updated: \${totalUpdated} documents\`);
    
  } catch (error) {
    console.error('💥 Error during update:', error);
  }
}

// Run the update
updateAllRegistrations();
`;

  console.log(`
📄 NODE.JS SCRIPT GENERATED:
============================

Save this as 'update-firebase.js' and run it locally:

${nodeScript}

📋 To use this script:
1. Install Firebase Admin SDK: npm install firebase-admin
2. Download your service account key from Firebase Console
3. Save the script as update-firebase.js
4. Run: node update-firebase.js
`);
}

// Method 4: Check if we can access Firestore directly
async function tryDirectFirestoreAccess() {
  try {
    // Check if we're in a Firebase project page
    if (window.location.href.includes('console.firebase.google.com/project/matrimony-events')) {
      console.log('✅ You are in the correct Firebase project');
      
      // Try to find Firestore data in the page
      const firestoreElements = document.querySelectorAll('[data-testid*="firestore"]');
      if (firestoreElements.length > 0) {
        console.log('✅ Firestore interface detected');
        console.log('📋 You can now manually add the fields using the UI');
      } else {
        console.log('❌ Please navigate to Firestore Database first');
        console.log('📋 Go to: Firestore Database > registrations collection');
      }
    } else {
      console.log('❌ Please navigate to your Firebase project first');
      console.log('📋 Go to: https://console.firebase.google.com/project/matrimony-events');
    }
  } catch (error) {
    console.log('❌ Error checking Firebase project:', error);
  }
}

// Run all methods
console.log('🔍 Checking your current setup...');
tryFirebaseConsoleMethod();
tryDirectFirestoreAccess();

console.log('\\n📋 AVAILABLE OPTIONS:');
console.log('1. showManualInstructions() - See manual steps');
console.log('2. generateNodeScript() - Get Node.js script');
console.log('3. tryDirectFirestoreAccess() - Check current setup');

// Make functions available
window.showManualInstructions = showManualInstructions;
window.generateNodeScript = generateNodeScript;
window.tryDirectFirestoreAccess = tryDirectFirestoreAccess;

console.log('\\n✅ Script loaded! Run any of the functions above.');

