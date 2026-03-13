'use client';

import type { CommonNodeType, IfElseNodeData } from '@/types/workflow.types';

export default function IfElseNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<IfElseNodeData>;
  const condCount = nodeData.conditions?.length || 0;
  return (
    <div className="text-xs text-gray-500">
      {condCount > 0 ? `${condCount} condition${condCount > 1 ? 's' : ''} · ${nodeData.logical_operator?.toUpperCase()}` : 'No conditions'}
    </div>
  );
}
