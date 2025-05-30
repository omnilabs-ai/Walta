import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useNextRouterAdapter from "./useNextRouterAdapter";

const DeveloperSection = ({ scrollY }: { scrollY: number }) => {
  const navigate = useNextRouterAdapter();

  return (
    <div 
      className={`developer-section transition-all duration-700 ease-in-out transform ${
        scrollY > 2200 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: "0ms" }}
    >
      <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
        FOR DEVELOPERS
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Build Financially Capable AI Agents
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Add payment capabilities to your AI with three lines of code, eliminating weeks of complex financial infrastructure work. Process thousands of sub-penny transactions impossible with traditional payment systems while our SDK handles all identity, security, and compliance challenges.
      </p>
      
      <Button 
        className="mt-[-2px] bg-orange-500 hover:bg-orange-600 text-white"
        onClick={() => navigate("/signup?view=developer")}
      >
        Start Building <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default DeveloperSection;