"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Brain, DatabaseZap, Code } from "lucide-react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full py-6 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Walta Logo" className="h-14" />
          </div>
        </div>
      </nav>

      {/* Hero Section with a gradient background */}
      <header className="bg-gradient-to-br from-[#1a3d2f] via-[#2a8365] to-[#34D399] text-white relative flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            The Future of AI Financial Identity
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Secure, programmable financial identities enabling the next generation of AI agents
          </p>
          <Button
            size="lg"
            className="bg-white text-[#2a8365] hover:bg-gray-100 hover:text-[#1a3d2f] transition-colors"
            onClick={() => {
              router.push("/login")
            }}
          >
            Log In
          </Button>
        </div>
      </header>

      {/* Core Features */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Core Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group backdrop-blur-sm bg-white/90 border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-[#34D399]/30 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 flex justify-center">
                  <div className="bg-[#2a8365]/10 p-4 rounded-2xl group-hover:bg-[#2a8365]/20 transition-colors">
                    <Shield className="h-10 w-10 text-[#2a8365]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">Agent Verification</h3>
                <p className="text-gray-600 text-center px-4">
                  Establish and validate AI agent identities with verifiable credentials
                </p>
              </CardContent>
            </Card>

            <Card className="group backdrop-blur-sm bg-white/90 border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-[#34D399]/30 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 flex justify-center">
                  <div className="bg-[#2a8365]/10 p-4 rounded-2xl group-hover:bg-[#2a8365]/20 transition-colors">
                    <Brain className="h-10 w-10 text-[#2a8365]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">Smart Logic</h3>
                <p className="text-gray-600 text-center px-4">
                  Programmable rules and permissions for controlled AI transactions
                </p>
              </CardContent>
            </Card>

            <Card className="group backdrop-blur-sm bg-white/90 border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-[#34D399]/30 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 flex justify-center">
                  <div className="bg-[#2a8365]/10 p-4 rounded-2xl group-hover:bg-[#2a8365]/20 transition-colors">
                    <DatabaseZap className="h-10 w-10 text-[#2a8365]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">Risk Management</h3>
                <p className="text-gray-600 text-center px-4">
                  Real-time monitoring and fraud prevention for AI agents
                </p>
              </CardContent>
            </Card>

            <Card className="group backdrop-blur-sm bg-white/90 border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-[#34D399]/30 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 flex justify-center">
                  <div className="bg-[#2a8365]/10 p-4 rounded-2xl group-hover:bg-[#2a8365]/20 transition-colors">
                    <Code className="h-10 w-10 text-[#2a8365]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">API-First</h3>
                <p className="text-gray-600 text-center px-4">
                  Developer-friendly APIs for seamless integration
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#1a3d2f] via-[#2a8365] to-[#34D399] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build the Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform and unlock secure financial capabilities for your AI agents
          </p>
          <Button
            size="lg"
            className="bg-white text-[#2a8365] hover:bg-gray-100 hover:text-[#1a3d2f] transition-colors"
          >
            Book A Call With Us!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Walta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;