import { z } from 'zod'
import { Item } from '../items'
import { blockBaseSchema } from './baseSchemas'
import {
  ButtonOptions,
  audioBubbleBlockSchema,
  buttonBlockSchema,
  embedBubbleBlockSchema,
  imageBubbleBlockSchema,
  textBubbleBlockSchema,
  videoBubbleBlockSchema,
} from './bubbles'
import { BubbleBlockType } from './bubbles/enums'
import { fileBubbleBlockSchema } from './bubbles/file'
import {
  dateInputSchema,
  emailInputSchema,
  fileInputStepSchema,
  numberInputSchema,
  paymentInputSchema,
  phoneNumberInputBlockSchema,
  ratingInputBlockSchema,
  textInputSchema,
  urlInputSchema,
} from './inputs'
import { choiceInputSchema } from './inputs/choice'
import { InputBlockType } from './inputs/enums'
import { pictureChoiceBlockSchema } from './inputs/pictureChoice'
import {
  chatwootBlockSchema,
  googleAnalyticsBlockSchema,
  googleSheetsBlockSchema,
  makeComBlockSchema,
  pabblyConnectBlockSchema,
  pixelBlockSchema,
  sendEmailBlockSchema,
  webhookBlockSchema,
  zapierBlockSchema,
} from './integrations'
import { IntegrationBlockType } from './integrations/enums'
import { openAIBlockSchema } from './integrations/openai'
import {
  abTestBlockSchema,
  redirectBlockSchema,
  removeTagBlockSchema,
  scriptBlockSchema,
  setVariableBlockSchema,
  spreadBlockSchema,
  templateBlockSchema,
  tagBlockSchema,
  transferBlockSchema,
  typebotLinkBlockSchema,
  waitBlockSchema,
  waitForBlockSchema,
  updateNameBlockSchema,
  sendFromBlockSchema,
} from './logic'
import { conditionBlockSchema } from './logic/condition'
import { endBlockSchema } from './logic/end'
import { LogicBlockType } from './logic/enums'
import { jumpBlockSchema } from './logic/jump'
import { startBlockSchema } from './start/schemas'

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

export type BlockWithOptions = Extract<Block, { options: any }>

export type BlockWithOptionsType =
  | InputBlockType
  | Exclude<LogicBlockType, LogicBlockType.CONDITION>
  | IntegrationBlockType
  | Partial<BubbleBlockType>

export type BlockOptions =
  | InputBlockOptions
  | LogicBlockOptions
  | IntegrationBlockOptions
  | ButtonOptions

export type BlockBase = z.infer<typeof blockBaseSchema>

export type BlockIndices = {
  groupIndex: number
  blockIndex: number
}

export const inputBlockSchemas = [
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
  pictureChoiceBlockSchema,
  waitForBlockSchema,
] as const

export const blockSchema = z.discriminatedUnion('type', [
  startBlockSchema,
  textBubbleBlockSchema,
  imageBubbleBlockSchema,
  videoBubbleBlockSchema,
  embedBubbleBlockSchema,
  audioBubbleBlockSchema,
  ...inputBlockSchemas,
  scriptBlockSchema,
  conditionBlockSchema,
  redirectBlockSchema,
  setVariableBlockSchema,
  typebotLinkBlockSchema,
  waitBlockSchema,
  jumpBlockSchema,
  abTestBlockSchema,
  chatwootBlockSchema,
  googleAnalyticsBlockSchema,
  googleSheetsBlockSchema,
  makeComBlockSchema,
  openAIBlockSchema,
  pabblyConnectBlockSchema,
  sendEmailBlockSchema,
  webhookBlockSchema,
  zapierBlockSchema,
  transferBlockSchema,
  tagBlockSchema,
  updateNameBlockSchema,
  sendFromBlockSchema,
  spreadBlockSchema,
  templateBlockSchema,
  fileBubbleBlockSchema,
  removeTagBlockSchema,
  endBlockSchema,
  buttonBlockSchema,
  pixelBlockSchema,
])

export type Block = z.infer<typeof blockSchema>

export type BubbleBlock = Extract<Block, { type: BubbleBlockType }>
//@ts-ignore
export type BubbleBlockContent = BubbleBlock['content']

export type InputBlock = Extract<Block, { type: InputBlockType }>
export type InputBlockOptions = InputBlock['options']

export type LogicBlock = Extract<Block, { type: LogicBlockType }>
export type LogicBlockOptions = LogicBlock extends
  | {
      options?: infer Options
    }
  | {}
  ? Options
  : never

export type IntegrationBlock = Extract<Block, { type: IntegrationBlockType }>
export type IntegrationBlockOptions = IntegrationBlock['options']

export type BlockWithItems = Extract<Block, { items: Item[] }>
