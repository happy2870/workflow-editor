'use client';

import type { CommonNodeType, IterationNodeData } from '@/types/workflow.types';

export default function IterationNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<IterationNodeData>;
  return (
    <div className="text-xs text-gray-500">
      {nodeData.iterator_selector?.length ? 'Iterator set' : 'No iterator'}
    </div>
  );
}
