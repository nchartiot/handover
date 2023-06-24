'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';

export function HeroImage() {
  const { theme } = useTheme();

  let imageUrl;
  switch (theme) {
    case 'dark':
      imageUrl = '/app-screenshot-dark.png';
      break;
    case 'light':
      imageUrl = '/app-screenshot-light.png';
      break;
    default:
      imageUrl = '/app-screenshot-light.png';
      break;
  }

  return (
    <Image
      src={imageUrl}
      alt="App screenshot"
      width={2432}
      height={1442}
      className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
    />
  );
}
