import { useState, useEffect } from "react";
import AgentAuthentication from "./steps/AgentAuthentication";
import WalletCreation from "./steps/WalletCreation";
import SecurePayment from "./steps/SecurePayment";
import SecurityAudit from "./steps/SecurityAudit";
import ConnectionLines from "./ConnectionLines";
import BottomWave from "./BottomWave";
import AnimationStyles from "./AnimationStyles";
import DashboardShowcase from "./DashboardShowcase";
import TechnicalSection from "./TechnicalSection";

const AgentWalletAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="py-20 bg-slate-900 relative">
        <AnimationStyles />
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              How AI Agents Use Walta: Step by Step
            </h2>
            
            {/* Flow chart container with increased height for the larger boxes */}
            <div className="relative h-[800px] mb-24">
              {/* Connection lines between boxes */}
              <ConnectionLines scrollY={scrollY} />
              
              {/* Flow chart boxes positioned with absolute positioning */}
              <AgentAuthentication scrollY={scrollY} />
              <WalletCreation scrollY={scrollY} />
              <SecurePayment scrollY={scrollY} />
              <SecurityAudit scrollY={scrollY} />
            </div>
            
            {/* The original TechnicalSection was here, now DashboardShowcase comes first */}
          </div>
        </div>
        <BottomWave />
      </div>
      <DashboardShowcase />
      {/* <div className="bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TechnicalSection scrollY={scrollY} />
          </div>
        </div>
      </div> */}
      {/* TechnicalSection and its wrapping divs removed */}
    </>
  );
};

export default AgentWalletAnimation;