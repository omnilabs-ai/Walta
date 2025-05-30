"use client";

import React from "react";
import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import AgentWalletAnimation from "@/components/landing/AgentWalletAnimation";
import ProblemStatement from "@/components/landing/ProblemStatement";
import SolutionsSection from "@/components/landing/SolutionsSection";
import ComingSoonFeatures from "@/components/landing/ComingSoonFeatures";
import AudienceSection from "@/components/landing/AudienceSection";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <Hero />
      <AgentWalletAnimation />
      <ProblemStatement />
      <SolutionsSection />
      <ComingSoonFeatures />
      <AudienceSection />
      <CTASection />
      <Footer />
    </div>
  );
} 