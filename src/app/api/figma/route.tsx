// App router includes @vercel/og.
// No need to install it.
// export const runtime = 'edge';
// TODO: Duplicate or move this file outside the `_examples` folder to make it a route
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ImageResponse } from 'next/server';
import { NextResponse } from 'next/server';

import { Database } from '@/types/supabase';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const convertTextNode = (node: TextNode, baseStyle: string) => {
  const fontSize = node?.style?.fontSize || 16;
  return `<p id='text' style='${baseStyle} font-size: ${fontSize}px; background-color: white; color: black'>${node.characters}</p>`;
};

const convertGroupNode = (node: GroupNode, baseStyle: string, frameBoundingBox: Rect) => {
  let groupDiv = '';

  for (const child of node.children) {
    groupDiv += convertNodeToHtml(child, frameBoundingBox);
  }

  return groupDiv;
};

const convertRectangleNode = (node: RectangleNode, baseStyle: string) => {
  return `<div id='rectangle' style='${baseStyle}'></div>`;
};

const convertLineNode = (node: LineNode, baseStyle: string) => {
  return `<div id='line' style='${baseStyle} height: ${node.strokeWeight}px; transform: rotate(${node.rotation}rad); background-color: black; border: unset;'></div>`;
};

const convertNodeToHtml = (node: SceneNode, frameBoundingBox: Rect): string => {
  const height = node.absoluteBoundingBox?.height;
  const width = node.absoluteBoundingBox?.width;

  const x = node.absoluteBoundingBox
    ? Math.abs(node.absoluteBoundingBox.x - frameBoundingBox.x)
    : 0;
  const y = node.absoluteBoundingBox
    ? Math.abs(node.absoluteBoundingBox.y - frameBoundingBox.y)
    : 0;

  let baseStyleStr = `position: absolute; left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; margin: 0px;`;

  if (node.fills && node.fills.length > 0 && node.fills[0].color) {
    const { r, g, b, a } = node.fills[0].color;
    baseStyleStr += ` background-color: rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a});`;
  }

  // Convert strokes to border
  if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
    const { r, g, b, a } = node.strokes[0].color;
    baseStyleStr += ` border: ${node.strokeWeight}px solid rgba(${r * 255}, ${g * 255}, ${
      b * 255
    }, ${a});`;
  }

  // Convert cornerRadius to border-radius
  if (node.cornerRadius) {
    baseStyleStr += ` border-radius: ${node.cornerRadius}px;`;
  }

  switch (node.type) {
    case 'TEXT':
      return convertTextNode(node, baseStyleStr);
    case 'GROUP':
      return convertGroupNode(node, baseStyleStr, frameBoundingBox);
    case 'RECTANGLE':
      return convertRectangleNode(node, baseStyleStr);
    case 'LINE':
      return convertLineNode(node, baseStyleStr);
    default:
      return `<div id=${String(node.type)}></div>`;
  }
};

const convertFrameToHtml = (frame: FrameNode) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const frameBoundingBox = frame.absoluteBoundingBox!;

  let mainDiv = `<div id='main' style='position: relative; width: ${String(
    frameBoundingBox.width
  )}px; height: ${String(frameBoundingBox.height)}px; overflow: hidden; background-color: white'>`;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  for (const child of frame.children) {
    const node = convertNodeToHtml(child, frameBoundingBox);
    mainDiv += node;
  }

  mainDiv += '</div>';
  return mainDiv;
};

export async function POST(request: Request) {
  try {
    const {
      frame: { document },
    }: { frame: { document: FrameNode } } = await request.json();
    const html = convertFrameToHtml(document);
    return NextResponse.json({ html }, { headers: corsHeaders });

    // const { searchParams } = new URL(request.url);
    // const screenId = searchParams.get('id') || 0;

    // // Create a Supabase client configured to use cookies
    // const supabase = createRouteHandlerClient<Database>({ cookies });

    // // This assumes you have a `todos` table in Supabase. Check out
    // // the `Create Table and seed with data` section of the README 👇
    // // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
    // const { data } = await supabase.from('screens').select('html_file').eq('id', screenId);

    // if (!data) throw new Error('could not find data');

    // const htmlFile = data[0].html_file;
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
