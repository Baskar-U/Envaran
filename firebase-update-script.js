// Firebase Database Update Script
// This script works with your existing Firebase setup in main.tsx
// Run this in the browser console after your app is loaded

console.log('🚀 Firebase Database Update Script');
console.log('Project: matrimony-events');

// Check if Firebase is available
function checkFirebaseAvailability() {
  if (typeof window !== 'undefined' && window.db) {
    console.log('✅ Firebase is available and ready to use');
    return true;
  } else {
    console.log('❌ Firebase is not available. Make sure your app is loaded first.');
    console.log('💡 Try refreshing the page and running this script again.');
    return false;
  }
}

// Function to check current document structure
async function checkDocumentStructure() {
  if (!checkFirebaseAvailability()) return;
  
  try {
    console.log('🔍 Checking document structure...');
    
    const registrationsRef = window.collection(window.db, 'registrations');
    const snapshot = await window.getDocs(registrationsRef);
    
    if (snapshot.empty) {
      console.log('❌ No documents found in registrations collection');
      return;
    }
    
    console.log(`📊 Found ${snapshot.size} documents in registrations collection`);
    
    // Check the first document's structure
    const firstDoc = snapshot.docs[0];
    const docData = firstDoc.data();
    const fields = Object.keys(docData);
    
    console.log('📋 Current document structure:');
    console.log('Fields:', fields);
    
    // Check for our new fields
    const hasRaasiImage = docData.raasiImage !== undefined;
    const hasProfileImage = docData.profileImage !== undefined;
    const hasProfileImageUrl = docData.profileImageUrl !== undefined;
    
    console.log(`\n🔍 Field Status:`);
    console.log(`raasiImage: ${hasRaasiImage ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`profileImage: ${hasProfileImage ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`profileImageUrl: ${hasProfileImageUrl ? '✅ EXISTS' : '❌ MISSING'}`);
    
    if (hasRaasiImage && hasProfileImage && hasProfileImageUrl) {
      console.log('\n🎉 All required fields already exist! No update needed.');
    } else {
      console.log('\n⚠️  Some fields are missing. Run updateAllDocuments() to add them.');
    }
    
  } catch (error) {
    console.error('💥 Error checking document structure:', error);
  }
}

// Function to update all registration documents
async function updateAllDocuments() {
  if (!checkFirebaseAvailability()) return;
  
  try {
    console.log('🔄 Starting to update all registration documents...');
    
    const registrationsRef = window.collection(window.db, 'registrations');
    const snapshot = await window.getDocs(registrationsRef);
    
    console.log(`📊 Found ${snapshot.size} documents to process`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each document
    for (const docSnapshot of snapshot.docs) {
      try {
        const docData = docSnapshot.data();
        const docId = docSnapshot.id;
        
        // Check if document already has the new fields
        const hasRaasiImage = docData.raasiImage !== undefined;
        const hasProfileImage = docData.profileImage !== undefined;
        const hasProfileImageUrl = docData.profileImageUrl !== undefined;
        
        if (hasRaasiImage && hasProfileImage && hasProfileImageUrl) {
          console.log(`⏭️  Document ${docId} already has image fields, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Prepare update data
        const updateData = {};
        
        if (!hasRaasiImage) {
          updateData.raasiImage = '';
        }
        
        if (!hasProfileImage) {
          updateData.profileImage = '';
        }
        
        if (!hasProfileImageUrl) {
          updateData.profileImageUrl = '';
        }
        
        // Update the document
        const docRef = window.doc(window.db, 'registrations', docId);
        await window.updateDoc(docRef, updateData);
        
        console.log(`✅ Updated document ${docId}`);
        updatedCount++;
        
        // Add a small delay to avoid overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error updating document ${docSnapshot.id}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Update completed!');
    console.log(`✅ Successfully updated: ${updatedCount} documents`);
    console.log(`⏭️  Skipped (already updated): ${skippedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    
    if (errorCount === 0) {
      console.log('\n🎊 All documents updated successfully!');
    } else {
      console.log('\n⚠️  Some documents had errors. Check the console for details.');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during update:', error);
  }
}

// Function to update documents in batches (for large datasets)
async function updateDocumentsInBatches() {
  if (!checkFirebaseAvailability()) return;
  
  try {
    console.log('🔄 Starting batch update of registration documents...');
    
    const registrationsRef = window.collection(window.db, 'registrations');
    const snapshot = await window.getDocs(registrationsRef);
    
    console.log(`📊 Found ${snapshot.size} documents to process`);
    
    const BATCH_SIZE = 10; // Process 10 documents at a time
    const totalDocs = snapshot.docs.length;
    let processedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process documents in batches
    for (let i = 0; i < totalDocs; i += BATCH_SIZE) {
      const batch = snapshot.docs.slice(i, i + BATCH_SIZE);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(totalDocs / BATCH_SIZE)}`);
      
      // Process each document in the current batch
      for (const docSnapshot of batch) {
        try {
          const docData = docSnapshot.data();
          const docId = docSnapshot.id;
          
          // Check if document already has the new fields
          const hasRaasiImage = docData.raasiImage !== undefined;
          const hasProfileImage = docData.profileImage !== undefined;
          const hasProfileImageUrl = docData.profileImageUrl !== undefined;
          
          if (hasRaasiImage && hasProfileImage && hasProfileImageUrl) {
            skippedCount++;
            continue;
          }
          
          // Prepare update data
          const updateData = {};
          
          if (!hasRaasiImage) {
            updateData.raasiImage = '';
          }
          
          if (!hasProfileImage) {
            updateData.profileImage = '';
          }
          
          if (!hasProfileImageUrl) {
            updateData.profileImageUrl = '';
          }
          
          // Update the document
          const docRef = window.doc(window.db, 'registrations', docId);
          await window.updateDoc(docRef, updateData);
          
          updatedCount++;
          
        } catch (error) {
          console.error(`❌ Error updating document ${docSnapshot.id}:`, error);
          errorCount++;
        }
      }
      
      processedCount += batch.length;
      console.log(`✅ Processed ${processedCount}/${totalDocs} documents`);
      
      // Add delay between batches
      if (i + BATCH_SIZE < totalDocs) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n🎉 Batch update completed!');
    console.log(`✅ Successfully updated: ${updatedCount} documents`);
    console.log(`⏭️  Skipped (already updated): ${skippedCount} documents`);
    console.log(`❌ Errors: ${errorCount} documents`);
    
  } catch (error) {
    console.error('💥 Fatal error during batch update:', error);
  }
}

// Function to add fields to a specific document (for testing)
async function updateSpecificDocument(documentId) {
  if (!checkFirebaseAvailability()) return;
  
  try {
    console.log(`🔄 Updating specific document: ${documentId}`);
    
    const docRef = window.doc(window.db, 'registrations', documentId);
    const docSnap = await window.getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('❌ Document not found');
      return;
    }
    
    const docData = docSnap.data();
    
    // Check current fields
    const hasRaasiImage = docData.raasiImage !== undefined;
    const hasProfileImage = docData.profileImage !== undefined;
    const hasProfileImageUrl = docData.profileImageUrl !== undefined;
    
    console.log(`Current fields - raasiImage: ${hasRaasiImage}, profileImage: ${hasProfileImage}, profileImageUrl: ${hasProfileImageUrl}`);
    
    if (hasRaasiImage && hasProfileImage && hasProfileImageUrl) {
      console.log('✅ Document already has all required fields');
      return;
    }
    
    // Prepare update data
    const updateData = {};
    
    if (!hasRaasiImage) {
      updateData.raasiImage = '';
    }
    
    if (!hasProfileImage) {
      updateData.profileImage = '';
    }
    
    if (!hasProfileImageUrl) {
      updateData.profileImageUrl = '';
    }
    
    // Update the document
    await window.updateDoc(docRef, updateData);
    
    console.log('✅ Document updated successfully!');
    
  } catch (error) {
    console.error('💥 Error updating specific document:', error);
  }
}

// Function to show available commands
function showHelp() {
  console.log(`
🚀 Firebase Database Update Script - Available Commands:
=======================================================

📋 CHECKING:
- checkDocumentStructure() - Check current document structure
- checkFirebaseAvailability() - Verify Firebase is loaded

🔄 UPDATING:
- updateAllDocuments() - Update all documents at once
- updateDocumentsInBatches() - Update documents in batches (safer for large datasets)
- updateSpecificDocument('document-id') - Update a specific document

📊 EXAMPLES:
- checkDocumentStructure()
- updateAllDocuments()
- updateSpecificDocument('abc123def456')

⚠️  IMPORTANT:
- Make sure your app is loaded before running these commands
- The script will add empty string values for missing fields
- Existing data will not be modified
- Use updateDocumentsInBatches() for large datasets

Ready to proceed!
`);
}

// Auto-check Firebase availability when script loads
checkFirebaseAvailability();

// Make all functions available globally
window.checkDocumentStructure = checkDocumentStructure;
window.updateAllDocuments = updateAllDocuments;
window.updateDocumentsInBatches = updateDocumentsInBatches;
window.updateSpecificDocument = updateSpecificDocument;
window.checkFirebaseAvailability = checkFirebaseAvailability;
window.showHelp = showHelp;

console.log('✅ Script loaded! Available commands:');
console.log('- checkDocumentStructure()');
console.log('- updateAllDocuments()');
console.log('- updateDocumentsInBatches()');
console.log('- showHelp()');
console.log('\n💡 Run showHelp() for detailed instructions');
