'use client';

import React from 'react';
import type { CommonNodeType } from '@/types/workflow.types';
import { NODE_REGISTRY } from '@/constants/workflow.constants';

type BaseNodeProps = {
  id: string;
  data: CommonNodeType;
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

export default function BaseNode({ id, data, children, onClick, active = false }: BaseNodeProps) {
  const nodeInfo = NODE_REGISTRY[data.type];

  return (
    <div className={`workflow-node ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="workflow-node-header">
        <div className={`workflow-node-icon ${nodeInfo?.iconClass || ''}`}>
          {nodeInfo?.icon || '?'}
        </div>
        <div>
          <div className="workflow-node-title">{data.title || nodeInfo?.title}</div>
          {data.desc && <div className="workflow-node-description">{data.desc}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
