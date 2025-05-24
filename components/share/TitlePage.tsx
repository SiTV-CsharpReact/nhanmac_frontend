'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
interface TitlePageProps {
  text: string;
}

const TitlePage: React.FC<TitlePageProps> = ({text}) => {
  // const [activeParent, setActiveParent] = useState<string | null>(null);

  // useEffect(() => {
  //   const storedValue = Cookies.get('activeParent');
  //   if (storedValue) {
  //     setActiveParent(storedValue);
  //   }
  // }, []);

  return (
    <div>
      <h2 className="text-[#2F80ED] border-l-10 pl-2 text-2xl font-semibold uppercase my-5">
        {text}
      </h2>

    </div>
  );
};

export default TitlePage;
