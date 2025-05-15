"use client";
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ProtectedLayout = ({children}: {children:React.ReactNode}) => {
  const { user, isLoading} = useAuth();
  const router = useRouter();
  useEffect(()=>{
    if(!isLoading && !user){
      router.push("/sign-in"); // redirecting to sign-in page
    }
  }, [user, isLoading, router]);
      
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <>
    {children}
    </>
  )
}

export default ProtectedLayout