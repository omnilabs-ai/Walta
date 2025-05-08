
import { CheckCircle } from "lucide-react";

const TechnicalImplementation = () => {
  return (
    <div className="bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700 relative">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl font-semibold text-blue-400 mb-4">Secure Programming Interface</h4>
          <div className="rounded-lg overflow-hidden bg-[#1A1F2C] shadow-lg">
            {/* Code editor header */}
            <div className="flex items-center justify-between bg-slate-900 p-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-slate-400">walta_wallet.py</div>
            </div>
            
            {/* Line numbers + code */}
            <div className="flex text-sm font-mono">
              {/* Line numbers */}
              <div className="p-4 text-right text-gray-500 select-none bg-slate-900 border-r border-slate-700">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div>10</div>
                <div>11</div>
                <div>12</div>
              </div>
              
              {/* Code content */}
              <div className="p-4 overflow-auto w-full text-gray-200">
                <div><span className="text-gray-400"># Initialize wallet vault for secure payments</span></div>
                <div><span className="text-purple-400">from</span> walta <span className="text-purple-400">import</span> WaltaVault</div>
                <div><span className="text-purple-400">import</span> os</div>
                <div></div>
                <div><span className="text-gray-400"># Initialize the client with your agent key</span></div>
                <div>vault_client = WaltaVault(agent_key=os.getenv(<span className="text-green-300">"WALTA_AGENT_KEY"</span>))</div>
                <div></div>
                <div><span className="text-gray-400"># Store a payment method securely</span></div>
                <div>vault_response = vault_client.create_payment_vault(</div>
                <div>    payment_method={"{}"},</div>
                <div>    policy={"{"}</div>
                <div>        <span className="text-green-300">"max_transaction_amount"</span>: <span className="text-orange-300">1000</span>,</div>
                <div>        <span className="text-green-300">"allowed_merchants"</span>: [<span className="text-green-300">"amazon.com"</span>, <span className="text-green-300">"booking.com"</span>],</div>
                <div>    {"}"}</div>
                <div>)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-xl font-semibold text-blue-400 mb-4">Multi-layered Security</h4>
          <ul className="space-y-4">
            <li className="flex items-start bg-slate-700/20 p-3 rounded-lg">
              <div className="mt-1.5 bg-green-900 rounded-full p-1 mr-3">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Vault Tokenization</h5>
                <p className="text-sm text-slate-300">Payment details are encrypted and tokenized, never exposed to agents</p>
              </div>
            </li>
            
            <li className="flex items-start bg-slate-700/20 p-3 rounded-lg">
              <div className="mt-1.5 bg-green-900 rounded-full p-1 mr-3">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Decentralized Identity</h5>
                <p className="text-sm text-slate-300">Each agent has a cryptographic identity linked to its owner</p>
              </div>
            </li>
            
            <li className="flex items-start bg-slate-700/20 p-3 rounded-lg">
              <div className="mt-1.5 bg-green-900 rounded-full p-1 mr-3">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Policy Enforcement</h5>
                <p className="text-sm text-slate-300">Programmable rules control what agents can purchase and spend</p>
              </div>
            </li>
            
            <li className="flex items-start bg-slate-700/20 p-3 rounded-lg">
              <div className="mt-1.5 bg-green-900 rounded-full p-1 mr-3">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white">AI Risk Monitoring</h5>
                <p className="text-sm text-slate-300">Real-time fraud detection identifies unusual patterns</p>
              </div>
            </li>
            
            <li className="flex items-start bg-slate-700/20 p-3 rounded-lg">
              <div className="mt-1.5 bg-green-900 rounded-full p-1 mr-3">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Audit Trails</h5>
                <p className="text-sm text-slate-300">Every agent action is logged for complete transparency</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TechnicalImplementation;