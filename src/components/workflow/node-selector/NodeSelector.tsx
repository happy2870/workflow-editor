'use client';

import React from 'react';
import { BlockEnum } from '@/types/workflow.types';
import { NODE_REGISTRY, ALL_BLOCK_TYPES } from '@/constants/workflow.constants';

type NodeSelectorProps = {
  availableNodes?: BlockEnum[];
  onSelect: (type: BlockEnum) => void;
  onClose: () => void;
};

export default function NodeSelector({ availableNodes, onSelect, onClose }: NodeSelectorProps) {
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
    </div>
  );
}
