import { createId } from '@paralleldrive/cuid2'
import {
  blockTypeHasItems,
  blockTypeHasOption,
  isBubbleBlockType,
} from '@typebot.io/lib'
import {
  BlockOptions,
  BlockWithOptionsType,
  BubbleBlockContent,
  BubbleBlockType,
  DraggableBlock,
  DraggableBlockType,
  defaultAudioBubbleContent,
  defaultButtonBubbleContent,
  defaultChatwootOptions,
  defaultChoiceInputOptions,
  defaultConditionContent,
  defaultDateInputOptions,
  defaultEmailInputOptions,
  defaultEmbedBubbleContent,
  defaultFileInputOptions,
  defaultGoogleAnalyticsOptions,
  defaultGoogleSheetsOptions,
  defaultImageBubbleContent,
  defaultNumberInputOptions,
  defaultPaymentInputOptions,
  defaultPhoneInputOptions,
  defaultRatingInputOptions,
  defaultRedirectOptions,
  defaultRemoveTagOptions,
  defaultScriptOptions,
  defaultSendEmailOptions,
  defaultSetVariablesOptions,
  defaultSpreadOptions,
  defaultTagOptions,
  defaultTextBubbleContent,
  defaultTextInputOptions,
  defaultTransferOptions,
  defaultUrlInputOptions,
  defaultVideoBubbleContent,
  defaultWaitForOptions,
  defaultWaitOptions,
  defaultWebhookOptions,
  defaultTypebotLinkOptions,
  zemanticAiDefaultOptions,
  InputBlockType,
  LogicBlockType,
  BlockWithItems,
  Item,
  ItemType,
  defaultAbTestOptions,
  IntegrationBlockType,
} from '@typebot.io/schemas'
import { defaultFileBubbleContent } from '@typebot.io/schemas/features/blocks/bubbles/file'
import { defaultPictureChoiceOptions } from '@typebot.io/schemas/features/blocks/inputs/pictureChoice'

const parseDefaultItems = (
  type: BlockWithItems['type'],
  blockId: string
): Item[] => {
  switch (type) {
    case InputBlockType.CHOICE:
      return [{ id: createId(), blockId, type: ItemType.BUTTON }]
    case InputBlockType.PICTURE_CHOICE:
      return [{ id: createId(), blockId, type: ItemType.PICTURE_CHOICE }]
    case LogicBlockType.CONDITION:
      return [
        {
          id: createId(),
          blockId,
          type: ItemType.CONDITION,
          content: defaultConditionContent,
        },
      ]
    case LogicBlockType.AB_TEST:
      return [
        { id: createId(), blockId, type: ItemType.AB_TEST, path: 'a' },
        { id: createId(), blockId, type: ItemType.AB_TEST, path: 'b' },
      ]
  }
}

const parseDefaultContent = (type: BubbleBlockType): BubbleBlockContent => {
  switch (type) {
    case BubbleBlockType.TEXT:
      return defaultTextBubbleContent
    case BubbleBlockType.IMAGE:
      return defaultImageBubbleContent
    case BubbleBlockType.VIDEO:
      return defaultVideoBubbleContent
    case BubbleBlockType.EMBED:
      return defaultEmbedBubbleContent
    case BubbleBlockType.AUDIO:
      return defaultAudioBubbleContent
    case BubbleBlockType.FILE:
      return defaultFileBubbleContent
    case BubbleBlockType.BUTTON:
      return defaultButtonBubbleContent
  }
}

const parseDefaultBlockOptions = (type: BlockWithOptionsType): BlockOptions => {
  switch (type) {
    case InputBlockType.TEXT:
      return defaultTextInputOptions
    case InputBlockType.NUMBER:
      return defaultNumberInputOptions
    case InputBlockType.EMAIL:
      return defaultEmailInputOptions
    case InputBlockType.DATE:
      return defaultDateInputOptions
    case InputBlockType.PHONE:
      return defaultPhoneInputOptions
    case InputBlockType.URL:
      return defaultUrlInputOptions
    case InputBlockType.CHOICE:
      return defaultChoiceInputOptions
    case InputBlockType.PICTURE_CHOICE:
      return defaultPictureChoiceOptions
    case InputBlockType.PAYMENT:
      return defaultPaymentInputOptions
    case InputBlockType.RATING:
      return defaultRatingInputOptions
    case InputBlockType.FILE:
      return defaultFileInputOptions
    case InputBlockType.WAIT_FOR:
      return defaultWaitForOptions
    case LogicBlockType.SET_VARIABLE:
      return defaultSetVariablesOptions
    case LogicBlockType.REDIRECT:
      return defaultRedirectOptions
    case LogicBlockType.SCRIPT:
      return defaultScriptOptions
    case LogicBlockType.WAIT:
      return defaultWaitOptions
    case LogicBlockType.END:
      return {}
    case LogicBlockType.REMOVE_TAG:
      return defaultRemoveTagOptions
    case LogicBlockType.TAG:
      return defaultTagOptions
    case LogicBlockType.TRANSFER:
      return defaultTransferOptions
    case LogicBlockType.SPREAD:
      return defaultSpreadOptions
    case LogicBlockType.JUMP:
      return {}
    case LogicBlockType.TYPEBOT_LINK:
      return defaultTypebotLinkOptions
    case LogicBlockType.AB_TEST:
      return defaultAbTestOptions
    case IntegrationBlockType.GOOGLE_SHEETS:
      return defaultGoogleSheetsOptions
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return defaultGoogleAnalyticsOptions
    case IntegrationBlockType.ZAPIER:
    case IntegrationBlockType.PABBLY_CONNECT:
    case IntegrationBlockType.MAKE_COM:
    case IntegrationBlockType.WEBHOOK:
      return defaultWebhookOptions(createId())
    case IntegrationBlockType.EMAIL:
      return defaultSendEmailOptions
    case IntegrationBlockType.CHATWOOT:
      return defaultChatwootOptions
    case IntegrationBlockType.OPEN_AI:
      return {}
    case IntegrationBlockType.PIXEL:
      return {}
    case IntegrationBlockType.ZEMANTIC_AI:
      return zemanticAiDefaultOptions
  }

  return {}
}

export const parseNewBlock = (
  type: DraggableBlockType,
  groupId: string
): DraggableBlock => {
  const id = createId()
  return {
    id,
    groupId,
    type,
    content:
      isBubbleBlockType(type) && type !== BubbleBlockType.BUTTON
        ? parseDefaultContent(type)
        : undefined,
    options: blockTypeHasOption(type)
      ? parseDefaultBlockOptions(type)
      : undefined,
    items: blockTypeHasItems(type) ? parseDefaultItems(type, id) : undefined,
  } as DraggableBlock
}
