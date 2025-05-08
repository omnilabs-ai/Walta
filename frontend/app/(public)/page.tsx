"use client"
import React from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/landing/Hero";
import Navigation from "@/components/landing/Navigation";
import AudienceSection from "@/components/landing/AudienceSection";
import ProblemStatement from "@/components/landing/ProblemStatement";
import SolutionsSection from "@/components/landing/SolutionsSection";
import TechnicalSection from "@/components/landing/TechnicalSection";
import DeveloperSection from "@/components/landing/DeveloperSection";
import VendorSection from "@/components/landing/VendorSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  const router = useRouter();
  
  // Get the current scroll position for components that need it
  const [scrollY, setScrollY] = React.useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Override the router context with event handlers
  React.useEffect(() => {
    // Find and override all navigation buttons
    const handleButtonClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (!button) return;
      
      const buttonText = button.textContent || '';
      
      if (buttonText.includes('Get API Access') || 
          buttonText.includes('Get Started') ||
          buttonText.includes('Start Building') ||
          buttonText.includes('Become a Vendor Partner')) {
        e.preventDefault();
        router.push('/signup');
      } else if (buttonText.includes('Log In')) {
        e.preventDefault();
        router.push('/login');
      }
    };
    
    document.addEventListener('click', handleButtonClicks);
    
    return () => {
      document.removeEventListener('click', handleButtonClicks);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* All components without passing navigate props */}
      <Navigation />
      <Hero />
      <AudienceSection />
      <ProblemStatement />
      <SolutionsSection />
      <TechnicalSection scrollY={scrollY} />
      <DeveloperSection scrollY={scrollY} />
      <VendorSection scrollY={scrollY} />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;