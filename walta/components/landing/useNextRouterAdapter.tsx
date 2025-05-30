"use client";

import { useRouter } from "next/navigation";

// This custom hook adapts the React Router's useNavigate to work with Next.js router
export const useNextRouterAdapter = () => {
  const router = useRouter();
  
  // Create a navigate function that mimics React Router's navigate
  const navigate = (path: string) => {
    // Map React Router paths to Next.js paths if needed
    if (path === "/dev") {
      router.push("/signup");
    } else if (path === "/") {
      router.push("/");
    } else if (path === "/login") {
      router.push("/login");
    } else if (path === "/signup") {
      router.push("/signup");
    } else {
      router.push(path);
    }
  };
  
  return navigate;
};

export default useNextRouterAdapter; 