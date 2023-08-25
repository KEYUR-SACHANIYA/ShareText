import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineClose } from "react-icons/ai";

interface DropzoneProps {
  onChange: (base64: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<DropzoneProps> = ({ onChange, label, value, disabled }) => {

  const handleDrop = useCallback((files: any) => {
    const file = files[0]
    const reader = new FileReader();
    reader.onload = (event: any) => {
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [onChange])

  const handleClose = useCallback((e: any) => {
    e.stopPropagation();
    onChange('')
  }, [onChange])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    }
  });

  return (
    <div {...getRootProps({ className: 'w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700' })}>
      <input {...getInputProps()} />
      {value ? (
        <div className="flex items-center justify-center">
          <Image
            src={value}
            height="100"
            width="100"
            alt="Uploaded image"
          />
          <button
            className="p-1 ml-auto border-0 text-white hover:opacity-70 transition"
            onClick={handleClose}
            disabled={disabled}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
      ) : (
        <p className="text-white">{label}</p>
      )}
    </div>
  );
}

export default ImageUpload;