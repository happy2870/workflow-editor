'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { NodeProps } from '@xyflow/react';
import { NodeResizeControl, useReactFlow } from '@xyflow/react';
import { RiDraggable } from '@remixicon/react';
import { NoteTheme, type NoteNodeData, type CommonNodeType } from '@/types/workflow.types';

const THEME_MAP: Record<NoteTheme, { bg: string; border: string; title: string }> = {
  [NoteTheme.Blue]:   { bg: '#EFF8FF', border: '#84CAFF', title: '#2E90FA' },
  [NoteTheme.Cyan]:   { bg: '#ECFDFF', border: '#67E3F9', title: '#06AED4' },
  [NoteTheme.Green]:  { bg: '#EDFCF2', border: '#73E2A3', title: '#16B364' },
  [NoteTheme.Yellow]: { bg: '#FEFBE8', border: '#FDE272', title: '#EAAA08' },
  [NoteTheme.Pink]:   { bg: '#FDF2FA', border: '#FAA7E0', title: '#EE46BC' },
  [NoteTheme.Violet]: { bg: '#F5F3FF', border: '#C3B5FD', title: '#875BF7' },
};

const THEMES = Object.values(NoteTheme);

export default function CustomNoteNode({ id, data, selected }: NodeProps) {
  const noteData = data as CommonNodeType<NoteNodeData>;
  const theme = THEME_MAP[noteData.theme] || THEME_MAP[NoteTheme.Yellow];
  const { updateNodeData } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState(false);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleThemeChange = useCallback(
    (t: NoteTheme) => {
      updateNodeData(id, { theme: t });
    },
    [id, updateNodeData]
  );

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editing]);

  return (
    <>
      <div
        className="rounded-md p-3 h-full relative"
        style={{
          backgroundColor: theme.bg,
          border: `1.5px solid ${selected ? theme.title : theme.border}`,
          boxShadow: selected ? `0 0 0 2px ${theme.title}33` : '0 1px 3px rgba(0,0,0,0.08)',
          minHeight: 80,
        }}
        onDoubleClick={() => setEditing(true)}
      >
        {/* Theme picker - shown when selected */}
        {selected && (
          <div className="flex gap-1 mb-2">
            {THEMES.map((t) => (
              <button
                key={t}
                className="w-4 h-4 rounded-full border border-white/50 cursor-pointer"
                style={{
                  backgroundColor: THEME_MAP[t].title,
                  outline: noteData.theme === t ? `2px solid ${THEME_MAP[t].title}` : 'none',
                  outlineOffset: 1,
                }}
                onClick={() => handleThemeChange(t)}
              />
            ))}
          </div>
        )}

        {/* Text content */}
        {editing && selected ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-sm text-gray-700 nowheel nopan"
            style={{ minHeight: 40 }}
            value={noteData.text || ''}
            onChange={handleTextChange}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="메모를 입력하세요..."
          />
        ) : (
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {noteData.text || (
              <span className="text-gray-400">더블클릭하여 메모 입력...</span>
            )}
          </div>
        )}

        {/* Resize handle inside the node */}
        <NodeResizeControl
          minWidth={200}
          maxWidth={600}
          minHeight={80}
          style={{ background: 'transparent', border: 'none' }}
          position="bottom-right"
        >
          <div className="absolute bottom-1 right-1">
            <RiDraggable size={12} className="text-gray-400" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </NodeResizeControl>
      </div>
    </>
  );
}
