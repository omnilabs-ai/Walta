"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/logo.svg" alt="Walta" width={56} height={56} className="h-14 w-auto" />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#hero" className="text-slate-800 hover:text-blue-900 text-lg font-bold">Product</a>
          <a href="#solutions" className="text-slate-800 hover:text-blue-900 text-lg font-bold">Solutions</a>
          <a href={process.env.NEXT_PUBLIC_DOCS_URL} className="text-slate-800 hover:text-blue-900 text-lg font-bold">Documentation</a>
          <a href="https://calendly.com/walta_team" className="text-slate-800 hover:text-blue-900 text-lg font-bold">Contact Us</a>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-[#192E5B] text-white hover:bg-[#192E5B]/90 text-lg py-2 px-6 transform hover:scale-105 transition-all duration-150 ease-in-out"
              >
                Get Started
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/signup?view=developer">Sign up as Developer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/signup?view=vendor">Sign up as Vendor</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;