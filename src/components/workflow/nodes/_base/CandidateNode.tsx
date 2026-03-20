'use client';

import React, { memo, useEffect } from 'react';
import { useReactFlow, type NodeProps } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow.store';
import { useHistory } from '@/hooks/useHistory';
import CustomNode from './CustomNode';
import CustomNoteNode from './CustomNoteNode';
import { CUSTOM_NOTE_NODE } from '../../WorkflowEditor';
import type { WorkflowNode } from '@/types/workflow.types';

const CandidateNode = () => {
  const reactflow = useReactFlow();
  const mousePosition = useWorkflowStore((s) => s.mousePosition);
  const candidateNode = useWorkflowStore((s) => s.candidateNode);
  const setCandidateNode = useWorkflowStore((s) => s.setCandidateNode);
  const setWorkflowReadOnly = useWorkflowStore((s) => s.setWorkflowReadOnly);
  const { addToHistory } = useHistory();

  // Lock workflow while candidate is active
  useEffect(() => {
    if (candidateNode) {
      setWorkflowReadOnly(true);
    }
  }, [candidateNode, setWorkflowReadOnly]);

  // Click to place node
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!candidateNode) return;
      e.preventDefault();

      const { getNodes, setNodes } = reactflow;
      const { screenToFlowPosition } = reactflow;
      const { x, y } = screenToFlowPosition({ x: mousePosition.pageX, y: mousePosition.pageY });

      addToHistory();

      const nodes = getNodes();
      const newNode: WorkflowNode = {
        ...candidateNode,
        data: { ...candidateNode.data, _isCandidate: false },
        position: { x, y: y - 50 },
      };
      setNodes([...nodes, newNode]);

      setCandidateNode(null);
      setWorkflowReadOnly(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!candidateNode) return;
      e.preventDefault();
      setCandidateNode(null);
      setWorkflowReadOnly(false);
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [candidateNode, mousePosition, reactflow, setCandidateNode, setWorkflowReadOnly, addToHistory]);

  if (!candidateNode) return null;

  return (
    <div
      className="absolute z-10 pointer-events-none opacity-70"
      style={{
        left: mousePosition.pageX,
        top: mousePosition.pageY,
        transform: `scale(${reactflow.getZoom()})`,
        transformOrigin: '0 0',
      }}
    >
      {candidateNode.type === CUSTOM_NOTE_NODE
        ? <CustomNoteNode {...(candidateNode as unknown as NodeProps)} />
        : <CustomNode {...(candidateNode as unknown as NodeProps)} />
      }
    </div>
  );
};

export default memo(CandidateNode);
