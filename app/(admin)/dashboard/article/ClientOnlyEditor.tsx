'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Import CKEditor component với SSR tắt
const CustomEditor = dynamic(() => import('./components/CustomEditor'), { ssr: false });

export default function ClientOnlyEditor() {
  return <CustomEditor />;
}