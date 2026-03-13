'use client';

import type { CommonNodeType, AnswerNodeData } from '@/types/workflow.types';

export default function AnswerNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<AnswerNodeData>;
  return nodeData.answer ? (
    <div className="text-xs text-gray-500 truncate max-w-[180px]">{nodeData.answer.slice(0, 50)}</div>
  ) : null;
}
