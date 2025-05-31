"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <div id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
            <span className="inline-block">AI Agents Have Brains.</span>
            <span className="inline-block text-blue-900 mt-2">Now They Need Wallets.</span>
          </h1>
          <p className="mt-6 text-2xl text-slate-800 max-w-2xl mx-auto font-medium">
            One API key. Secure autonomous payments. No more engineering workarounds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-[#192E5B] text-white hover:bg-[#192E5B]/90 px-8 py-6 h-auto text-lg font-bold flex items-center justify-center w-64"
            >
              <Link href="#register" scroll={false}>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center cursor-pointer"
                >
                  Get API Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>

            </Button>
            <Button
              className="bg-[#192E5B] text-white hover:bg-[#192E5B]/90 px-8 py-6 h-auto text-lg font-bold flex items-center justify-center w-64"
              onClick={() => window.location.href = "https://calendly.com/walta_team"}
            >
              Request Demo
            </Button>
          </div>
          <div className="mt-8 text-center">
            <div className="text-lg text-green-600 font-medium flex justify-center items-center">
              <CheckCircle size={18} className="mr-1" />
              <span>5-minute integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background gradient */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[30vw] h-[30vh] bg-green-400 rounded-full filter blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-[20%] w-[20vw] h-[20vh] bg-blue-500 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[30%] w-[15vw] h-[15vh] bg-orange-400 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default Hero;