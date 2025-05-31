
import { useState, useEffect } from "react";
import DeveloperSection from "./DeveloperSection";
import VendorSection from "./VendorSection";
import AnimationStyles from "./AnimationStyles";

const AudienceSection = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="register" className="py-24 bg-white">
      <AnimationStyles />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            The Walta Advantage
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how Walta transforms AI agent capabilities for both developers and vendors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          <DeveloperSection scrollY={scrollY} />
          <VendorSection scrollY={scrollY} />
        </div>
      </div>
    </div>
  );
};

export default AudienceSection;