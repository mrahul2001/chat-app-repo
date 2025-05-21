"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/chats");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );
};

export default HomePage;
