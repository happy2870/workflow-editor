import dagre from 'dagre';
import { NODE_WIDTH, NODE_HEIGHT } from '@/constants/Workflowconstants';
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow.types';

export function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.data.width || NODE_WIDTH,
      height: node.data.height || NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const w = node.data.width || NODE_WIDTH;
    const h = node.data.height || NODE_HEIGHT;
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - w / 2,
        y: nodeWithPosition.y - h / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
