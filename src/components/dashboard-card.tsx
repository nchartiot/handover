'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardCardProps = {
  name: string;
  id: string;
};

export async function DashboardCard({ name, id }: DashboardCardProps) {
  const router = useRouter();

  return (
    <Card
      className="h-52 max-w-md cursor-pointer select-none overflow-hidden"
      onClick={() => router.push(`/dashboard/${id}`)}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <Image src={`/api/card-image/?id=${id}`} alt="Vercel" width={232} height={200} /> */}
        {/* {imageUrl && <Image src={imageUrl} alt="Vercel" width={232} height={200} />} */}
      </CardContent>
    </Card>
  );
}
