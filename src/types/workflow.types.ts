import type { ReactNode } from 'react';
import type { Node as ReactFlowNode, Edge as ReactFlowEdge, Viewport } from '@xyflow/react';

// ===== Block Types =====
export enum BlockEnum {
  Start = 'start',
  End = 'end',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAggregator = 'variable-aggregator',
  Iteration = 'iteration',
  IterationStart = 'iteration-start',
  Answer = 'answer',
  LLM = 'llm',
  Tool = 'tool',
}

// ===== Node Running Status =====
export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Exception = 'exception',
}

// ===== Branch =====
export type Branch = {
  id: string;
  name: string;
};

// ===== Common Node Data =====
export type CommonNodeType<T = object> = {
  type: BlockEnum;
  title: string;
  desc: string;
  width?: number;
  height?: number;
  selected?: boolean;
  _connectedSourceHandleIds?: string[];
  _connectedTargetHandleIds?: string[];
  _targetBranches?: Branch[];
  _runningStatus?: NodeRunningStatus;
  _isCandidate?: boolean;
  _waitingRun?: boolean;
  isInIteration?: boolean;
  isIterationStart?: boolean;
  iteration_id?: string;
} & T;

// ===== Common Edge Data =====
export type CommonEdgeType = {
  _hovering?: boolean;
  _sourceRunningStatus?: NodeRunningStatus;
  _targetRunningStatus?: NodeRunningStatus;
  _waitingRun?: boolean;
  sourceType: BlockEnum;
  targetType: BlockEnum;
};

// ===== Typed Node and Edge =====
export type WorkflowNode<T = object> = ReactFlowNode<CommonNodeType<T>>;
export type WorkflowEdge = ReactFlowEdge<CommonEdgeType>;

// ===== Graph =====
export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: Viewport;
};

// ===== Node Extra Data (for node registry) =====
export type NodeExtraData = {
  title: string;
  icon: ReactNode;
  iconClass: string;
  description: string;
  availablePrevNodes: BlockEnum[];
  availableNextNodes: BlockEnum[];
};

// ===== Start Node =====
export type StartNodeData = {
  variables: InputVariable[];
};

export type InputVariable = {
  variable: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'paragraph';
  required: boolean;
  options?: string[];
  max_length?: number;
};

// ===== End Node =====
export type EndNodeData = {
  outputs: OutputVariable[];
};

export type OutputVariable = {
  variable: string;
  value_selector: string[];
};

// ===== IfElse Node =====
export type IfElseNodeData = {
  conditions: IfElseCondition[];
  logical_operator: 'and' | 'or';
};

export type IfElseCondition = {
  id: string;
  variable_selector: string[];
  comparison_operator: ComparisonOperator;
  value: string;
};

export enum ComparisonOperator {
  Equal = 'equal',
  NotEqual = 'not-equal',
  GreaterThan = 'greater-than',
  LessThan = 'less-than',
  GreaterThanOrEqual = 'greater-than-or-equal',
  LessThanOrEqual = 'less-than-or-equal',
  Contains = 'contains',
  NotContains = 'not-contains',
  StartsWith = 'starts-with',
  EndsWith = 'ends-with',
  IsEmpty = 'is-empty',
  IsNotEmpty = 'is-not-empty',
}

// ===== Code Node =====
export type CodeNodeData = {
  code: string;
  code_language: 'python3' | 'javascript';
  variables: CodeVariable[];
  outputs: Record<string, string>;
};

export type CodeVariable = {
  variable: string;
  value_selector: string[];
};

// ===== HTTP Request Node =====
export type HttpRequestNodeData = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  url: string;
  headers: KeyValue[];
  params: KeyValue[];
  body: {
    type: 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw-text' | 'json';
    data: string | KeyValue[];
  };
  timeout: number;
};

export type KeyValue = {
  id: string;
  key: string;
  value: string;
  type?: string;
};

// ===== Template Transform Node =====
export type TemplateTransformNodeData = {
  template: string;
  variables: CodeVariable[];
};

// ===== Iteration Node =====
export type IterationNodeData = {
  iterator_selector: string[];
  output_selector: string[];
  _children?: string[];
};

// ===== LLM Node =====
export type LLMNodeData = {
  model: {
    provider: string;
    name: string;
    mode: string;
    completion_params: Record<string, any>;
  };
  prompt_template: Array<{
    role: 'system' | 'user' | 'assistant';
    text: string;
  }>;
  variables: CodeVariable[];
};

// ===== Answer Node =====
export type AnswerNodeData = {
  answer: string;
  variables: CodeVariable[];
};

// ===== Tool Node =====
export type ToolNodeData = {
  provider_id: string;
  tool_name: string;
  tool_label: string;
  tool_parameters: Record<string, any>;
};

// ===== Variable Aggregator Node =====
export type VariableAggregatorNodeData = {
  variables: string[][];
  output_type: 'string' | 'number' | 'object' | 'array';
};

// ===== Note Node =====
export enum NoteTheme {
  Blue = 'blue',
  Cyan = 'cyan',
  Green = 'green',
  Yellow = 'yellow',
  Pink = 'pink',
  Violet = 'violet',
}

export type NoteNodeData = {
  text: string;
  theme: NoteTheme;
  showAuthor?: boolean;
  author?: string;
};
