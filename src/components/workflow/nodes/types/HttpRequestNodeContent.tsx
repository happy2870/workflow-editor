'use client';

import type { CommonNodeType, HttpRequestNodeData } from '@/types/workflow.types';

export default function HttpRequestNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<HttpRequestNodeData>;
  return (
    <div className="text-xs text-gray-500">
      <span className="font-medium">{nodeData.method || 'GET'}</span>
      {nodeData.url ? ` · ${nodeData.url.slice(0, 30)}${nodeData.url.length > 30 ? '...' : ''}` : ''}
    </div>
  );
}
