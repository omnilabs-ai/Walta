"use client";

import { Wallet, Database, Bitcoin } from "lucide-react";

const ComingSoonFeatures = () => {
  return (
    <div className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            We're expanding the Walta ecosystem with new capabilities
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-blue-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-700 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500/20 to-transparent p-2 text-xs font-medium rounded-bl-lg">
              Coming Q3
            </div>
            
            <Wallet size={36} className="text-blue-300 mb-4" />
            
            <h3 className="text-xl font-bold mb-3">Agent-to-Agent Transactions</h3>
            <p className="text-blue-100 mb-6">
              Enable direct transactions between AI agents, with built-in escrow and verification protocols for secure autonomous commerce.
            </p>
            
            <div className="mt-auto pt-6 border-t border-blue-700/50">
              <div className="flex justify-between">
                <span className="text-sm text-blue-200">Benefit</span>
                <span className="text-sm font-medium text-blue-200">200% increased transaction volumes</span>
              </div>
              <div className="w-full h-2 bg-blue-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#0EA5E9] rounded-full w-[100%]"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-700 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500/20 to-transparent p-2 text-xs font-medium rounded-bl-lg">
              Coming Q3
            </div>
            
            <Bitcoin size={36} className="text-blue-300 mb-4" />
            
            <h3 className="text-xl font-bold mb-3">Digital Currency Integration</h3>
            <p className="text-blue-100">
              Enable AI agents to transact using <span className="font-bold">stablecoins</span> and <span className="font-bold">digital currencies</span> with sub-penny precision, facilitating 24/7 global micropayments and programmable smart contracts.
            </p>
            
            <div className="mt-auto pt-6 border-t border-blue-700/50">
              <div className="flex justify-between">
                <span className="text-sm text-blue-200">Benefit</span>
                <span className="text-sm font-medium text-blue-200">Reduce costs by 80%</span>
              </div>
              <div className="w-full h-2 bg-blue-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#0EA5E9] rounded-full w-[80%]"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-700 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500/20 to-transparent p-2 text-xs font-medium rounded-bl-lg">
              Coming Q4
            </div>
            
            <Database size={36} className="text-blue-300 mb-4" />
            
            <h3 className="text-xl font-bold mb-3">Human-to-Agent Transfers</h3>
            <p className="text-blue-100">
              Allow humans to safely delegate financial authority to their AI agents with built-in guardrails, approvals, and spending controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeatures;