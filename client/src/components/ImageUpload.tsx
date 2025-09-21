import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string; // Base64 string
  onChange: (base64: string) => void;
  placeholder?: string;
  required?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = "Click to upload image",
  required = false,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
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

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const compressImageToTargetSize = async (file: File, targetSizeMB: number = 0.9): Promise<string> => {
    // console.log('🔧 ImageUpload: Starting compression to target size:', targetSizeMB + 'MB');
    let quality = 0.8;
    let maxWidth = 800;
    let compressedBase64 = '';
    
    // Try different compression levels until we get under target size
    for (let attempt = 0; attempt < 5; attempt++) {
      // console.log(`🔄 ImageUpload: Compression attempt ${attempt + 1}/5 - Quality: ${quality}, Max Width: ${maxWidth}px`);
      
      compressedBase64 = await compressImage(file, maxWidth, quality);
      
      // Calculate actual size in MB
      const sizeInBytes = (compressedBase64.length * 3) / 4; // Approximate base64 to bytes
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      // console.log(`📏 ImageUpload: Attempt ${attempt + 1} result: ${sizeInMB.toFixed(2)}MB (target: ${targetSizeMB}MB)`);
      
      if (sizeInMB <= targetSizeMB) {
        // console.log(`✅ ImageUpload: Successfully compressed to ${sizeInMB.toFixed(2)}MB in ${attempt + 1} attempts`);
        break;
      }
      
      // Reduce quality and size for next attempt
      const oldQuality = quality;
      const oldWidth = maxWidth;
      quality = Math.max(0.1, quality - 0.15);
      maxWidth = Math.max(300, maxWidth - 100);
      
      // console.log(`⚙️ ImageUpload: Adjusting settings for next attempt: Quality ${oldQuality} → ${quality}, Width ${oldWidth}px → ${maxWidth}px`);
    }
    
    const finalSizeInBytes = (compressedBase64.length * 3) / 4;
    const finalSizeInMB = finalSizeInBytes / (1024 * 1024);
    // console.log('🏁 ImageUpload: Final compression result:', {
    //   finalSize: finalSizeInMB.toFixed(2) + 'MB',
    //   targetSize: targetSizeMB + 'MB',
    //   base64Length: compressedBase64.length,
    //   success: finalSizeInMB <= targetSizeMB
    // });
    
    return compressedBase64;
  };

  const handleFileSelect = async (file: File) => {
    // console.log('🖼️ ImageUpload: File selected for upload');
    // console.log('📁 File details:', {
    //   name: file.name,
    //   type: file.type,
    //   size: file.size,
    //   sizeMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
    // });

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      // console.log('❌ ImageUpload: Invalid file type:', file.type);
      // console.log('✅ Accepted formats:', acceptedFormats);
      alert(`Please select a valid image file. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }
    // console.log('✅ ImageUpload: File type validation passed');

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      // console.log('❌ ImageUpload: File too large:', fileSizeMB.toFixed(2) + 'MB', 'Max allowed:', maxSizeMB + 'MB');
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    // console.log('✅ ImageUpload: File size validation passed');

    // console.log('🔄 ImageUpload: Starting compression process...');
    setIsCompressing(true);
    
    try {
      // Use the new compression method that targets a specific size
      // console.log('🎯 ImageUpload: Compressing to target size of 0.9MB...');
      const compressedBase64 = await compressImageToTargetSize(file, 0.9); // Target 0.9MB
      
      // Final size check
      const sizeInBytes = (compressedBase64.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      // console.log('📊 ImageUpload: Compression results:', {
      //   originalSize: fileSizeMB.toFixed(2) + 'MB',
      //   compressedSize: sizeInMB.toFixed(2) + 'MB',
      //   compressionRatio: ((1 - sizeInMB / fileSizeMB) * 100).toFixed(1) + '%',
      //   base64Length: compressedBase64.length
      // });
      
      if (sizeInMB > 1.0) {
        // console.log('❌ ImageUpload: Compressed image still too large:', sizeInMB.toFixed(2) + 'MB');
        alert(`Unable to compress image below 1MB. Current size: ${sizeInMB.toFixed(2)}MB. Please try a smaller image.`);
        setIsCompressing(false);
        return;
      }
      
      // console.log('✅ ImageUpload: Compression successful!');
      // console.log('📤 ImageUpload: Calling onChange with base64 data...');
      // console.log('🔍 ImageUpload: Base64 preview (first 100 chars):', compressedBase64.substring(0, 100) + '...');
      
      onChange(compressedBase64);
      
      // console.log('🎉 ImageUpload: Upload process completed successfully!');
    } catch (error) {
      // console.error('💥 ImageUpload: Error during compression:', error);
      // console.error('📋 ImageUpload: Error details:', {
      //   message: error.message,
      //   stack: error.stack
      // });
      alert('Error compressing image. Please try again with a different image.');
    } finally {
      // console.log('🏁 ImageUpload: Cleaning up compression state...');
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // console.log('🎯 ImageUpload: File dropped on upload area');
    const file = e.dataTransfer.files[0];
    if (file) {
      // console.log('📁 ImageUpload: Dropped file detected:', file.name);
      handleFileSelect(file);
    } else {
      // console.log('❌ ImageUpload: No file found in drop event');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
    // console.log('🎯 ImageUpload: File being dragged over upload area');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    // console.log('🎯 ImageUpload: File dragged away from upload area');
  };

  const handleRemoveImage = () => {
    // console.log('🗑️ ImageUpload: Removing uploaded image');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // console.log('✅ ImageUpload: Image removed successfully');
  };

  const handleClick = () => {
    // console.log('🖱️ ImageUpload: Upload area clicked, opening file browser');
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : value 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {isCompressing ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-600 font-medium">
              Compressing image...
            </p>
            <p className="text-xs text-gray-500">
              Optimizing image to fit under 1MB limit
            </p>
          </div>
        ) : value ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={value}
                alt="Uploaded"
                className="max-h-32 max-w-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-green-600 font-medium">
              ✓ Image uploaded and compressed successfully
            </p>
            <p className="text-xs text-gray-500">
              Size: {value ? ((value.length * 3) / 4 / (1024 * 1024)).toFixed(2) : '0'}MB
            </p>
            <p className="text-xs text-gray-500">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxSizeMB}MB • {acceptedFormats.join(', ')} • Auto-compressed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

