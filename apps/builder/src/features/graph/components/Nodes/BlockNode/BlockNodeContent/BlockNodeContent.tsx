import { AudioBubbleNode } from '@/features/blocks/bubbles/audio'
import ButtonNodeContent from '@/features/blocks/bubbles/button/components/ButtonNodeContent'
import { EmbedBubbleContent } from '@/features/blocks/bubbles/embed'
import FileNodeContent from '@/features/blocks/bubbles/file/components/FileNodeContent'
import { ImageBubbleContent } from '@/features/blocks/bubbles/image'
import { TextBubbleContent } from '@/features/blocks/bubbles/textBubble'
import { VideoBubbleContent } from '@/features/blocks/bubbles/video'
import { DateNodeContent } from '@/features/blocks/inputs/date'
import { EmailInputNodeContent } from '@/features/blocks/inputs/emailInput'
import { FileInputContent } from '@/features/blocks/inputs/fileUpload'
import { NumberNodeContent } from '@/features/blocks/inputs/number'
import { PaymentInputContent } from '@/features/blocks/inputs/payment'
import { PhoneNodeContent } from '@/features/blocks/inputs/phone'
import { RatingInputContent } from '@/features/blocks/inputs/rating'
import { TextInputNodeContent } from '@/features/blocks/inputs/textInput'
import { UrlNodeContent } from '@/features/blocks/inputs/url'
import { ChatwootBlockNodeLabel } from '@/features/blocks/integrations/chatwoot'
import { GoogleAnalyticsNodeContent } from '@/features/blocks/integrations/googleAnalytics/components/GoogleAnalyticsNodeContent'
import { GoogleSheetsNodeContent } from '@/features/blocks/integrations/googleSheets'
import { MakeComContent } from '@/features/blocks/integrations/makeCom'
import { PabblyConnectContent } from '@/features/blocks/integrations/pabbly'
import { SendEmailContent } from '@/features/blocks/integrations/sendEmail'
import { WebhookContent } from '@/features/blocks/integrations/webhook'
import { ZapierContent } from '@/features/blocks/integrations/zapier'
import EndNodeContent from '@/features/blocks/logic/end/components/EndNodeContent'
import { RedirectNodeContent } from '@/features/blocks/logic/redirect'
import RemoveTagNodeContent from '@/features/blocks/logic/removeTag/components/RemoveTagNodeContent'
import { ScriptNodeContent } from '@/features/blocks/logic/script/components/ScriptNodeContent'
import { SetVariableContent } from '@/features/blocks/logic/setVariable'
import TagNodeContent from '@/features/blocks/logic/tag/components/TagNodeContent'
import TransferNodeContent from '@/features/blocks/logic/transfer/components/TransferNodeContent'
import { TypebotLinkNode } from '@/features/blocks/logic/typebotLink'
import { WaitNodeContent } from '@/features/blocks/logic/wait/components/WaitNodeContent'
import WaitForNodeContent from '@/features/blocks/logic/waitFor/components/WaitForNodeContent'
import { Text } from '@chakra-ui/react'
import {
  Block,
  BlockIndices,
  BubbleBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
  StartBlock,
} from 'models'
import { blockHasItems, isChoiceInput, isInputBlock } from 'utils'
import { ItemNodesList } from '../../ItemNode'
import { WithVariableContent } from './WithVariableContent'

type Props = {
  block: Block | StartBlock
  indices: BlockIndices
}
export const BlockNodeContent = ({ block, indices }: Props): JSX.Element => {
  if (blockHasItems(block))
    return <ItemNodesList block={block} indices={indices} />

  if (
    isInputBlock(block) &&
    !isChoiceInput(block) &&
    block.options.variableId
  ) {
    return <WithVariableContent block={block} />
  }

  switch (block.type) {
    case BubbleBlockType.TEXT: {
      return <TextBubbleContent block={block} />
    }
    case BubbleBlockType.IMAGE: {
      return <ImageBubbleContent block={block} />
    }
    case BubbleBlockType.VIDEO: {
      return <VideoBubbleContent block={block} />
    }
    case BubbleBlockType.EMBED: {
      return <EmbedBubbleContent block={block} />
    }
    case BubbleBlockType.AUDIO: {
      return <AudioBubbleNode url={block.content.url} />
    }
    case BubbleBlockType.BUTTON:
      return <ButtonNodeContent options={block.options} />

    case BubbleBlockType.FILE:
      return <FileNodeContent content={block.content} />

    case InputBlockType.TEXT: {
      return (
        <TextInputNodeContent
          placeholder={block.options.labels.placeholder}
          isLong={block.options.isLong}
        />
      )
    }
    case InputBlockType.NUMBER: {
      return (
        <NumberNodeContent placeholder={block.options.labels.placeholder} />
      )
    }
    case InputBlockType.EMAIL: {
      return (
        <EmailInputNodeContent placeholder={block.options.labels.placeholder} />
      )
    }
    case InputBlockType.URL: {
      return <UrlNodeContent placeholder={block.options.labels.placeholder} />
    }
    case InputBlockType.PHONE: {
      return <PhoneNodeContent placeholder={block.options.labels.placeholder} />
    }
    case InputBlockType.DATE: {
      return <DateNodeContent />
    }
    case InputBlockType.PAYMENT: {
      return <PaymentInputContent block={block} />
    }
    case InputBlockType.RATING: {
      return <RatingInputContent block={block} />
    }
    case InputBlockType.FILE: {
      return <FileInputContent options={block.options} />
    }
    case LogicBlockType.SET_VARIABLE: {
      return <SetVariableContent block={block} />
    }
    case LogicBlockType.REDIRECT: {
      return <RedirectNodeContent url={block.options.url} />
    }
    case LogicBlockType.SCRIPT: {
      return (
        <ScriptNodeContent
          name={block.options.name}
          content={block.options.content}
        />
      )
    }
    case LogicBlockType.WAIT:
      return <WaitNodeContent options={block.options} />

    case LogicBlockType.WAIT_FOR:
      return <WaitForNodeContent options={block.options} />

    case LogicBlockType.TRANSFER:
      return <TransferNodeContent options={block.options} />

    case LogicBlockType.TAG:
      return <TagNodeContent options={block.options} />

    case LogicBlockType.REMOVE_TAG:
      return <RemoveTagNodeContent options={block.options} />

    case LogicBlockType.TYPEBOT_LINK:
      return <TypebotLinkNode block={block} />

    case LogicBlockType.END:
      return <EndNodeContent />

    case IntegrationBlockType.GOOGLE_SHEETS: {
      return (
        <GoogleSheetsNodeContent
          action={'action' in block.options ? block.options.action : undefined}
        />
      )
    }
    case IntegrationBlockType.GOOGLE_ANALYTICS: {
      return (
        <GoogleAnalyticsNodeContent
          action={
            block.options?.action
              ? `Track "${block.options?.action}" `
              : undefined
          }
        />
      )
    }
    case IntegrationBlockType.WEBHOOK: {
      return <WebhookContent block={block} />
    }
    case IntegrationBlockType.ZAPIER: {
      return <ZapierContent block={block} />
    }
    case IntegrationBlockType.PABBLY_CONNECT: {
      return <PabblyConnectContent block={block} />
    }
    case IntegrationBlockType.MAKE_COM: {
      return <MakeComContent block={block} />
    }
    case IntegrationBlockType.EMAIL: {
      return <SendEmailContent block={block} />
    }
    case IntegrationBlockType.CHATWOOT: {
      return <ChatwootBlockNodeLabel block={block} />
    }
    case 'start': {
      return <Text>Início</Text>
    }
  }
}
