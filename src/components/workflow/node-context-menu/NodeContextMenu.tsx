'use client';

import React from 'react';
import { RiFileCopyLine, RiDeleteBinLine, RiFileAddLine } from '@remixicon/react';

type NodeContextMenuProps = {
  onCopy: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function NodeContextMenu({ onCopy, onDuplicate, onDelete, onClose }: NodeContextMenuProps) {
  const itemClass = 'flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors';

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]" onClick={(e) => e.stopPropagation()}>
      <div
        className={itemClass}
        onClick={() => { onCopy(); onClose(); }}
      >
        <RiFileCopyLine size={15} className="text-gray-500" />
        <span>복사</span>
        <span className="ml-auto text-xs text-gray-400">Ctrl+C</span>
      </div>
      <div
        className={itemClass}
        onClick={() => { onDuplicate(); onClose(); }}
      >
        <RiFileAddLine size={15} className="text-gray-500" />
        <span>복제</span>
        <span className="ml-auto text-xs text-gray-400">Ctrl+D</span>
      </div>
      <div className="border-t border-gray-100 my-1" />
      <div
        className={`${itemClass} !text-red-600 hover:!bg-red-50`}
        onClick={() => { onDelete(); onClose(); }}
      >
        <RiDeleteBinLine size={15} />
        <span>삭제</span>
        <span className="ml-auto text-xs text-gray-400">Del</span>
      </div>
    </div>
  );
}
