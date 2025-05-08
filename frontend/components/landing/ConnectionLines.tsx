interface ConnectionLinesProps {
    scrollY: number;
  }
  
  const ConnectionLines = ({ scrollY }: ConnectionLinesProps) => {
    const opacity = scrollY > 300 ? 1 : 0;
  
    return (
      <svg 
        className="absolute top-0 left-0 w-full h-full z-0 overflow-visible pointer-events-none" 
        style={{ opacity, transition: 'opacity 1s ease-in-out' }}
      >
        {/* Authentication to Wallet - dotted line */}
        <line 
          x1="250" y1="130" 
          x2="350" y2="130" 
          stroke="#4ade80" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
          className="custom-svg-dash-animation"
        />
        
        {/* Wallet to Payment - dotted line */}
        <line 
          x1="700" y1="130" 
          x2="730" y2="130" 
          stroke="#4ade80" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
          className="custom-svg-dash-animation" 
          style={{ animationDelay: '1s' }}
        />
        
        {/* Single vertical green dotted animated line connecting Wallet Creation to Security Audit */}
        <line 
          x1="520" y1="490" 
          x2="520" y2="620" 
          stroke="#4ade80" 
          strokeWidth="2" 
          strokeDasharray="8,8" 
          className="custom-svg-dash-animation" 
          style={{ animationDelay: '1s' }}
        />
  
        {/* New line connecting Agent Authentication to Security Audit */}
        <path 
          d="M180 420 Q180 600 320 710" 
          fill="none"
          stroke="#4ade80" 
          strokeWidth="2" 
          strokeDasharray="8,8" 
          className="custom-svg-dash-animation" 
          style={{ animationDelay: '1.5s' }}
        />
  
        {/* New line connecting Secure Payment to Security Audit */}
        <path 
          d="M880 420 Q880 600 700 710" 
          fill="none"
          stroke="#4ade80" 
          strokeWidth="2" 
          strokeDasharray="8,8" 
          className="custom-svg-dash-animation" 
          style={{ animationDelay: '1.5s' }}
        />
      </svg>
    );
  };
  
  export default ConnectionLines;