import Lottie from "lottie-react";
import Image from "next/image";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa"; // Import a close icon from react-icons
import animationData from "../../public/upload-image-product.json";

interface FileUploadProps {
  onFilesUpload: (files: string[]) => void; // Accept only strings for URLs
  defaultImages?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  defaultImages = [],
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]); // Track final URLs
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:8000/storage";

  useEffect(() => {
    // Combine default images and uploaded image URLs for preview
    const combinedImages = [...defaultImages, ...uploadedImageUrls];
    setPreviews(combinedImages.map((url) => `${baseUrl}/${url}`));
  }, [defaultImages, uploadedImageUrls]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      const validFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      // Check if the total number of files exceeds the limit
      if (validFiles.length + files.length + uploadedImageUrls.length > 5) {
        setError("You can only upload up to 5 images.");
        return;
      }

      // Handle rejected files
      if (fileRejections.length > 0) {
        setError("Some files are not images. Only image files are allowed.");
        return;
      }

      // Create previews for valid files
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setFiles((prev) => [...prev, ...validFiles]);
      setError(null);
    },
    [files, uploadedImageUrls]
  );

  const removeImage = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = files.filter((_, i) => i !== index);

    setPreviews(updatedPreviews);
    setFiles(updatedFiles);

    // Call onFilesUpload with updated uploadedImageUrls
    onFilesUpload([...uploadedImageUrls, ...updatedPreviews]);
  };

  const handleUploadComplete = (uploadedUrls: string[]) => {
    // This function should be called after the images are successfully uploaded
    setUploadedImageUrls((prev) => [...prev, ...uploadedUrls]);
    onFilesUpload([...uploadedImageUrls, ...uploadedUrls]); // Update parent with the latest URLs
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 5,
    maxSize: 15 * 1024 * 1024, // 15 MB
    multiple: true,
  });

  return (
    <div className="flex flex-col h-full min-h-[50vh] rounded-xl bg-white">
      <div className="flex-1 p-4 overflow-y-auto border-purple-600 border-2 border-dashed rounded-lg">
        {previews.length === 0 && !error ? (
          <div className="flex justify-center items-center h-full">
            <Lottie
              animationData={animationData}
              className="w-[200px]"
              loop={true}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-full h-20">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  layout="fill"
                  className="rounded-md object-scale-down"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className="flex items-center justify-center p-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop images here, or click to select
        </p>
      </div>
      {error && <p className="text-red-500 text-center p-4">{error}</p>}
    </div>
  );
};

export default FileUpload;
