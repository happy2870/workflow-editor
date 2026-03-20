import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow.store';
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow.types';

export function useHistory() {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const addToHistoryStore = useWorkflowStore((s) => s.addToHistory);
  const undoStore = useWorkflowStore((s) => s.undo);
  const redoStore = useWorkflowStore((s) => s.redo);
  const canUndo = useWorkflowStore((s) => s.canUndo);
  const canRedo = useWorkflowStore((s) => s.canRedo);

  const addToHistory = useCallback(() => {
    const nodes = getNodes() as WorkflowNode[];
    const edges = getEdges() as WorkflowEdge[];
    addToHistoryStore(nodes, edges);
  }, [getNodes, getEdges, addToHistoryStore]);

  const undo = useCallback(() => {
    const nodes = getNodes() as WorkflowNode[];
    const edges = getEdges() as WorkflowEdge[];
    const snapshot = undoStore(nodes, edges);
    if (snapshot) {
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
    }
  }, [getNodes, getEdges, undoStore, setNodes, setEdges]);

  const redo = useCallback(() => {
    const nodes = getNodes() as WorkflowNode[];
    const edges = getEdges() as WorkflowEdge[];
    const snapshot = redoStore(nodes, edges);
    if (snapshot) {
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
    }
  }, [getNodes, getEdges, redoStore, setNodes, setEdges]);

  return { addToHistory, undo, redo, canUndo, canRedo };
}
