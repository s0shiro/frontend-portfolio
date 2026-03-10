import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function TypewriterMessage({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) {
        clearInterval(intervalId);
      }
    }, 15); // Adjust typing speed here (ms per character)

    return () => clearInterval(intervalId);
  }, [content]);

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedContent}</ReactMarkdown>
    </div>
  );
}
