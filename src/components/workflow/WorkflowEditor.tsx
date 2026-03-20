'use client';

import { NODE_REGISTRY, getInitialGraph } from '@/constants/Workflowconstants';
import { useClipboard } from '@/hooks/useClipboard';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNodeContextMenu } from '@/hooks/useNodeContextMenu';
import { CUSTOM_NOTE_NODE, useWorkflowEvents } from '@/hooks/useWorkflowEvents';
import { useWorkflowStore } from '@/store/workflow.store';
import { type CommonNodeType } from '@/types/workflow.types';
import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type EdgeTypes,
  type NodeTypes,
} from '@xyflow/react';
import { useMemo, useRef } from 'react';
import NodeContextMenu from './node-context-menu/NodeContextMenu';
import NodeSelector from './node-selector/NodeSelector';
import CandidateNode from './nodes/_base/CandidateNode';
import CustomEdge from './nodes/_base/CustomEdge';
import CustomNode from './nodes/_base/CustomNode';
import CustomNoteNode from './nodes/_base/CustomNoteNode';
import ConfigPanel from './panels/ConfigPanel';
import WorkflowControls from './WorkflowControls';

export { CUSTOM_NOTE_NODE };

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  [CUSTOM_NOTE_NODE]: CustomNoteNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};


function WorkflowEditorInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const initial = useMemo(() => getInitialGraph(), []);
  const [nodes, , onNodesChange] = useNodesState(initial.nodes);
  const [edges, , onEdgesChange] = useEdgesState(initial.edges);

  const controlMode = useWorkflowStore((s) => s.controlMode);

  const { copy, duplicate, deleteSelected } = useClipboard();
  const { onKeyDown } = useKeyboardShortcuts();
  const { contextMenu, onNodeContextMenu, closeContextMenu } = useNodeContextMenu();
  const {
    showNodeSelector,
    setShowNodeSelector,
    selectorPosition,
    onConnect,
    onPaneClick,
    onPaneContextMenu,
    addNode,
    addNoteNode,
    onNodesDelete,
    onEdgesDelete,
  } = useWorkflowEvents();

  return (
    <div className="flex h-full" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={() => onPaneClick(closeContextMenu)}
          onPaneContextMenu={(e) => onPaneContextMenu(e, closeContextMenu)}
          onNodeContextMenu={onNodeContextMenu}
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
          <Background color="#d1d5db" gap={20} size={2} variant={BackgroundVariant.Dots} />
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
        <CandidateNode />

        {/* Node selector - pane context menu */}
        {showNodeSelector && (
          <div
            className="absolute z-50"
            style={{ left: selectorPosition.x, top: selectorPosition.y }}
          >
            <NodeSelector
              onSelect={addNode}
              onSelectNote={addNoteNode}
              onClose={() => setShowNodeSelector(false)}
            />
          </div>
        )}

        {/* Node context menu - right click on node */}
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={closeContextMenu} onContextMenu={(e) => { e.preventDefault(); closeContextMenu(); }} />
            <div className="fixed z-[9999]" style={{ left: contextMenu.x, top: contextMenu.y }}>
              <NodeContextMenu
                onCopy={copy}
                onDuplicate={duplicate}
                onDelete={deleteSelected}
                onClose={closeContextMenu}
              />
            </div>
          </>
        )}
      </div>

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
