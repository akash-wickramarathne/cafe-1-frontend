import Lottie from "lottie-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa"; // Import a close icon from react-icons
import animationData from "../../public/upload-image-product.json";
interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUpload }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // Filter out non-image files
      const validFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (validFiles.length + files.length > 5) {
        setError("You can only upload up to 5 images.");
        return;
      }

      // Handle non-image files
      if (fileRejections.length > 0) {
        setError("Some files are not images. Only image files are allowed.");
        return;
      }

      // Generate previews for valid files
      const newFiles = validFiles.slice(0, 5 - files.length);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setError(null);
      onFilesUpload([...files, ...newFiles]);
    },
    [files, onFilesUpload]
  );

  const removeImage = (index: number) => {
    // Remove image from the previews and files
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    // Remove the associated object URL from memory
    URL.revokeObjectURL(previews[index]);

    // Update the parent component with the new list of files
    onFilesUpload(files.filter((_, i) => i !== index));
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
      {/* Image Previews Section */}
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
                  // layout="fill" // Makes the image fill its container
                  // Ensures the image covers the container without distortion
                  className="rounded-md object-scale-down " // Remove `w-full h-full` because `layout="fill"` handles sizing
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

      {/* Drag and Drop Area */}
      <div
        {...getRootProps()}
        className="flex items-center justify-center  p-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop images here, or click to select
        </p>
      </div>
      {error && <p className="text-red-500 text-center p-4">{error}</p>}
    </div>
  );
  // );border-2 border-gray-300 border-dashed
};

export default FileUpload;
