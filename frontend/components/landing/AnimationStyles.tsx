import React from 'react';

const AnimationStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      .animated-border-container {
        position: relative;
        padding: 0;
        width: 100%;
        overflow: hidden;
      }
      
      .animated-border-inner {
        background-color: rgb(241 245 249);
        border-radius: 0.75rem;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        min-height: 88px;
        display: flex;
        position: relative;
        z-index: 1;
        margin: 1px;
      }

      .animated-border-inner > div {
        width: 100%;
      }

      .developer-section .animated-border-inner {
        background-color: rgb(255 237 213);
      }
      
      .animated-border-container:hover .animated-border-inner {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
                    0 8px 10px -6px rgba(0, 0, 0, 0.01);
      }
      
      .animated-border-container::before {
        content: '';
        position: absolute;
        height: 300px;
        width: 100px;
        background: linear-gradient(
          90deg,
          rgba(96, 165, 250, 0) 0%,
          rgba(37, 99, 235, 0.8) 50%,
          rgba(96, 165, 250, 0) 100%
        );
        z-index: 0;
        animation: rotate 5s linear infinite;
        top: 50%;
        transform-origin: top center;
      }

      .developer-section .animated-border-container::before {
        background: linear-gradient(
          90deg,
          rgba(251, 146, 60, 0) 0%,
          rgba(249, 115, 22, 0.8) 50%,
          rgba(251, 146, 60, 0) 100%
        );
      }
      
      @keyframes rotate {
        0% {
          transform: rotate(0deg) translateY(-50%);
        }
        100% {
          transform: rotate(360deg) translateY(-50%);
        }
      }
      
      /* Make the vendor section match the developer section styles */
      .vendor-section .animated-border-inner {
        background-color: rgb(241 245 249);
        min-height: 88px;
      }
      
      /* Ensure all boxes have consistent heights */
      .vendor-section li .animated-border-inner,
      .developer-section li .animated-border-inner {
        min-height: 96px; /* Base height for all boxes */
      }
      
      /* Fix specific box heights for taller content */
      .vendor-section li:nth-child(2) .animated-border-inner,
      .developer-section li:nth-child(2) .animated-border-inner {
        min-height: 95px; 
      }
      
      .vendor-section li:nth-child(4) .animated-border-inner,
      .developer-section li:nth-child(4) .animated-border-inner {
        min-height: 95px;
      }
      
      /* Align the first boxes */
      .vendor-section li:nth-child(1) .animated-border-inner,
      .developer-section li:nth-child(1) .animated-border-inner {
        min-height: 105px;
      }
      
      /* Align the third boxes */
      .vendor-section li:nth-child(3) .animated-border-inner,
      .developer-section li:nth-child(3) .animated-border-inner {
        min-height: 95px;
      }
      
      /* Align the fifth boxes */
      .vendor-section li:nth-child(5) .animated-border-inner,
      .developer-section li:nth-child(5) .animated-border-inner {
        min-height: 110px;
      }
      
      /* Custom navy blue color for vendor icons */
      .text-navy-blue {
        color: #001861;
      }

      @keyframes customSvgDashKeyframes {
        0% { stroke-dashoffset: 24; }
        100% { stroke-dashoffset: 0; }
      }

      .custom-svg-dash-animation {
        animation: customSvgDashKeyframes 1.5s linear infinite;
      }
      `
    }} />
  );
};

export default AnimationStyles;