import React from 'react';
import logoUrl from "@/pages/logo5.svg";

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <img src={logoUrl} alt="ElectroMart Logo" className={className} />
  );
};

export default Logo;