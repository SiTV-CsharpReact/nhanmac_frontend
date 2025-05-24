'use client';

import React, { useEffect, useState } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { Spin } from 'antd'; // Ant Design loading spinner

import { useServerInsertedHTML } from 'next/navigation';

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  // Track whether styles are loaded
  const [isLoading, setIsLoading] = useState(true);

  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    setIsLoading(false); // Styles are loaded, stop showing the spinner
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  // Optionally, you can use useEffect to hide the loading state on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    // Display a loading spinner centered on the screen
    return (
      <div className="loading-container" style={loadingStyle}>
        <Spin size="large" />
      </div>
    );
  }

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

// CSS-in-JS style for centering the spinner
const loadingStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Full screen height
};

export default StyledComponentsRegistry;
