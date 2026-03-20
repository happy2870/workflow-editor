'use client';

import React from 'react';
import { useWorkflowStore } from '@/store/workflow.store';
import { NODE_REGISTRY } from '@/constants/Workflowconstants';
import type { CommonNodeType } from '@/types/workflow.types';

export default function ConfigPanel() {
  const selectedNode = useWorkflowStore((s) => s.selectedNode);
  const panelOpen = useWorkflowStore((s) => s.panelOpen);
  const deselectNode = useWorkflowStore((s) => s.deselectNode);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  if (!panelOpen || !selectedNode) return null;

  const data = selectedNode.data as CommonNodeType;
  const nodeInfo = NODE_REGISTRY[data.type];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNode.id, { title: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(selectedNode.id, { desc: e.target.value });
  };

  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <div className="flex items-center gap-2">
          <div className={`workflow-node-icon ${nodeInfo?.iconClass || ''}`}>
            {nodeInfo?.icon || '?'}
          </div>
          <span className="font-semibold text-gray-800">{nodeInfo?.title}</span>
        </div>
        <button
          onClick={deselectNode}
          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={data.desc || ''}
            onChange={handleDescChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Node Info</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Type: <span className="font-medium">{data.type}</span></div>
            <div>ID: <span className="font-mono text-xs">{selectedNode.id}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
