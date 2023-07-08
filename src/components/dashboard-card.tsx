'use client';

import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardCardProps = {
  name: string;
  id: string;
  htmlFile: string;
};

export async function DashboardCard({ name, id, htmlFile }: DashboardCardProps) {
  const router = useRouter();

  return (
    <Card
      className="h-60 max-w-md cursor-pointer select-none overflow-hidden shadow"
      onClick={() => router.push(`/dashboard/${id}`)}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-center justify-center">
          <div style={{ scale: '0.2', border: '1px solid black' }}>{parse(htmlFile)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
