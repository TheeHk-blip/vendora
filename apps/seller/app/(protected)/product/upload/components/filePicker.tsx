"use client";

import { CloudUpload, Delete } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import { Button, useToast } from "@vendora/ui";
import { ValidateImage } from "@vendora/ui/src/components/fileValidation";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useRef, useState } from "react";

interface FileUploadProps {
  onFilesChange: (file: File[]) => void;
  value: File[];
  progress: Record<string, number>
}

export default React.memo(function FileUpload({onFilesChange, progress, value: files}: FileUploadProps) {  
  const {showToast} = useToast(); 
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILES = 6;
  const MIN_FILES = 3;

  useEffect(() => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // cleanup old URLs to prevent memory leaks
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleDelete = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles); // Tell parent a file was removed
  }, [files, onFilesChange]);

  const processFiles = useCallback(async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const fileArray = Array.from(incomingFiles);    
    const uniqueFiles = fileArray.filter(newFile => {
      const isDuplicate = files.some(existing =>
        existing.name === newFile.name &&
        existing.size === newFile.size &&
        existing.lastModified === newFile.lastModified
      );

      if (isDuplicate) {
        showToast(`${newFile.name} is already selected.`, "error");
        return false;
      }
      return true;
    });

    if (files.length + uniqueFiles.length > MAX_FILES) {
      showToast(`You can only select a maximum of ${MAX_FILES} files in total.`, "error");      
      return;
    };

    if (uniqueFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const validFiles: File[] = [];
    for (const file of uniqueFiles) {
      const validation = await ValidateImage(file, {maxSizeMB: 2, maxWidth: 2000}, showToast);
      if (validation.isValid) validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]); // Tell parent new files addded
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [files, onFilesChange, showToast]);  

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="flex flex-col justify-center w-full" >         
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" >    
        {files.map((file, index) => {       
          const previewSrc = previews[index] || "";
          return (           
            <div 
              key={`${file.name}-${index}`}    
              className="relative w-26 h-26 rounded-md gap-2.5 bg-black/15 dark:bg-white/20"       
            >
              {previewSrc && (
                <Image 
                  fill={true}
                  alt="File preview"
                  src={previewSrc}                
                  objectFit="contain"  
                  unoptimized
                  className="rounded-md"                                             
                />
              )}              

              <Button
                onClick={() => handleDelete(index)}
                className="absolute top-0 right-0 z-10 text-red-500"
              >
                <Delete sx={{fontSize: 18}} />  
              </Button>  

              {progress[file.name] !== undefined && progress[file.name] < 100 && (
                <div className="absolute bottom-0 w-full px-1 pb-1">
                  <LinearProgress 
                    variant="determinate"
                    value={progress[file.name]}
                    className="h-1.5 w-full"
                  />
                </div>
              )}                   
            </div>   
          )       
        })}    
      </div> 

      <div 
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          processFiles(e.dataTransfer.files);
        }}           
        className="flex flex-col items-center cursor-pointer shadow-sm shadow-black/25 dark:shadow-neutral-400/25 p-2 my-2.5 rounded-lg " 
      >        
        <CloudUpload />        
        <span
          className={`${files.length < MIN_FILES ? "text-red-500" : "text-gray-600 dark:text-gray-300"}`}
        >
          Drop files or click to select {files.length < MIN_FILES
          ? `Min. ${MIN_FILES} files required (${files.length}/${MIN_FILES})`
          :  `(${files.length} / ${MAX_FILES})`
          }
        </span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        multiple
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => processFiles(e.target.files)}
        className="hidden"
      />           
    </div>
  )
})