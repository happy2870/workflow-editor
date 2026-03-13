import type { ComponentType } from 'react';
import { BlockEnum } from '@/types/workflow.types';
import StartNodeContent from './nodes/types/StartNodeContent';
import EndNodeContent from './nodes/types/EndNodeContent';
import IfElseNodeContent from './nodes/types/IfElseNodeContent';
import CodeNodeContent from './nodes/types/CodeNodeContent';
import HttpRequestNodeContent from './nodes/types/HttpRequestNodeContent';
import TemplateTransformNodeContent from './nodes/types/TemplateTransformNodeContent';
import VariableAggregatorNodeContent from './nodes/types/VariableAggregatorNodeContent';
import IterationNodeContent from './nodes/types/IterationNodeContent';
import LLMNodeContent from './nodes/types/LLMNodeContent';
import AnswerNodeContent from './nodes/types/AnswerNodeContent';
import ToolNodeContent from './nodes/types/ToolNodeContent';

type NodeContentProps = { id: string; data: any };

export const NODE_TYPE_COMPONENTS: Record<string, ComponentType<NodeContentProps>> = {
  [BlockEnum.Start]: StartNodeContent,
  [BlockEnum.End]: EndNodeContent,
  [BlockEnum.IfElse]: IfElseNodeContent,
  [BlockEnum.Code]: CodeNodeContent,
  [BlockEnum.HttpRequest]: HttpRequestNodeContent,
  [BlockEnum.TemplateTransform]: TemplateTransformNodeContent,
  [BlockEnum.VariableAggregator]: VariableAggregatorNodeContent,
  [BlockEnum.Iteration]: IterationNodeContent,
  [BlockEnum.LLM]: LLMNodeContent,
  [BlockEnum.Answer]: AnswerNodeContent,
  [BlockEnum.Tool]: ToolNodeContent,
};
