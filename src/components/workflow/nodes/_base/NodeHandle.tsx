'use client';

import React, { useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { RiAddLine } from '@remixicon/react';
import { createPortal } from 'react-dom';
import type { CommonNodeType, BlockEnum, WorkflowNode } from '@/types/workflow.types';
import { NODE_REGISTRY, getDefaultNodeData } from '@/constants/workflow.constants';
import { useWorkflowStore } from '@/store/workflow.store';
import { useHistory } from '@/hooks/useHistory';
import { generateNodeId } from '@/utils/layout.util';
import NodeSelector from '../../node-selector/NodeSelector';

type NodeHandleProps = {
  id: string;
  data: CommonNodeType;
  handleId: string;
};

export const NodeTargetHandle = ({ id, data, handleId }: NodeHandleProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const { getNode, setNodes, setEdges } = useReactFlow();
  const { addToHistory } = useHistory();
  const workflowReadOnly = useWorkflowStore((s) => s.workflowReadOnly);
  const isDragging = useRef(false);

  const nodeInfo = NODE_REGISTRY[data.type];
  const isConnectable = (nodeInfo?.availablePrevNodes?.length ?? 0) > 0 && !data.isIterationStart;

  if (!isConnectable) return null;

  const connected = (data._connectedTargetHandleIds || []).includes(handleId);

  const handleMouseDown = () => { isDragging.current = false; };
  const handleMouseMove = () => { isDragging.current = true; };
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current || workflowReadOnly || connected) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopupPos({ x: rect.left - 8, y: rect.top + rect.height / 2 });
    setSelectorOpen(!selectorOpen);
  };

  const onSelectNode = (type: BlockEnum) => {
    addToHistory();
    const currentNode = getNode(id);
    if (!currentNode) return;

    const info = NODE_REGISTRY[type];
    const newNodeId = generateNodeId();
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: currentNode.position.x - 300, y: currentNode.position.y },
      data: { type, title: info?.title || type, desc: '', ...getDefaultNodeData(type) } as CommonNodeType,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds,
      {
        id: `edge-${newNodeId}-${id}`,
        source: newNodeId, sourceHandle: `${newNodeId}-source`,
        target: id, targetHandle: handleId,
        type: 'custom',
        data: { sourceType: type, targetType: data.type },
      },
    ]);
    setSelectorOpen(false);
  };

  return (
    <>
      <Handle
        id={handleId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!w-0 !h-0 !border-0 !min-w-0 !min-h-0 !bg-transparent !overflow-visible"
        style={{ left: 0, top: '50%', transform: 'translateY(-50%)' }}
      >
        {!connected && (
          <div
            className="absolute w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full cursor-pointer flex items-center justify-center node-item-add"
            style={{ left: -10, top: -10 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          >
            <RiAddLine size={14} className="text-white pointer-events-none" />
          </div>
        )}
      </Handle>
      {selectorOpen && !connected && typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setSelectorOpen(false)} />
            <div className="fixed z-[9999]" style={{ left: popupPos.x, top: popupPos.y, transform: 'translate(-100%, -50%)' }}>
              <NodeSelector availableNodes={nodeInfo?.availablePrevNodes} onSelect={onSelectNode} onClose={() => setSelectorOpen(false)} />
            </div>
          </>,
          document.body
        )
      }
    </>
  );
};

export const NodeSourceHandle = ({ id, data, handleId }: NodeHandleProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const { getNode, setNodes, setEdges } = useReactFlow();
  const { addToHistory } = useHistory();
  const workflowReadOnly = useWorkflowStore((s) => s.workflowReadOnly);
  const isDragging = useRef(false);

  const nodeInfo = NODE_REGISTRY[data.type];
  const isConnectable = (nodeInfo?.availableNextNodes?.length ?? 0) > 0;

  if (!isConnectable) return null;

  const handleMouseDown = () => { isDragging.current = false; };
  const handleMouseMove = () => { isDragging.current = true; };
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current || workflowReadOnly) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopupPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    setSelectorOpen(!selectorOpen);
  };

  const onSelectNode = (type: BlockEnum) => {
    addToHistory();
    const currentNode = getNode(id);
    if (!currentNode) return;

    const info = NODE_REGISTRY[type];
    const newNodeId = generateNodeId();
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: currentNode.position.x + 300, y: currentNode.position.y },
      data: { type, title: info?.title || type, desc: '', ...getDefaultNodeData(type) } as CommonNodeType,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds,
      {
        id: `edge-${id}-${newNodeId}`,
        source: id, sourceHandle: handleId,
        target: newNodeId, targetHandle: `${newNodeId}-target`,
        type: 'custom',
        data: { sourceType: data.type, targetType: type },
      },
    ]);
    setSelectorOpen(false);
  };

  return (
    <>
      <Handle
        id={handleId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!w-0 !h-0 !border-0 !min-w-0 !min-h-0 !bg-transparent !overflow-visible"
        style={{ right: 0, left: 'auto', top: '50%', transform: 'translateY(-50%)' }}
      >
        <div
          className="absolute w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full cursor-pointer flex items-center justify-center node-item-add"
          style={{ left: -10, top: -10 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <RiAddLine size={14} className="text-white pointer-events-none" />
        </div>
      </Handle>
      {selectorOpen && typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setSelectorOpen(false)} />
            <div className="fixed z-[9999]" style={{ left: popupPos.x, top: popupPos.y, transform: 'translateY(-50%)' }}>
              <NodeSelector availableNodes={nodeInfo?.availableNextNodes} onSelect={onSelectNode} onClose={() => setSelectorOpen(false)} />
            </div>
          </>,
          document.body
        )
      }
    </>
  );
};
