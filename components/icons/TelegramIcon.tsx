import React from 'react';

const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path d="M21.1,3.4l-2.4,11.3c-0.2,0.8-0.7,1-1.2,0.6L12,11.5l-1.9,1.8c-0.2,0.2-0.4,0.4-0.8,0.4l0.3-2.6L16,5.3c0.3-0.2-0.1-0.4-0.5-0.1l-7.4,4.7L3.1,8.6C2.4,8.4,2.3,7.8,3.3,7.4l16.2-6.1C20.4,1,21.3,1.8,21.1,3.4z" />
  </svg>
);

export default TelegramIcon;
