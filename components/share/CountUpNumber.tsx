"use client";

import {  useState } from "react";
import CountUp from "react-countup";

interface CountUpNumberProps {
  end: number;
  suffix?:  React.ReactNode;
  duration?: number;
}

export default function CountUpNumber({
  end,
  suffix,
//   duration = 2,
}: CountUpNumberProps) {
  const [showSuffix, setShowSuffix] = useState(false);
//   useEffect(() => {
//     const timer = setTimeout(() => setShowSuffix(true), duration * 1000);
//     return () => clearTimeout(timer);
//   }, [duration]);

  return (
    <div className="relative text-[23px] font-semibold text-white">
      <CountUp start={0} end={end}  
          onEnd={() => setShowSuffix(true)}
       />
       {showSuffix && suffix}
    </div>
  );
}
