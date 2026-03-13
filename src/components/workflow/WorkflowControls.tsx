'use client';

import { useState } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import {
  RiSubtractLine,
  RiAddLine,
  RiCursorFill,
  RiHand,
  RiAlignItemLeftLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from '@remixicon/react';
import { useWorkflowStore } from '@/store/workflow.store';
import { useHistory } from '@/hooks/useHistory';
import { getLayoutedElements } from '@/utils/layout.util';

const ZOOM_PRESETS = [
  { label: '200%', value: 2 },
  { label: '100%', value: 1 },
  { label: '75%', value: 0.75 },
  { label: '50%', value: 0.5 },
];

export default function WorkflowControls() {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut, getViewport, setViewport, fitView, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);

  const controlMode = useWorkflowStore((s) => s.controlMode);
  const setControlMode = useWorkflowStore((s) => s.setControlMode);
  const { addToHistory, undo, redo, canUndo, canRedo } = useHistory();

  const changeZoom = (value: number) => {
    setViewport({ ...getViewport(), zoom: value });
    setZoomMenuOpen(false);
  };

  const handleFitView = () => {
    fitView();
    setZoomMenuOpen(false);
  };

  const handleAutoLayout = () => {
    addToHistory();
    const nodes = getNodes();
    const edges = getEdges();
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(nodes as any, edges as any);
    setNodes(layouted);
    setEdges(layoutedEdges);
  };

  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer';
  const btnDisabled = 'opacity-30 pointer-events-none';

  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-white rounded-xl shadow-md border border-gray-200 px-2 py-1.5">
      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <button className={btnBase} onClick={() => zoomOut()} title="축소">
          <RiSubtractLine size={16} className="text-gray-600" />
        </button>

        <div className="relative">
          <button
            className="min-w-[48px] h-8 px-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setZoomMenuOpen(!zoomMenuOpen)}
          >
            {(zoom * 100).toFixed(0)}%
          </button>
          {zoomMenuOpen && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
              {ZOOM_PRESETS.map((p) => (
                <button
                  key={p.value}
                  className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => changeZoom(p.value)}
                >
                  {p.label}
                </button>
              ))}
              <div className="border-t border-gray-100 my-1" />
              <button
                className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 text-left"
                onClick={handleFitView}
              >
                화면에 맞추기
              </button>
            </div>
          )}
        </div>

        <button className={btnBase} onClick={() => zoomIn()} title="확대">
          <RiAddLine size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Mode controls */}
      <div className="flex items-center gap-0.5">
        <button
          className={`${btnBase} ${controlMode === 'pointer' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setControlMode('pointer')}
          title="포인터 모드"
        >
          <RiCursorFill size={16} />
        </button>
        <button
          className={`${btnBase} ${controlMode === 'hand' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setControlMode('hand')}
          title="핸드 모드"
        >
          <RiHand size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Layout */}
      <button className={btnBase} onClick={handleAutoLayout} title="노드 정리">
        <RiAlignItemLeftLine size={16} className="text-gray-600" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <button
          className={`${btnBase} ${!canUndo() ? btnDisabled : ''}`}
          onClick={() => { if (canUndo()) undo(); }}
          title="실행 취소"
        >
          <RiArrowGoBackLine size={16} className="text-gray-600" />
        </button>
        <button
          className={`${btnBase} ${!canRedo() ? btnDisabled : ''}`}
          onClick={() => { if (canRedo()) redo(); }}
          title="다시 실행"
        >
          <RiArrowGoForwardLine size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
