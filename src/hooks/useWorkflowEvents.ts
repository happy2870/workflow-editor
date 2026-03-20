import { useCallback, useEffect, useState } from 'react';
import { addEdge, useReactFlow, type Connection } from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflow.store';
import { useHistory } from './useHistory';
import { NODE_REGISTRY, getDefaultNodeData } from '@/constants/Workflowconstants';
import { generateNodeId } from '@/utils/layout.util';
import { BlockEnum, NoteTheme, type CommonNodeType, type WorkflowNode } from '@/types/workflow.types';

export const CUSTOM_NOTE_NODE = 'custom-note';

export function useWorkflowEvents() {
  const { setEdges } = useReactFlow();
  const { addToHistory } = useHistory();

  const deselectNode = useWorkflowStore((s) => s.deselectNode);
  const setCandidateNode = useWorkflowStore((s) => s.setCandidateNode);
  const setMousePosition = useWorkflowStore((s) => s.setMousePosition);

  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });

  // Track mouse position for candidate node
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ pageX: e.pageX, pageY: e.pageY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);

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

  const onPaneClick = useCallback(
    (closeContextMenu?: () => void) => {
      deselectNode();
      setShowNodeSelector(false);
      closeContextMenu?.();
    },
    [deselectNode]
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, closeContextMenu?: () => void) => {
      event.preventDefault();
      closeContextMenu?.();
      setSelectorPosition({ x: event.clientX, y: event.clientY });
      setShowNodeSelector(true);
    },
    []
  );

  const addNode = useCallback(
    (type: BlockEnum) => {
      const nodeInfo = NODE_REGISTRY[type];
      const newNode: WorkflowNode = {
        id: generateNodeId(),
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          type,
          title: nodeInfo?.title || type,
          desc: '',
          _isCandidate: true,
          ...getDefaultNodeData(type),
        } as CommonNodeType,
      };
      setCandidateNode(newNode);
      setShowNodeSelector(false);
    },
    [setCandidateNode]
  );

  const addNoteNode = useCallback(() => {
    const newNode: WorkflowNode = {
      id: generateNodeId(),
      type: CUSTOM_NOTE_NODE,
      position: { x: 0, y: 0 },
      style: { width: 240, height: 100 },
      data: {
        type: BlockEnum.Start,
        title: 'Note',
        desc: '',
        text: '',
        theme: NoteTheme.Yellow,
        _isCandidate: true,
      } as CommonNodeType,
    };
    setCandidateNode(newNode);
    setShowNodeSelector(false);
  }, [setCandidateNode]);

  const onNodesDelete = useCallback(() => {
    addToHistory();
  }, [addToHistory]);

  const onEdgesDelete = useCallback(() => {
    addToHistory();
  }, [addToHistory]);

  return {
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
  };
}
