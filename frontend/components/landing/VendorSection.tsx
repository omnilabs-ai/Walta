import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useNextRouterAdapter from "./useNextRouterAdapter";

const VendorSection = ({ scrollY }: { scrollY: number }) => {
  const navigate = useNextRouterAdapter();

  return (
    <div 
      className={`vendor-section transition-all duration-700 ease-in-out transform ${
        scrollY > 2200 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: "200ms" }}
    >
      <div className="inline-block bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
        FOR VENDORS
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Accept Payments from AI Agents Securely
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Capture massive new revenue streams from the $139 billion AI agent economy with a single API integration that takes less than a day to implement. Differentiate your platform with specialized capabilities demanded by AI developers, including sub-penny transactions and agent authentication that reduce operational costs by 80%.
      </p>
      
      <Button 
        className="mt-[-2px] bg-blue-900 hover:bg-blue-800 text-white"
        onClick={() => navigate("/signup?view=vendor")}
      >
        Become a Vendor Partner <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default VendorSection;