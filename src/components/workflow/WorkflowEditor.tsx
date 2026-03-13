'use client';

import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow.store';
import { BlockEnum, type CommonNodeType, type WorkflowNode, type WorkflowEdge } from '@/types/workflow.types';
import { NODE_REGISTRY, getDefaultNodeData } from '@/constants/workflow.constants';
import { generateNodeId } from '@/utils/layout.util';
import CustomNode from './nodes/_base/CustomNode';
import CustomEdge from './nodes/_base/CustomEdge';
import ConfigPanel from './panels/ConfigPanel';
import NodeSelector from './node-selector/NodeSelector';
import WorkflowControls from './WorkflowControls';
import { useHistory } from '@/hooks/useHistory';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Initial graph with a Start node
function getInitialGraph() {
  const startNode: WorkflowNode = {
    id: 'start-1',
    type: 'custom',
    position: { x: 100, y: 300 },
    data: {
      type: BlockEnum.Start,
      title: 'Start',
      desc: '',
      ...getDefaultNodeData(BlockEnum.Start),
    } as CommonNodeType,
  };
  return { nodes: [startNode], edges: [] as WorkflowEdge[] };
}

function WorkflowEditorInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const initial = useMemo(() => getInitialGraph(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });

  const deselectNode = useWorkflowStore((s) => s.deselectNode);
  const controlMode = useWorkflowStore((s) => s.controlMode);
  const { addToHistory, undo, redo } = useHistory();

  const onConnect = useCallback(
    (connection: Connection) => {
      addToHistory();
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'custom',
            data: { sourceType: BlockEnum.Start, targetType: BlockEnum.End },
          },
          eds
        )
      );
    },
    [setEdges, addToHistory]
  );

  const onPaneClick = useCallback(() => {
    deselectNode();
    setShowNodeSelector(false);
  }, [deselectNode]);

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      setSelectorPosition({ x: event.clientX, y: event.clientY });
      setShowNodeSelector(true);
    },
    []
  );

  const addNode = useCallback(
    (type: BlockEnum) => {
      addToHistory();
      const position = screenToFlowPosition(selectorPosition);
      const nodeInfo = NODE_REGISTRY[type];
      const newNode: WorkflowNode = {
        id: generateNodeId(),
        type: 'custom',
        position,
        data: {
          type,
          title: nodeInfo?.title || type,
          desc: '',
          ...getDefaultNodeData(type),
        } as CommonNodeType,
      };
      setNodes((nds) => [...nds, newNode]);
      setShowNodeSelector(false);
    },
    [screenToFlowPosition, selectorPosition, setNodes, addToHistory]
  );

  const onNodesDelete = useCallback(() => {
    addToHistory();
  }, [addToHistory]);

  const onEdgesDelete = useCallback(() => {
    addToHistory();
  }, [addToHistory]);

  // Keyboard shortcuts
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    },
    [undo, redo]
  );

  return (
    <div className="flex h-full" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'custom' }}
          panOnDrag={controlMode === 'hand'}
          selectionOnDrag={controlMode === 'pointer'}
          defaultViewport={{ x: 0, y: 0, zoom: 1.15 }}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background color="#d1d5db" gap={20} size={2} variant={"dots" as any} />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as CommonNodeType;
              const info = NODE_REGISTRY[data?.type];
              return info ? '#3b82f6' : '#94a3b8';
            }}
            maskColor="rgba(0,0,0,0.08)"
            style={{ bottom: 55 }}
          />
        </ReactFlow>
        <WorkflowControls />

        {/* Node selector context menu */}
        {showNodeSelector && (
          <div
            className="absolute z-50"
            style={{ left: selectorPosition.x, top: selectorPosition.y }}
          >
            <NodeSelector
              onSelect={addNode}
              onClose={() => setShowNodeSelector(false)}
            />
          </div>
        )}
      </div>

      {/* Config panel */}
      <ConfigPanel />
    </div>
  );
}

export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner />
    </ReactFlowProvider>
  );
}
