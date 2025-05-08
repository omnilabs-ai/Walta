
import { Wallet } from "lucide-react";

interface WalletCreationProps {
  scrollY: number;
}

const WalletCreation = ({ scrollY }: WalletCreationProps) => {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-in-out delay-300 transform ${
        scrollY > 300 ? "opacity-100" : "opacity-0 translate-y-10"
      }`}
      style={{
        left: "50%",
        top: "calc(50% - 120px)", // Moved another 30px up from previous position
        transform: `translate(-50%, -50%) ${scrollY <= 300 ? 'translateY(10px)' : ''}`
      }}
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-[360px] h-[420px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-900 rounded-full p-3">
            <Wallet size={24} className="text-green-400" />
          </div>
          <h3 className="font-semibold text-xl text-white">Wallet Creation</h3>
        </div>
        <p className="text-slate-300 mb-4">
          Secure programmable vaults that tokenize payment information
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
            <div className="text-xs text-slate-400">wallet_config.py</div>
          </div>
          
          {/* Code content */}
          <div className="border-t border-slate-700 p-3 font-mono text-xs">
            <div className="text-gray-400 mb-1"># Create secure payment vault</div>
            <div>
              <span className="text-purple-400">vault_response</span> <span className="text-white">=</span> <span className="text-blue-400">vault_client</span><span className="text-white">.</span><span className="text-yellow-300">create_payment_vault</span><span className="text-white">(</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">payment_method</span><span className="text-white">=</span><span className="text-green-300">{"{}"}</span><span className="text-white">,</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">policy</span><span className="text-white">=</span><span className="text-green-300">{"{"}</span>
            </div>
            <div className="ml-8">
              <span className="text-green-300">"max_transaction_amount"</span><span className="text-white">:</span> <span className="text-orange-300">1000</span><span className="text-white">,</span>
            </div>
            <div className="ml-8">
              <span className="text-green-300">"allowed_merchants"</span><span className="text-white">:</span> <span className="text-white">[</span><span className="text-green-300">"amazon.com"</span><span className="text-white">,</span> <span className="text-green-300">"booking.com"</span><span className="text-white">]</span><span className="text-white">,</span>
            </div>
            <div className="ml-4">
              <span className="text-green-300">{"}"}</span>
            </div>
            <div><span className="text-white">)</span></div>
            <div className="mt-2 text-xs bg-green-900 text-green-300 p-1 rounded text-center font-medium">
              ✓ Vault Created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCreation;