import { Copy } from 'lucide-react';
import { createElement, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { parseInlineMarkdown } from '../../../utils/markdown';
import type { ContentBlock } from '../types';

interface BlogContentRendererProps {
  blocks: ContentBlock[];
  title?: string;
}

const CodeBlock = ({ language, content }: { language: string; content: string }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!successful) {
          throw new Error('execCommand returned false');
        }
      }
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-6">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-sm font-mono text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 rounded"
          title="Copy code"
          type="button"
        >
          {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : <Copy size={16} />}
          <span className="sr-only" aria-live="polite" role="status">
            {copyStatus === 'success'
              ? 'Code copied to clipboard'
              : copyStatus === 'error'
                ? 'Copy action failed'
                : ''}
          </span>
        </button>
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-gray-300 font-mono text-sm">{content}</code>
      </pre>
    </div>
  );
};

const MathBlock = ({ content, displayMode = 'block' }: { content: string; displayMode?: 'inline' | 'block' }) => {
  try {
    return displayMode === 'inline' ? <InlineMath math={content} /> : <BlockMath math={content} />;
  } catch {
    return (
      <pre className="bg-gray-900/70 p-3 rounded-md overflow-x-auto">
        <code className="text-gray-300 font-mono text-sm">{content}</code>
      </pre>
    );
  }
};

const renderContentBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case 'heading': {
      const level = block.level;
      return createElement(`h${level}`, {
        key: index.toString(),
        className: `
            font-bold text-white [&_strong]:font-bold [&_strong]:text-white
            ${level === 2 ? 'text-2xl md:text-3xl mt-12 mb-6' : ''}
            ${level === 3 ? 'text-xl md:text-2xl mt-8 mb-4' : ''}
            ${level > 3 ? 'text-lg md:text-xl mt-6 mb-3' : ''}
          `,
        dangerouslySetInnerHTML: { __html: parseInlineMarkdown(block.content) },
      });
    }
    case 'paragraph':
      return (
        <p
          key={index.toString()}
          className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed [&_strong]:font-bold [&_strong]:text-white"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(block.content) }}
        />
      );
    case 'code':
      return <CodeBlock key={index.toString()} language={block.language} content={block.content} />;
    case 'list':
      return (
        <ul key={index.toString()} className="list-disc pl-6 mb-6 space-y-2 [&_strong]:font-bold [&_strong]:text-white">
          {block.items.map((item, itemIndex) => (
            <li
              key={itemIndex.toString()}
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }}
            />
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div key={index.toString()} className="bg-cyan-900/20 border-l-4 border-cyan-500 p-5 my-8 rounded-r-lg [&_strong]:font-bold [&_strong]:text-cyan-200">
          <p
            className="text-cyan-300 italic"
            dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(block.content) }}
          />
        </div>
      );
    case 'math':
      return (
        <div key={index.toString()} className="my-6 text-gray-100 overflow-x-auto">
          <MathBlock content={block.content} displayMode={block.displayMode} />
        </div>
      );
    case 'table':
      return (
        <div key={index.toString()} className="my-8">
          <div className="overflow-x-auto rounded-xl border border-cyan-900/60 bg-slate-950/70">
            <table className="min-w-full text-sm md:text-base text-left border-collapse">
              <thead className="bg-cyan-950/60">
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th
                      key={`${index.toString()}-header-${headerIndex.toString()}`}
                      scope="col"
                      className="px-4 py-3 font-semibold text-cyan-100 border-b border-cyan-900/60 whitespace-nowrap"
                      dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(header) }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr
                    key={`${index.toString()}-row-${rowIndex.toString()}`}
                    className={rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-cyan-950/20'}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${index.toString()}-cell-${rowIndex.toString()}-${cellIndex.toString()}`}
                        className="px-4 py-3 align-top text-gray-200 border-b border-cyan-900/40"
                        dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption ? (
            <p
              className="mt-3 text-sm text-cyan-300/80 italic"
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(block.caption) }}
            />
          ) : null}
        </div>
      );
    default:
      return null;
  }
};

export const BlogContentRenderer = ({ blocks, title: _title }: BlogContentRendererProps) => {
  return (
    <div className="prose prose-sm md:prose-lg prose-invert max-w-none px-2 sm:px-4 md:px-0 [&_strong]:font-bold [&_strong]:text-white">
      {blocks.map((block, index) => renderContentBlock(block, index))}
    </div>
  );
};
