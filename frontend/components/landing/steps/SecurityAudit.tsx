import { Database, ShieldCheck } from "lucide-react";

interface SecurityAuditProps {
  scrollY: number;
}

const SecurityAudit = ({ scrollY }: SecurityAuditProps) => {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-in-out delay-900 transform ${
        scrollY > 300 ? "opacity-100" : "opacity-0 translate-y-10"
      }`}
      style={{
        left: "50%",
        top: "calc(75% + 90px)", // Moved up 20px from previous position (110px to 90px)
        transform: `translate(-50%, -50%) ${scrollY <= 300 ? 'translateY(10px)' : ''}`
      }}
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-[360px] h-[340px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-900 rounded-full p-3">
            <Database size={24} className="text-blue-400" />
          </div>
          <h3 className="font-semibold text-xl text-white">Security & Audit</h3>
        </div>
        <p className="text-slate-300 mb-4">
          Complete audit trail with fraud detection
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
            <div className="text-xs text-slate-400">security_report.log</div>
          </div>
          
          {/* Code content */}
          <div className="border-t border-slate-700 p-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-blue-300">Risk Score:</span>
              <div className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs">
                12/100 (Low)
              </div>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-blue-300">Transactions:</span>
              <span className="text-white">24 (7 days)</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-blue-300">Policy:</span>
              <span className="text-green-300">Compliant</span>
            </div>
            
            {/* Added audit log entries */}
            <div className="mt-3 pt-2 border-t border-slate-700">
              <div className="text-blue-300 mb-1">Last audit log entries:</div>
              <div className="text-xs text-slate-300">
                <div className="flex">
                  <span className="text-slate-500 mr-2">2025-05-05 09:32</span>
                  <span className="text-green-300">PAYMENT_APPROVED</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 mr-2">2025-05-05 09:31</span>
                  <span className="text-green-300">AGENT_AUTH_SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;