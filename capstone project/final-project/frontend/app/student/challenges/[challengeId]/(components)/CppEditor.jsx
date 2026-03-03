'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Maximize2, X } from 'lucide-react';
import { Button } from '#components/common/Button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

export default function CppEditor({
  value,
  onChange,
  disabled,
  height = '50vh',
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const frameRef = useRef(null);
  const fromRectRef = useRef(null);
  const wrapperClassName = isFullscreen
    ? 'editor-shell editor-shell--expanded'
    : 'editor-shell';
  const frameStyle = useMemo(() => {
    if (!isFullscreen) return { width: '100%', height };
    return { width: 'min(92vw, 960px)', height: '80vh' };
  }, [height, isFullscreen]);

  const captureRect = () => {
    const frame = frameRef.current;
    if (!frame) return;
    fromRectRef.current = frame.getBoundingClientRect();
  };

  const scrollToEdge = (direction) => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    if (direction === 'top') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    const maxScroll = document.documentElement.scrollHeight;
    window.scrollTo({ top: maxScroll, behavior });
  };

  const handleExpand = () => {
    captureRect();
    setIsFullscreen(true);
    scrollToEdge('top');
  };

  const handleCollapse = () => {
    captureRect();
    setIsFullscreen(false);
    scrollToEdge('bottom');
  };

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const fromRect = fromRectRef.current;
    if (!frame || !fromRect) return;

    const toRect = frame.getBoundingClientRect();
    fromRectRef.current = null;

    const deltaX = fromRect.left - toRect.left;
    const deltaY = fromRect.top - toRect.top;
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const shouldAnimate =
      Math.abs(deltaX) > 0.5 ||
      Math.abs(deltaY) > 0.5 ||
      Math.abs(scaleX - 1) > 0.01 ||
      Math.abs(scaleY - 1) > 0.01;
    if (!shouldAnimate) return;

    frame.style.transition = 'none';
    frame.style.transformOrigin = 'top left';
    frame.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    frame.getBoundingClientRect();

    requestAnimationFrame(() => {
      frame.style.transition = '';
      frame.style.transform = 'translate(0, 0) scale(1)';
    });
  }, [isFullscreen]);

  return (
    <div className={wrapperClassName} data-testid='monaco-editor'>
      <div className='editor-frame' style={frameStyle} ref={frameRef}>
        <MonacoEditor
          height='100%'
          width='100%'
          defaultLanguage='cpp'
          theme='vs-dark'
          value={value}
          onChange={(val) => onChange(val ?? '')}
          options={{
            fontSize: 16,
            readOnly: disabled,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: 'bounded',
            wordWrapColumn: 80,
            wrappingIndent: 'same',
            rulers: [80],
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            padding: {
              top: 12,
              bottom: 12,
            },
          }}
        />
        {!isFullscreen && (
          <div className='absolute bottom-3 right-3 z-10'>
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className='button-round'
              onClick={handleExpand}
              title='Expand editor'
              aria-label='Expand editor'
            >
              <Maximize2 />
            </Button>
          </div>
        )}
        {isFullscreen && (
          <div className='absolute top-3 right-3 z-10'>
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className='button-round'
              onClick={handleCollapse}
              title='Exit expanded editor'
              aria-label='Exit expanded editor'
            >
              <X />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
