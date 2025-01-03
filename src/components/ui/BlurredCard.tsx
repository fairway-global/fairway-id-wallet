import React, { ReactNode } from "react";

interface IBlurredCard {
  bgColor: string;
  children: ReactNode;
  className?: string
}

const BlurredCard: React.FC<IBlurredCard> = ({ bgColor, children, className }) => {
  return (
    <div className={`relative z-10 rounded-2xl h-auto bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-lg ${className}`}>
      <div
        style={{ background: bgColor }}
        className={`absolute translate-y-[60%] translate-x-[10%] z-0 h-1/2 w-3/4 rounded-full opacity-40 blur-2xl`}
      />
      {children}
    </div>
  );
};

export default BlurredCard;
