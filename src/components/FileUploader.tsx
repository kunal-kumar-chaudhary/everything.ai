"use client";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { uploadImage } from '@/supabase/storage/client';
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const FileUploader = () => {
  const {user} = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) {
      return;
    }
    setStatus("uploading");
    setUploadProgress(0); // resetting in case the file is new upload

    try {

      const { fileUrl , error } = await uploadImage({
        file,
        bucket: 'everythingfiles', 
      });

      if (error) {
        setStatus("error");
        setUploadProgress(0);
      } else {
        setStatus("success");
        // saving the fileUrl to database corresponding to userid
        const response = await axios.post(`/api/files`, {fileUrl, userId: user?.id});
        if(response.data.success){
          toast("file details saved to database..")
        }
        setUploadProgress(100);
      }
    } catch (err) {
      setStatus("error");
      setUploadProgress(0); // incase of failure
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen space-y-4 space-x-10 text-white">
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div className="mb-4 text-sm text-white">
          <p>file name: {file.name}</p>
          <p>file size: {(file.size / 1024).toFixed(2)}</p>
          <p>file type: {file.type}</p>
        </div>
      )}

      {status === "uploading" && (
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <button onClick={handleFileUpload}>Upload</button>
      )}

      {status === "success" && (
        <p className="text-sm text-green-600">file upload successful!</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">upload failed, plese try again!</p>
      )}
    </div>
  );
};

export default FileUploader;
