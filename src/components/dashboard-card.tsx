'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardCardProps = {
  name: string;
  id: number;
};

export async function DashboardCard({ name, id }: DashboardCardProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>();
  const getImage = async () => {
    const res = await fetch(`/api/card-image/?id=${id}`);
    const text = await res.text()

    console.log({ text });

    const imgBlob = await res.blob();
    const imgSrc = URL.createObjectURL(imgBlob);

    console.log({imgSrc, text, imgBlob});
    setImageUrl(imgSrc);
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <Card
      className="h-52 max-w-md cursor-pointer select-none"
      onClick={() => router.push(`/dashboard/${id}`)}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={`/api/card-image/?id=${id}`} alt="Vercel" width={232} height={200} />
        {imageUrl && <Image src={imageUrl} alt="Vercel" width={232} height={200} />}
      </CardContent>
    </Card>
  );
}
