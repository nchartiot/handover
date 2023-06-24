// 'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function DashboardCard({ htmlString, name }: { htmlString: string; name: string }) {
  // const [imageUrl, setImageUrl] = useState<string>();
  // const getImage = async () => {
  //   const res = await fetch(`/og/?element=${htmlString}`);

  //   const imgBlob = await res.blob();
  //   const imgSrc = URL.createObjectURL(imgBlob);

  //   console.log();
  //   setImageUrl(imgSrc);
  // };

  // useEffect(() => {
  //   getImage();
  // }, []);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* {imageUrl && (
          <Image src={imageUrl} alt="Vercel" width={232} height={200} />
        )} */}
        {/* {imgSrc && <Image src={imgSrc} alt="Vercel" width={232} height={200} />} */}
      </CardContent>
    </Card>
  );
}
