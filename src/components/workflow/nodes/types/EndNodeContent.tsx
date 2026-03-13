'use client';

import type { CommonNodeType, EndNodeData } from '@/types/workflow.types';

export default function EndNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<EndNodeData>;
  const outCount = nodeData.outputs?.length || 0;
  return outCount > 0 ? (
    <div className="text-xs text-gray-500">{outCount} output{outCount > 1 ? 's' : ''}</div>
  ) : null;
}
