/* eslint-disable @typescript-eslint/ban-ts-comment */
// App router includes @vercel/og.
// No need to install it.
// TODO: Duplicate or move this file outside the `_examples` folder to make it a route
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { Database } from '@/types/supabase';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const convertTextNode = (node: TextNode, baseStyle: string) => {
  // @ts-ignore - fontSize is not in the types
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
  // @ts-ignore - strokeWeight is not in the types
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

  // @ts-ignore - fills is not in the types
  if (node.fills && node.fills.length > 0 && node.fills[0].color) {
    // @ts-ignore - fills is not in the types
    const { r, g, b, a } = node.fills[0].color;
    baseStyleStr += ` background-color: rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a});`;
  }

  // @ts-ignore - strokes is not in the types
  if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
    // @ts-ignore - strokes is not in the types
    const { r, g, b, a } = node.strokes[0].color;
    // @ts-ignore - strokeWeight is not in the types
    baseStyleStr += ` border: ${node.strokeWeight}px solid rgba(${r * 255}, ${g * 255}, ${
      b * 255
    }, ${a});`;
  }

  // @ts-ignore - cornerRadius is not in the types
  if (node.cornerRadius) {
    // @ts-ignore - cornerRadius is not in the types
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
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const NAME = 'test name';

    const { data } = await supabase
      .from('latest_screen_versions')
      .select('latest_version')
      .eq('name', NAME)
      .single();

    const newVersion = data && data.latest_version ? data.latest_version + 1 : 1;

    const { error } = await supabase.from('screens').insert({
      name: NAME,
      html_file: html,
      version: newVersion,
      changes: 'test changes',
      is_svg: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({}, { headers: corsHeaders, status: 200 });
  } catch (e: unknown) {
    console.error(`${e}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
