"use client";

import { Button } from "@/components/ui/button";
import useNextRouterAdapter from "./useNextRouterAdapter";

const CTASection = () => {
  const navigate = useNextRouterAdapter();
  
  return (
    <div className="py-20 bg-gradient-to-br from-blue-900 to-blue-950 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Stop building workarounds. Start building the future.</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join hundreds of companies enabling their AI agents with secure financial capabilities
        </p>
        <div className="flex justify-center">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-7 h-auto text-lg"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;