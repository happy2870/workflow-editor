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

  // History (undo/redo)
  graphHistory: GraphSnapshot[];
  currentHistoryIndex: number;

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

  // Actions - Node data
  updateNodeData: (nodeId: string, data: Partial<CommonNodeType>) => void;

  // Actions - History
  addToHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  undo: () => GraphSnapshot | null;
  redo: () => GraphSnapshot | null;
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
      graphHistory: [],
      currentHistoryIndex: -1,

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
        const { graphHistory, currentHistoryIndex } = get();
        const newHistory = graphHistory.slice(0, currentHistoryIndex + 1);
        newHistory.push({
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        });
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        set({ graphHistory: newHistory, currentHistoryIndex: newHistory.length - 1 });
      },

      undo: () => {
        const { currentHistoryIndex, graphHistory } = get();
        if (currentHistoryIndex > 0) {
          const prev = graphHistory[currentHistoryIndex - 1];
          set({ currentHistoryIndex: currentHistoryIndex - 1 });
          return prev;
        }
        return null;
      },

      redo: () => {
        const { currentHistoryIndex, graphHistory } = get();
        if (currentHistoryIndex < graphHistory.length - 1) {
          const next = graphHistory[currentHistoryIndex + 1];
          set({ currentHistoryIndex: currentHistoryIndex + 1 });
          return next;
        }
        return null;
      },

      canUndo: () => get().currentHistoryIndex > 0,
      canRedo: () => get().currentHistoryIndex < get().graphHistory.length - 1,
    }),
    { name: 'workflow-store' }
  )
);
