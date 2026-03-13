'use client';

import type { CommonNodeType, TemplateTransformNodeData } from '@/types/workflow.types';

export default function TemplateTransformNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<TemplateTransformNodeData>;
  return nodeData.template ? (
    <div className="text-xs text-gray-500 truncate max-w-[180px]">{nodeData.template.slice(0, 50)}</div>
  ) : null;
}
