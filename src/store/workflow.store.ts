import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Viewport } from '@xyflow/react';
import type { WorkflowNode, WorkflowEdge, CommonNodeType } from '@/types/workflow.types';

type GraphSnapshot = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

interface WorkflowState {
  // Graph data
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;

  // Selection
  selectedNodeId: string | null;
  selectedNode: WorkflowNode | null;

  // UI state
  panelOpen: boolean;
  nodeSelectorOpen: boolean;
  workflowReadOnly: boolean;
  controlMode: 'pointer' | 'hand';

  // Candidate node (mouse-following preview)
  candidateNode: WorkflowNode | null;
  mousePosition: { pageX: number; pageY: number };

  // History (undo/redo)
  historyPast: GraphSnapshot[];
  historyFuture: GraphSnapshot[];

  // Actions - Graph
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setViewport: (viewport: Viewport) => void;

  // Actions - Selection
  selectNode: (id: string, node: WorkflowNode) => void;
  deselectNode: () => void;

  // Actions - UI
  setPanelOpen: (open: boolean) => void;
  setNodeSelectorOpen: (open: boolean) => void;
  setWorkflowReadOnly: (readOnly: boolean) => void;
  setControlMode: (mode: 'pointer' | 'hand') => void;
  setCandidateNode: (node: WorkflowNode | null) => void;
  setMousePosition: (pos: { pageX: number; pageY: number }) => void;

  // Actions - Node data
  updateNodeData: (nodeId: string, data: Partial<CommonNodeType>) => void;

  // Actions - History
  addToHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  undo: (currentNodes: WorkflowNode[], currentEdges: WorkflowEdge[]) => GraphSnapshot | null;
  redo: (currentNodes: WorkflowNode[], currentEdges: WorkflowEdge[]) => GraphSnapshot | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    (set, get) => ({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      selectedNodeId: null,
      selectedNode: null,
      panelOpen: false,
      nodeSelectorOpen: false,
      workflowReadOnly: false,
      controlMode: 'pointer' as const,
      candidateNode: null,
      mousePosition: { pageX: 0, pageY: 0 },
      historyPast: [],
      historyFuture: [],

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      setViewport: (viewport) => set({ viewport }),

      selectNode: (id, node) =>
        set({ selectedNodeId: id, selectedNode: node, panelOpen: true }),
      deselectNode: () =>
        set({ selectedNodeId: null, selectedNode: null, panelOpen: false }),

      setPanelOpen: (open) => set({ panelOpen: open }),
      setNodeSelectorOpen: (open) => set({ nodeSelectorOpen: open }),
      setWorkflowReadOnly: (readOnly) => set({ workflowReadOnly: readOnly }),
      setControlMode: (mode) => set({ controlMode: mode }),
      setCandidateNode: (node) => set({ candidateNode: node }),
      setMousePosition: (pos) => set({ mousePosition: pos }),

      updateNodeData: (nodeId, data) => {
        const { nodes, selectedNodeId, selectedNode } = get();
        const updatedNodes = nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        );
        set({ nodes: updatedNodes });
        if (selectedNodeId === nodeId && selectedNode) {
          set({ selectedNode: { ...selectedNode, data: { ...selectedNode.data, ...data } } });
        }
      },

      addToHistory: (nodes, edges) => {
        const { historyPast } = get();
        const newPast = [...historyPast, {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        }];
        if (newPast.length > MAX_HISTORY) newPast.shift();
        set({ historyPast: newPast, historyFuture: [] });
      },

      undo: (currentNodes, currentEdges) => {
        const { historyPast, historyFuture } = get();
        if (historyPast.length === 0) return null;
        const prev = historyPast[historyPast.length - 1];
        set({
          historyPast: historyPast.slice(0, -1),
          historyFuture: [{
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
          }, ...historyFuture],
        });
        return prev;
      },

      redo: (currentNodes, currentEdges) => {
        const { historyPast, historyFuture } = get();
        if (historyFuture.length === 0) return null;
        const next = historyFuture[0];
        set({
          historyPast: [...historyPast, {
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
          }],
          historyFuture: historyFuture.slice(1),
        });
        return next;
      },

      canUndo: () => get().historyPast.length > 0,
      canRedo: () => get().historyFuture.length > 0,
    }),
    { name: 'workflow-store' }
  )
);
