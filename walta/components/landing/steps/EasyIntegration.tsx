
import { Code } from "lucide-react";

interface EasyIntegrationProps {
  scrollY: number;
}

const EasyIntegration = ({ scrollY }: EasyIntegrationProps) => {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-in-out delay-700 transform ${
        scrollY > 750 ? "opacity-100" : "opacity-0 translate-y-10"
      }`}
      style={{
        left: "20%",
        top: scrollY > 750 ? "60%" : "70%"
      }}
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-[320px] h-[320px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-violet-900 rounded-full p-3">
            <Code size={24} className="text-violet-400" />
          </div>
          <h3 className="font-semibold text-xl text-white">Easy Integration</h3>
        </div>
        <p className="text-slate-300 mb-4">
          Works with LangChain and other agent frameworks
        </p>
        
        {/* IDE-like interface */}
        <div className="rounded bg-[#1A1F2C] overflow-hidden">
          {/* Code editor header */}
          <div className="flex items-center justify-between p-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-slate-400">tools.py</div>
          </div>
          
          {/* Code content */}
          <div className="border-t border-slate-700 p-3 font-mono text-xs">
            <div><span className="text-purple-400">@tool</span></div>
            <div><span className="text-blue-300">def</span> <span className="text-green-300">send_payment</span><span className="text-white">(product_id):</span></div>
            <div className="pl-4"><span className="text-green-300">"""Make a secure payment"""</span></div>
            <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-yellow-300">walta_api</span><span className="text-white">.</span><span className="text-green-300">pay</span><span className="text-white">(</span></div>
            <div className="pl-8"><span className="text-blue-300">product_id</span><span className="text-white">=product_id</span></div>
            <div className="pl-4"><span className="text-white">)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyIntegration;