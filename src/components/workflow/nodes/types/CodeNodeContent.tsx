'use client';

import type { CommonNodeType, CodeNodeData } from '@/types/workflow.types';

export default function CodeNodeContent({ data }: { id: string; data: CommonNodeType }) {
  const nodeData = data as CommonNodeType<CodeNodeData>;
  return (
    <div className="text-xs text-gray-500">
      {nodeData.code_language === 'javascript' ? 'JavaScript' : 'Python'}
    </div>
  );
}
