
import { Zap } from "lucide-react";

interface SecurePaymentProps {
  scrollY: number;
}

const SecurePayment = ({ scrollY }: SecurePaymentProps) => {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-in-out transform ${
        scrollY > 300 ? "opacity-100" : "opacity-0 translate-y-10"
      }`}
      style={{
        right: "-70px",
        top: "calc(50% - 120px)", // Moved another 30px up from previous position
        transform: `translate(0%, -50%) ${scrollY <= 300 ? 'translateY(10px)' : ''}`
      }}
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-[360px] h-[420px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-orange-900 rounded-full p-3">
            <Zap size={24} className="text-orange-400" />
          </div>
          <h3 className="font-semibold text-xl text-white">Secure Payment</h3>
        </div>
        <p className="text-slate-300 mb-4">
          Process payments securely with risk monitoring
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
            <div className="text-xs text-slate-400">payment.js</div>
          </div>
          
          {/* Code content */}
          <div className="border-t border-slate-700 p-3 font-mono text-xs">
            <div><span className="text-purple-400">const</span> <span className="text-blue-300">payment_result</span> <span className="text-white">=</span> <span className="text-yellow-300">transaction_client</span><span className="text-white">.</span><span className="text-green-300">send_payment</span><span className="text-white">(</span></div>
            <div className="pl-4"><span className="text-blue-300">vault_id</span><span className="text-white">:</span> <span className="text-green-300">"vault_xyz123"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">agent_did</span><span className="text-white">:</span> <span className="text-green-300">"did:walta:agent789"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">merchant_id</span><span className="text-white">:</span> <span className="text-green-300">"booking-service"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">amount</span><span className="text-white">:</span> <span className="text-orange-300">299.99</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">currency</span><span className="text-white">:</span> <span className="text-green-300">"USD"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">description</span><span className="text-white">:</span> <span className="text-green-300">"3-night hotel stay"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">risk_context</span><span className="text-white">:</span> <span className="text-white">&#123;&#125;</span></div>
            <div className="text-white">)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePayment;