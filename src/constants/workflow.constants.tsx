import {
  RiPlayFill,
  RiStopFill,
  RiRobot2Line,
  RiGitBranchLine,
  RiCodeSSlashLine,
  RiGlobalLine,
  RiFileTextLine,
  RiStackLine,
  RiLoopLeftLine,
  RiArrowRightLine,
  RiChat3Line,
  RiToolsLine,
} from '@remixicon/react';
import { BlockEnum, type NodeExtraData } from '@/types/workflow.types';

export const ALL_BLOCK_TYPES = Object.values(BlockEnum).filter(
  (v) => v !== BlockEnum.IterationStart
);

const COMMON_NODES: BlockEnum[] = [
  BlockEnum.End, BlockEnum.Answer, BlockEnum.LLM, BlockEnum.IfElse,
  BlockEnum.Code, BlockEnum.HttpRequest, BlockEnum.TemplateTransform,
  BlockEnum.VariableAggregator, BlockEnum.Iteration, BlockEnum.Tool,
];

const COMMON_PREV: BlockEnum[] = [
  BlockEnum.Start, BlockEnum.LLM, BlockEnum.IfElse, BlockEnum.Code,
  BlockEnum.HttpRequest, BlockEnum.TemplateTransform, BlockEnum.VariableAggregator,
  BlockEnum.Iteration, BlockEnum.Tool,
];

const ICON_SIZE = 16;

export const NODE_REGISTRY: Record<BlockEnum, NodeExtraData> = {
  [BlockEnum.Start]: {
    title: 'Start',
    icon: <RiPlayFill size={ICON_SIZE} />,
    iconClass: 'start',
    description: 'Workflow entry point',
    availablePrevNodes: [],
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.End]: {
    title: 'End',
    icon: <RiStopFill size={ICON_SIZE} />,
    iconClass: 'end',
    description: 'Workflow termination',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: [],
  },
  [BlockEnum.LLM]: {
    title: 'LLM',
    icon: <RiRobot2Line size={ICON_SIZE} />,
    iconClass: 'llm',
    description: 'Language model call',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.IfElse]: {
    title: 'Condition',
    icon: <RiGitBranchLine size={ICON_SIZE} />,
    iconClass: 'if-else',
    description: 'Conditional branching',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.Code]: {
    title: 'Code',
    icon: <RiCodeSSlashLine size={ICON_SIZE} />,
    iconClass: 'code',
    description: 'Execute code',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.HttpRequest]: {
    title: 'HTTP Request',
    icon: <RiGlobalLine size={ICON_SIZE} />,
    iconClass: 'http-request',
    description: 'Make API calls',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.TemplateTransform]: {
    title: 'Template',
    icon: <RiFileTextLine size={ICON_SIZE} />,
    iconClass: 'template-transform',
    description: 'Transform with template',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.VariableAggregator]: {
    title: 'Variable Aggregator',
    icon: <RiStackLine size={ICON_SIZE} />,
    iconClass: 'variable-aggregator',
    description: 'Aggregate variables',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.Iteration]: {
    title: 'Iteration',
    icon: <RiLoopLeftLine size={ICON_SIZE} />,
    iconClass: 'iteration',
    description: 'Loop over items',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.IterationStart]: {
    title: 'Iteration Start',
    icon: <RiArrowRightLine size={ICON_SIZE} />,
    iconClass: 'iteration',
    description: 'Iteration entry',
    availablePrevNodes: [],
    availableNextNodes: [
      BlockEnum.LLM, BlockEnum.IfElse, BlockEnum.Code,
      BlockEnum.HttpRequest, BlockEnum.TemplateTransform,
      BlockEnum.VariableAggregator, BlockEnum.Tool,
    ],
  },
  [BlockEnum.Answer]: {
    title: 'Answer',
    icon: <RiChat3Line size={ICON_SIZE} />,
    iconClass: 'answer',
    description: 'Output response',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
  [BlockEnum.Tool]: {
    title: 'Tool',
    icon: <RiToolsLine size={ICON_SIZE} />,
    iconClass: 'tool',
    description: 'External tool',
    availablePrevNodes: COMMON_PREV,
    availableNextNodes: COMMON_NODES,
  },
};

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 80;

export function getDefaultNodeData(type: BlockEnum): Record<string, any> {
  switch (type) {
    case BlockEnum.Start:
      return { variables: [] };
    case BlockEnum.End:
      return { outputs: [] };
    case BlockEnum.IfElse:
      return {
        conditions: [],
        logical_operator: 'and',
        _targetBranches: [
          { id: 'true', name: 'True' },
          { id: 'false', name: 'False' },
        ],
      };
    case BlockEnum.Code:
      return {
        code: '# Write your code here\ndef main(args):\n    return {"result": "hello"}',
        code_language: 'python3',
        variables: [],
        outputs: { result: 'string' },
      };
    case BlockEnum.HttpRequest:
      return {
        method: 'GET', url: '', headers: [], params: [],
        body: { type: 'none', data: '' }, timeout: 10,
      };
    case BlockEnum.TemplateTransform:
      return { template: '', variables: [] };
    case BlockEnum.VariableAggregator:
      return { variables: [], output_type: 'string' };
    case BlockEnum.Iteration:
      return { iterator_selector: [], output_selector: [], _children: [] };
    case BlockEnum.LLM:
      return {
        model: { provider: '', name: '', mode: 'chat', completion_params: {} },
        prompt_template: [{ role: 'system', text: '' }],
        variables: [],
      };
    case BlockEnum.Answer:
      return { answer: '', variables: [] };
    case BlockEnum.Tool:
      return { provider_id: '', tool_name: '', tool_label: '', tool_parameters: {} };
    default:
      return {};
  }
}
