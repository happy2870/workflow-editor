'use client';

import type { CommonNodeType, ToolNodeData } from '@/types/workflow.types';

export default function ToolNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<ToolNodeData>;
  return (
    <div className="text-xs text-gray-500">
      {nodeData.tool_label || nodeData.tool_name || 'No tool selected'}
    </div>
  );
}
