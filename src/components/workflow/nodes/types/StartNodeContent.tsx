'use client';

import type { CommonNodeType, StartNodeData } from '@/types/workflow.types';

export default function StartNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<StartNodeData>;
  const varCount = nodeData.variables?.length || 0;
  return varCount > 0 ? (
    <div className="text-xs text-gray-500">{varCount} variable{varCount > 1 ? 's' : ''}</div>
  ) : null;
}
