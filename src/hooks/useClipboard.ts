import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useHistory } from './useHistory';
import { useWorkflowStore } from '@/store/workflow.store';
import { generateNodeId } from '@/utils/layout.util';
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow.types';

export function useClipboard() {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const { addToHistory } = useHistory();
  const setCandidateNode = useWorkflowStore((s) => s.setCandidateNode);
  const clipboardRef = useRef<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] } | null>(null);

  const copy = useCallback(() => {
    const allNodes = getNodes() as WorkflowNode[];
    const allEdges = getEdges() as WorkflowEdge[];
    const selectedNodes = allNodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;

    const selectedIds = new Set(selectedNodes.map((n) => n.id));
    const selectedEdges = allEdges.filter(
      (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    clipboardRef.current = {
      nodes: JSON.parse(JSON.stringify(selectedNodes)),
      edges: JSON.parse(JSON.stringify(selectedEdges)),
    };
  }, [getNodes, getEdges]);

  const paste = useCallback(() => {
    if (!clipboardRef.current || clipboardRef.current.nodes.length === 0) return;
    addToHistory();

    const { nodes: copiedNodes, edges: copiedEdges } = clipboardRef.current;
    const idMap = new Map<string, string>();
    const offset = 50;

    const newNodes = copiedNodes.map((node) => {
      const newId = generateNodeId();
      idMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        position: { x: node.position.x + offset, y: node.position.y + offset },
        selected: true,
        data: { ...node.data, title: `${node.data.title} (copy)` },
      };
    });

    const newEdges = copiedEdges.map((edge) => ({
      ...edge,
      id: `edge-${idMap.get(edge.source)}-${idMap.get(edge.target)}`,
      source: idMap.get(edge.source)!,
      sourceHandle: edge.sourceHandle?.replace(edge.source, idMap.get(edge.source)!),
      target: idMap.get(edge.target)!,
      targetHandle: edge.targetHandle?.replace(edge.target, idMap.get(edge.target)!),
    }));

    setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);

    clipboardRef.current = {
      nodes: JSON.parse(JSON.stringify(newNodes)),
      edges: JSON.parse(JSON.stringify(newEdges)),
    };
  }, [addToHistory, setNodes, setEdges]);

  const duplicate = useCallback(() => {
    const allNodes = getNodes() as WorkflowNode[];
    const selectedNodes = allNodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;

    // Take first selected node, create candidate clone
    const node = selectedNodes[0];
    const newNode: WorkflowNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: generateNodeId(),
      position: { x: 0, y: 0 },
      selected: false,
      data: {
        ...node.data,
        title: `${node.data.title} (copy)`,
        _isCandidate: true,
      },
    };
    setCandidateNode(newNode);
  }, [getNodes, setCandidateNode]);

  const deleteSelected = useCallback(() => {
    const allNodes = getNodes() as WorkflowNode[];
    const selectedNodes = allNodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;
    addToHistory();

    const selectedIds = new Set(selectedNodes.map((n) => n.id));
    setNodes((nds) => nds.filter((n) => !selectedIds.has(n.id)));
    setEdges((eds) => eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)));
  }, [getNodes, addToHistory, setNodes, setEdges]);

  return { copy, paste, duplicate, deleteSelected };
}
