'use client';

import React, { useCallback } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { CommonNodeType } from '@/types/workflow.types';
import { useWorkflowStore } from '@/store/workflow.store';
import BaseNode from './BaseNode';
import { NodeTargetHandle, NodeSourceHandle } from './NodeHandle';
import { NODE_TYPE_COMPONENTS } from '../../node-registry';

export default function CustomNode({ id, data }: NodeProps) {
  const nodeData = data as CommonNodeType;
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const workflowReadOnly = useWorkflowStore((s) => s.workflowReadOnly);

  const handleClick = useCallback(() => {
    if (workflowReadOnly) return;
    selectNode(id, { id, data: nodeData, position: { x: 0, y: 0 } } as any);
  }, [id, nodeData, workflowReadOnly, selectNode]);

  const NodeComponent = NODE_TYPE_COMPONENTS[nodeData.type];

  return (
    <>
      <NodeTargetHandle id={id} data={nodeData} handleId={`${id}-target`} />
      <BaseNode id={id} data={nodeData} onClick={handleClick} active={selectedNodeId === id}>
        {NodeComponent && <NodeComponent id={id} data={nodeData} />}
      </BaseNode>
      <NodeSourceHandle id={id} data={nodeData} handleId={`${id}-source`} />
    </>
  );
}
