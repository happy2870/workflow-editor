'use client';

import React, { useMemo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { RiAddLine, RiCloseLine } from '@remixicon/react';
import type { CommonEdgeType, NodeRunningStatus, BlockEnum, CommonNodeType, WorkflowNode } from '@/types/workflow.types';
import { NODE_REGISTRY, getDefaultNodeData } from '@/constants/Workflowconstants';
import { useHistory } from '@/hooks/useHistory';
import { generateNodeId } from '@/utils/layout.util';
import NodeSelector from '../../node-selector/NodeSelector';

function getEdgeColor(status?: NodeRunningStatus | string): string {
  switch (status) {
    case 'succeeded': return '#22c55e';
    case 'failed':
    case 'exception': return '#ef4444';
    case 'running': return '#3b82f6';
    default: return '#94a3b8';
  }
}

export default function CustomEdge({
  id, data, source, sourceHandleId, target, targetHandleId,
  sourceX, sourceY, targetX, targetY, selected,
}: EdgeProps) {
  const { setEdges, setNodes } = useReactFlow();
  const { addToHistory } = useHistory();
  const [showSelector, setShowSelector] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
  });

  const edgeData = data as CommonEdgeType | undefined;

  const stroke = useMemo(() => {
    if (selected) return '#000';
    if (edgeData?._sourceRunningStatus) return getEdgeColor(edgeData._sourceRunningStatus);
    return '#94a3b8';
  }, [selected, edgeData]);

  // Delete this edge
  const onEdgeRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToHistory();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  // Insert a node in the middle of this edge
  const onInsertNode = (type: BlockEnum) => {
    addToHistory();

    const info = NODE_REGISTRY[type];
    const newNodeId = generateNodeId();
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    const newNode: WorkflowNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: midX - 120, y: midY - 40 },
      data: {
        type,
        title: info?.title || type,
        desc: '',
        ...getDefaultNodeData(type),
      } as CommonNodeType,
    };

    setNodes((nds) => [...nds, newNode]);

    // Remove old edge, add two new edges: source→newNode, newNode→target
    setEdges((eds) => {
      const filtered = eds.filter((e) => e.id !== id);
      return [
        ...filtered,
        {
          id: `edge-${source}-${newNodeId}`,
          source: source,
          sourceHandle: sourceHandleId || `${source}-source`,
          target: newNodeId,
          targetHandle: `${newNodeId}-target`,
          type: 'custom',
          data: { sourceType: edgeData?.sourceType, targetType: type },
        },
        {
          id: `edge-${newNodeId}-${target}`,
          source: newNodeId,
          sourceHandle: `${newNodeId}-source`,
          target: target,
          targetHandle: targetHandleId || `${target}-target`,
          type: 'custom',
          data: { sourceType: type, targetType: edgeData?.targetType },
        },
      ];
    });

    setShowSelector(false);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke,
          strokeWidth: 2,
          opacity: edgeData?._waitingRun ? 0.5 : 1,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="flex gap-1"
        >
          {/* Add node button */}
          <button
            className="edgebutton w-5 h-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowSelector(!showSelector);
            }}
          >
            <RiAddLine size={14} />
          </button>
          {/* Delete edge button */}
          <button
            className="edgebutton w-5 h-5 rounded-full bg-gray-500 hover:bg-red-500 text-white flex items-center justify-center"
            onClick={onEdgeRemoveClick}
          >
            <RiCloseLine size={14} />
          </button>

          {/* Node selector popup */}
          {showSelector && (
            <div
              className="absolute z-50"
              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 }}
            >
              <NodeSelector
                onSelect={onInsertNode}
                onClose={() => setShowSelector(false)}
              />
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
