'use client';

import React from 'react';
import { RiStickyNoteLine } from '@remixicon/react';
import { BlockEnum } from '@/types/workflow.types';
import { NODE_REGISTRY, ALL_BLOCK_TYPES } from '@/constants/Workflowconstants';

type NodeSelectorProps = {
  availableNodes?: BlockEnum[];
  onSelect: (type: BlockEnum) => void;
  onSelectNote?: () => void;
  onClose: () => void;
};

export default function NodeSelector({ availableNodes, onSelect, onSelectNote, onClose }: NodeSelectorProps) {
  const nodes = availableNodes || ALL_BLOCK_TYPES;

  return (
    <div className="node-selector" onClick={(e) => e.stopPropagation()}>
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Add Node</div>
      {nodes.map((type) => {
        const info = NODE_REGISTRY[type];
        if (!info) return null;
        return (
          <div
            key={type}
            className="node-selector-item"
            onClick={() => {
              onSelect(type);
              onClose();
            }}
          >
            <div className={`workflow-node-icon ${info.iconClass}`}>
              {info.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">{info.title}</div>
              <div className="text-xs text-gray-500">{info.description}</div>
            </div>
          </div>
        );
      })}

      {/* Note node option */}
      {onSelectNote && (
        <>
          <div className="border-t border-gray-100 my-1" />
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Utility</div>
          <div
            className="node-selector-item"
            onClick={() => {
              onSelectNote();
              onClose();
            }}
          >
            <div className="workflow-node-icon" style={{ backgroundColor: '#FEFBE8', color: '#EAAA08' }}>
              <RiStickyNoteLine size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">Note</div>
              <div className="text-xs text-gray-500">Add a memo or comment</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
