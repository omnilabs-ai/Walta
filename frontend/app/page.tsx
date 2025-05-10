"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/landing");
  }, [router]);
  
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
} 