// web scraping page
"use client";

import { useAuth } from '@/app/contexts/AuthContext'
import FileUploader from '@/components/FileUploader'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {

  const router = useRouter();
  const {user, isLoading} = useAuth();

  useEffect(()=>{
    console.log("check hereafter for authentication..")
    if(!isLoading && !user){
      router.push("/sign-in");
    }
    console.log(isLoading)
    console.log(user)
    console.log("check completede for autnetication")
  }, [user, isLoading, router]);

  return (
    <>
    <FileUploader/>
    </>
  )
}

export default Page;