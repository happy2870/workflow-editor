import { useCallback } from 'react';
import { useHistory } from './useHistory';
import { useClipboard } from './useClipboard';

export function useKeyboardShortcuts() {
  const { undo, redo } = useHistory();
  const { copy, paste, duplicate } = useClipboard();

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const tag = (event.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) { redo(); } else { undo(); }
            break;
          case 'c':
            event.preventDefault();
            copy();
            break;
          case 'v':
            event.preventDefault();
            paste();
            break;
          case 'd':
            event.preventDefault();
            duplicate();
            break;
        }
      }
    },
    [undo, redo, copy, paste, duplicate]
  );

  return { onKeyDown };
}
