'use client';

import type { CommonNodeType, LLMNodeData } from '@/types/workflow.types';

export default function LLMNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<LLMNodeData>;
  const model = nodeData.model;
  return (
    <div className="text-xs text-gray-500">
      {model?.name || 'No model selected'}
    </div>
  );
}
