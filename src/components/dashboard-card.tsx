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
    const json = await res.json()

    console.log({ json });

    const imgBlob = await res.blob();
    const imgSrc = URL.createObjectURL(imgBlob);

    console.log();
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
        {/* {imgSrc && <Image src={imgSrc} alt="Vercel" width={232} height={200} />} */}
      </CardContent>
    </Card>
  );
}
