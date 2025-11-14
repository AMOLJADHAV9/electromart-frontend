import React from 'react';
import logoUrl from "@/assete/electro-white.png";

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <img src={logoUrl} alt="ElectroMart Logo" className={className} />
  );
};

export default Logo;