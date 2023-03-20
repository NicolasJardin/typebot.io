import { z } from 'zod'
import { BubbleBlockType } from './bubbles/enums'
import { ChoiceInputBlock, choiceInputSchema } from './inputs/choice'
import { InputBlockType } from './inputs/enums'
import { IntegrationBlockType } from './integrations/enums'
import { ConditionBlock, conditionBlockSchema } from './logic/condition'
import { LogicBlockType } from './logic/enums'
import { blockBaseSchema } from './baseSchemas'
import { startBlockSchema } from './start/schemas'
import {
  textBubbleBlockSchema,
  imageBubbleBlockSchema,
  videoBubbleBlockSchema,
  embedBubbleBlockSchema,
  audioBubbleBlockSchema,
  buttonBlockSchema,
  ButtonBlock,
  ButtonOptions,
} from './bubbles'
import {
  textInputSchema,
  emailInputSchema,
  numberInputSchema,
  urlInputSchema,
  phoneNumberInputBlockSchema,
  dateInputSchema,
  paymentInputSchema,
  ratingInputBlockSchema,
  fileInputStepSchema,
} from './inputs'
import {
  chatwootBlockSchema,
  googleAnalyticsBlockSchema,
  googleSheetsBlockSchema,
  makeComBlockSchema,
  pabblyConnectBlockSchema,
  sendEmailBlockSchema,
  webhookBlockSchema,
  zapierBlockSchema,
} from './integrations'
import { openAIBlockSchema } from './integrations/openai'
import {
  scriptBlockSchema,
  redirectBlockSchema,
  setVariableBlockSchema,
  typebotLinkBlockSchema,
  waitBlockSchema,
  transferBlockSchema,
  removeTagBlockSchema,
  tagBlockSchema,
  waitForBlockSchema,
} from './logic'
import { jumpBlockSchema } from './logic/jump'
import { endBlockSchema } from './logic/end'
import { fileBubbleBlockSchema } from './bubbles/file'

export type DraggableBlock =
  | BubbleBlock
  | InputBlock
  | LogicBlock
  | IntegrationBlock

export type BlockType =
  | 'start'
  | BubbleBlockType
  | InputBlockType
  | LogicBlockType
  | IntegrationBlockType

export type DraggableBlockType =
  | BubbleBlockType
  | InputBlockType
  | LogicBlockType
  | IntegrationBlockType

export type BlockWithOptions =
  | InputBlock
  | Exclude<LogicBlock, ConditionBlock>
  | IntegrationBlock
  | ButtonBlock

export type BlockWithOptionsType =
  | InputBlockType
  | Exclude<LogicBlockType, LogicBlockType.CONDITION>
  | IntegrationBlockType

export type BlockOptions =
  | InputBlockOptions
  | LogicBlockOptions
  | IntegrationBlockOptions
  | ButtonOptions

export type BlockWithItems = ConditionBlock | ChoiceInputBlock

export type BlockBase = z.infer<typeof blockBaseSchema>

export type BlockIndices = {
  groupIndex: number
  blockIndex: number
}

const bubbleBlockSchema = z.discriminatedUnion('type', [
  textBubbleBlockSchema,
  imageBubbleBlockSchema,
  videoBubbleBlockSchema,
  embedBubbleBlockSchema,
  audioBubbleBlockSchema,
  buttonBlockSchema,
  fileBubbleBlockSchema,
])

export type BubbleBlock = z.infer<typeof bubbleBlockSchema>
//@ts-ignore
export type BubbleBlockContent = BubbleBlock['content']

export const inputBlockSchema = z.discriminatedUnion('type', [
  textInputSchema,
  choiceInputSchema,
  emailInputSchema,
  numberInputSchema,
  urlInputSchema,
  phoneNumberInputBlockSchema,
  dateInputSchema,
  paymentInputSchema,
  ratingInputBlockSchema,
  fileInputStepSchema,
  waitForBlockSchema,
])

export type InputBlock = z.infer<typeof inputBlockSchema>
export type InputBlockOptions = InputBlock['options']

export const logicBlockSchema = z.discriminatedUnion('type', [
  scriptBlockSchema,
  conditionBlockSchema,
  redirectBlockSchema,
  setVariableBlockSchema,
  typebotLinkBlockSchema,
  waitBlockSchema,
  jumpBlockSchema,
  transferBlockSchema,
  endBlockSchema,
  removeTagBlockSchema,
  tagBlockSchema,
])

export type LogicBlock = z.infer<typeof logicBlockSchema>

export type LogicBlockOptions = LogicBlock extends
  | {
      options?: infer Options
    }
  | {}
  ? Options
  : never

export const integrationBlockSchema = z.discriminatedUnion('type', [
  chatwootBlockSchema,
  googleAnalyticsBlockSchema,
  googleSheetsBlockSchema,
  makeComBlockSchema,
  openAIBlockSchema,
  pabblyConnectBlockSchema,
  sendEmailBlockSchema,
  webhookBlockSchema,
  zapierBlockSchema,
])

export type IntegrationBlock = z.infer<typeof integrationBlockSchema>
export type IntegrationBlockOptions = IntegrationBlock['options']

export const blockSchema = z.union([
  startBlockSchema,
  bubbleBlockSchema,
  inputBlockSchema,
  logicBlockSchema,
  integrationBlockSchema,
])

export type Block = z.infer<typeof blockSchema>
