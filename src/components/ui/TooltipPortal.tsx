'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipPortalProps {
  children: React.ReactNode;
  containerId?: string;
}

/**
 * Renders children into a DOM node attached to document.body so tooltips
 * are not clipped by parent stacking contexts. Default containerId is 'tooltip-root'.
 */
export default function TooltipPortal({ children, containerId = 'tooltip-root' }: TooltipPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.height = '0';
      el.style.overflow = 'visible';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      document.body.appendChild(el);
    }
    return () => {
      // Keep the container for reuse
    };
  }, [containerId]);

  if (!mounted) return null;
  const root = document.getElementById(containerId);
  if (!root) return null;

  return createPortal(children, root);
}