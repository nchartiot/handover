// 'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageResponse } from 'next/server';
import { GET } from '../app/api/og/route';

import { headers } from "next/headers";

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

  const host = headers().get("host");
  console.log(host)
  // const req = new Request("/?name=abc123")
  // const res = await GET(req);
  // console.log(res)

  const res = await fetch(`http://${host}/api/og/?name=${name}&element=${htmlString}}`);
  const imgBlob = await res.blob();
  const imgSrc = URL.createObjectURL(imgBlob);

  console.log(imgSrc)

  const element = (
    <div style={{ backgroundColor: 'red', width: '200px', height: '200px' }}>Hello, World!</div>
  );

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* {imageUrl && (
          <Image src={imageUrl} alt="Vercel" width={232} height={200} />
        )} */}
        {imgSrc && <Image src={imgSrc} alt="Vercel" width={232} height={200} />}
      </CardContent>
    </Card>
  );
}
