'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useStyleStore } from '@/stores/style-store';

export function StylesRenderer() {
  const { styles, isSvg } = useStyleStore();

  return (
    <ScrollArea className="h-96 rounded-md max-w-lg border">
      <div className="p-4">
        <h2>Styles</h2>
        {isSvg ? (
          <p>
            Styles are only available for screens parsed to HTML. Please use the Figma plugin to
            make that work!
          </p>
        ) : (
          <SyntaxHighlighter language="css" style={dracula}>
            {styles}
          </SyntaxHighlighter>
        )}
      </div>
    </ScrollArea>
  );
}
