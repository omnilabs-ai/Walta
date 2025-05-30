
import { Shield } from "lucide-react";

interface AgentAuthenticationProps {
  scrollY: number;
}

const AgentAuthentication = ({ scrollY }: AgentAuthenticationProps) => {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-in-out transform ${
        scrollY > 300 ? "opacity-100" : "opacity-0 translate-y-10"
      }`}
      style={{
        left: "-70px",
        top: "calc(50% - 120px)", // Moved another 30px up from previous position
        transform: `translate(0%, -50%) ${scrollY <= 300 ? 'translateY(10px)' : ''}`
      }}
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-[360px] h-[420px]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-900 rounded-full p-3">
            <Shield size={24} className="text-blue-400" />
          </div>
          <h3 className="font-semibold text-xl text-white">Agent Authentication</h3>
        </div>
        <p className="text-slate-300 mb-4">
          Bind each AI agent to a real-world owner using cryptographic verification
        </p>
        <div className="rounded p-3 bg-[#1A1F2C] overflow-hidden">
          {/* Code editor header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-slate-400">agent_auth.py</div>
          </div>
          <div className="font-mono text-xs">
            <div><span className="text-purple-400">from</span> <span className="text-blue-300">walta</span> <span className="text-purple-400">import</span> <span className="text-green-300">WaltaDID</span></div>
            <div>&nbsp;</div>
            <div><span className="text-purple-400"># Create a new DID for your agent</span></div>
            <div><span className="text-blue-300">agent_did</span> <span className="text-white">=</span> <span className="text-green-300">WaltaDID</span><span className="text-white">.</span><span className="text-blue-300">create</span><span className="text-white">(</span></div>
            <div className="pl-4"><span className="text-blue-300">owner_did</span><span className="text-white">=</span><span className="text-green-300">"did:example:1234abcd"</span><span className="text-white">,</span> <span className="text-purple-400"># Link to the human owner's DID</span></div>
            <div className="pl-4"><span className="text-blue-300">agent_name</span><span className="text-white">=</span><span className="text-green-300">"BookingAssistant"</span><span className="text-white">,</span></div>
            <div className="pl-4"><span className="text-blue-300">agent_description</span><span className="text-white">=</span><span className="text-green-300">"Books travel accommodations"</span></div>
            <div><span className="text-white">)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAuthentication;