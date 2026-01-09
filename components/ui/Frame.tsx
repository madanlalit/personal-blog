'use client';

import React from 'react';
import './Frame.css';

interface FrameProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Frame: React.FC<FrameProps> = ({ label, children, className = '', id }) => {
  return (
    <section className={`sys-frame ${className}`} id={id}>
      <div className="frame-corner topleft" />
      <div className="frame-corner topright" />
      <div className="frame-corner bottomleft" />
      <div className="frame-corner bottomright" />
      {label && <div className="frame-label">{label}</div>}
      {children}
    </section>
  );
};

export default Frame;
