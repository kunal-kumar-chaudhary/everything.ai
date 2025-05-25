"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if the auth check is complete (isLoading is false) and user is null
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  return <>{children}</>;
};

export default ProtectedLayout;
