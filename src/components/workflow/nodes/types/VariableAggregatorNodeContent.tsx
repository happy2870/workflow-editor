'use client';

import type { CommonNodeType, VariableAggregatorNodeData } from '@/types/workflow.types';

export default function VariableAggregatorNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<VariableAggregatorNodeData>;
  const varCount = nodeData.variables?.length || 0;
  return (
    <div className="text-xs text-gray-500">
      {varCount} source{varCount !== 1 ? 's' : ''} → {nodeData.output_type || 'string'}
    </div>
  );
}
