'use client';

import parse from 'html-react-parser';
import { useEffect, useRef } from 'react';

import { useStyleStore } from '@/stores/style-store';

type ScreenRendererProps = {
  htmlString: string;
  isSvg: boolean;
};

export function ScreenRenderer({ htmlString, isSvg }: ScreenRendererProps) {
  const { setStyles, setIsSvg } = useStyleStore();
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSvg(isSvg);
  }, [isSvg, setIsSvg]);

  useEffect(() => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.5)'; // Semi-transparent blue
    overlay.style.pointerEvents = 'none'; // So it doesn't interfere with mouse events
    overlay.style.display = 'none'; // Hide it initially
    document.body.appendChild(overlay);

    const mainDiv = document.getElementById('main');

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the target is a child of the main div
      if (mainDiv && mainDiv.contains(target)) {
        const rect = target.getBoundingClientRect();

        // Position the overlay over the target element
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.display = 'block'; // Show the overlay
      } else {
        overlay.style.display = 'none'; // Hide the overlay if the target is not a child of the main div
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the target is a child of the main div
      if (mainDiv && mainDiv.contains(target)) {
        const computedStyles = window.getComputedStyle(target);

        // Get specific styles
        const color = computedStyles.getPropertyValue('color');
        const backgroundColor = computedStyles.getPropertyValue('background-color');
        const borderColor = computedStyles.getPropertyValue('border-color');
        const borderWidth = computedStyles.getPropertyValue('border-width');
        const borderStyle = computedStyles.getPropertyValue('border-style');
        const fontSize = computedStyles.getPropertyValue('font-size');
        const fontFamily = computedStyles.getPropertyValue('font-family');
        const fontWeight = computedStyles.getPropertyValue('font-weight');
        const fontStyle = computedStyles.getPropertyValue('font-style');
        const width = computedStyles.getPropertyValue('width');
        const height = computedStyles.getPropertyValue('height');

        setStyles(
          `color: ${color};\nbackground-color: ${backgroundColor};\nborder-color: ${borderColor};\nborder-width: ${borderWidth};\nborder-style: ${borderStyle};\nfont-size: ${fontSize};\nfont-family: ${fontFamily};\nfont-weight: ${fontWeight};\nfont-style: ${fontStyle};\nwidth: ${width};\nheight: ${height};\n`
        );
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    // Clean up the event listeners and the overlay when the component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.body.removeChild(overlay);
    };
  }, [setStyles]);

  return <div ref={parentRef}>{parse(htmlString)}</div>;
}
