import React from 'react';

export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 8L21 9L16.5 13.5L18 19.5L12 16.5L6 19.5L7.5 13.5L3 9L9 8L12 2Z" fill="#EA4335" />
    <path d="M12 22L9 16L3 15L7.5 10.5L6 4.5L12 7.5L18 4.5L16.5 10.5L21 15L15 16L12 22Z" fill="#FBBC04" opacity="0.5"/>
    <path d="M12 12L12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12Z" fill="#EA4335"/>
    <path d="M12 12L22 12C22 14.7614 19.7614 17 17 17C14.2386 17 12 14.7614 12 12Z" fill="#4285F4"/>
    <path d="M12 12L12 22C9.23858 22 7 19.7614 7 17C7 14.2386 9.23858 12 12 12Z" fill="#34A853"/>
    <path d="M12 12L2 12C2 9.23858 4.23858 7 7 7C9.76142 7 12 9.23858 12 12Z" fill="#FBBC04"/>
  </svg>
);

export const GmailIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="white"/>
    <path d="M22 6L12 13L2 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 6H4V18H2V6Z" fill="#EA4335"/>
    <path d="M20 6H22V18H20V6Z" fill="#EA4335"/>
    <path d="M2 18H22" stroke="#EA4335" strokeWidth="2"/> 
    {/* Simplified representation */}
    <rect x="2" y="4" width="20" height="16" rx="2" fill="white"/>
    <path d="M2 6L12 13L22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="#EA4335" strokeWidth="2"/>
    <path d="M2 6L12 13L22 6" fill="#EA4335" fillOpacity="0.1"/>
    <path d="M2 6L12 13L22 6" stroke="#EA4335" strokeWidth="2"/>
    <path d="M22 6V18H18V10L12 14L6 10V18H2V6" fill="none" stroke="#EA4335" strokeWidth="2"/>
  </svg>
);

export const DriveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 17.5H21.5L15 6.5H8.5L2 17.5H8.5Z" fill="none"/>
    <path d="M8.7 17.8L15.2 6.5H8.8L2.3 17.8H8.7Z" fill="#0066DA"/>
    <path d="M8.7 17.8H21.7L15.2 6.5L8.7 17.8Z" fill="#119D59"/>
    <path d="M2.3 17.8L8.8 6.5L21.7 6.5L15.2 17.8H2.3Z" fill="#F5B400"/> {/* Abstracted */}
    <path d="M9 18L15 7L21 18H9Z" stroke="#34A853" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M4 18L10 7L16 18H4Z" stroke="#4285F4" strokeWidth="2" strokeLinejoin="round" transform="rotate(120 10 12.5)"/>
    <path d="M14 18L20 7L26 18H14Z" stroke="#FBBC04" strokeWidth="2" strokeLinejoin="round" transform="rotate(240 20 12.5)"/>
  </svg>
);

// Better simplified icons using pure SVG paths
export const GooglePhotosIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12V2C14.76 2 17 4.24 17 7C17 9.76 14.76 12 12 12Z" fill="#EA4335"/>
    <path d="M12 12H22C22 14.76 19.76 17 17 17C14.24 17 12 14.76 12 12Z" fill="#4285F4"/>
    <path d="M12 12V22C9.24 22 7 19.76 7 17C7 14.24 9.24 12 12 12Z" fill="#34A853"/>
    <path d="M12 12H2C2 9.24 4.24 7 7 7C9.76 7 12 9.24 12 12Z" fill="#FBBC04"/>
  </svg>
);

export const GoogleDriveIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8.66 3.75L15.34 3.75L22 15.25L15.32 15.25L8.66 3.75Z" fill="#FFC107"/>
    <path d="M8.66 3.75L2 15.25L5.34 21L12 9.5L8.66 3.75Z" fill="#188038"/>
    <path d="M15.32 15.25L22 15.25L18.66 21L5.34 21L12 9.5L15.32 15.25Z" fill="#4285F4"/>
  </svg>
);

export const GoogleGmailIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="white"/>
    <path d="M22 6L12 13L2 6V18H22V6Z" fill="#EA4335" fillOpacity="0.01"/> 
    <path d="M2 6L12 13L22 6" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6V18H18.5V10.5L12 15L5.5 10.5V18H2V6" fill="none" stroke="#EA4335" strokeWidth="2.5" strokeLinejoin="round"/>
  </svg>
);

export const GoogleMapsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 10.5C18.5 15.5 12 21 12 21C12 21 5.5 15.5 5.5 10.5C5.5 6.91 8.41 4 12 4C15.59 4 18.5 6.91 18.5 10.5Z" fill="#EA4335"/>
    <circle cx="12" cy="10.5" r="3" fill="#B31412"/>
    <path d="M3 20L8 18L13 21L21 18V4L16 6L11 3L3 6V20Z" fill="#34A853" opacity="0.2"/>
  </svg>
);

export const WhatsAppIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382C17.11 14.196 15.336 13.324 15.003 13.204C14.67 13.084 14.426 13.024 14.182 13.386C13.938 13.748 13.244 14.563 13.034 14.804C12.824 15.045 12.614 15.075 12.252 14.895C11.89 14.714 10.723 14.332 9.34 13.099C8.245 12.123 7.506 10.917 7.296 10.555C7.086 10.193 7.274 10.003 7.455 9.823C7.617 9.662 7.815 9.405 7.996 9.194C8.177 8.983 8.237 8.832 8.357 8.591C8.477 8.35 8.417 8.139 8.327 7.958C8.237 7.777 7.514 6.002 7.213 5.279C6.92 4.576 6.623 4.672 6.404 4.672C6.202 4.672 5.971 4.662 5.74 4.662C5.509 4.662 5.132 4.748 4.816 5.094C4.5 5.44 3.606 6.284 3.606 8.002C3.606 9.72 4.833 10.947 5.008 11.181C5.183 11.415 7.439 14.894 10.893 16.386C13.755 17.622 13.755 17.622 14.618 17.532C15.481 17.442 17.11 16.568 17.451 15.604C17.792 14.64 17.792 13.826 17.681 13.636C17.571 13.445 17.833 14.568 17.472 14.382Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.04 2C6.544 2 2.069 6.475 2.069 11.971C2.069 13.73 2.527 15.447 3.398 16.956L2 22.049L7.214 20.681C8.667 21.473 10.322 21.942 12.04 21.942C17.536 21.942 22.011 17.467 22.011 11.971C22.011 6.475 17.536 2 12.04 2ZM12.04 20.263C10.514 20.263 9.044 19.847 7.756 19.083L7.45 18.902L4.358 19.713L5.183 16.695L4.982 16.376C4.157 15.066 3.725 13.54 3.725 11.971C3.725 7.389 7.458 3.656 12.04 3.656C16.622 3.656 20.355 7.389 20.355 11.971C20.355 16.553 16.622 20.263 12.04 20.263Z" fill="#25D366"/>
  </svg>
);
