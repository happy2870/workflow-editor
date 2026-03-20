import { useCallback, useState } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';

export function useNodeContextMenu() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const { setNodes } = useReactFlow();

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === node.id })));
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
    },
    [setNodes]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return { contextMenu, onNodeContextMenu, closeContextMenu };
}
