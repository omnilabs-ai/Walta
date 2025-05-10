"use client";

import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const SolutionsSection = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="solutions" className="py-24 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 -mt-[88px]">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">The Walta Solution</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Financial infrastructure with built-in safety designed specifically for AI agents
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div 
            className={`p-6 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-700 ease-in-out transform ${
              scrollY > 1200 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              <div className="text-xl font-bold text-slate-800 mb-6">Programmable Financial Controls</div>
              
              <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                <h4 className="font-medium">Agent Authentication</h4>
                <p className="text-sm text-slate-600 mt-1">Cryptographically verify agent identity</p>
              </div>
              
              <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                <h4 className="font-medium text-green-800">Spending Controls</h4>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction Limit</span>
                    <span className="font-mono text-sm">$100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Limit</span>
                    <span className="font-mono text-sm">$500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Merchant Whitelist</span>
                    <span className="font-mono text-sm">api.store.com, data.cloud</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-800">Transaction Status</h4>
                <div className="mt-2 flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-700">Approved</span>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className={`transition-all duration-700 ease-in-out transform ${
              scrollY > 1200 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Engineered For AI Agents</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-4">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Set Spending Limits</h4>
                    <p className="text-slate-600 mt-1">
                      Define transaction and daily limits per agent, avoiding runaway costs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-4">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Merchant Whitelisting</h4>
                    <p className="text-slate-600 mt-1">
                      Restrict where your agents can make payments for maximum security
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-4">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Real-time Monitoring</h4>
                    <p className="text-slate-600 mt-1">
                      Detect anomalous behavior before it becomes a problem with instant alerts
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-4">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Simple Integration</h4>
                    <p className="text-slate-600 mt-1">
                      Replace weeks of custom development with one API key and three lines of code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsSection;