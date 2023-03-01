import { FlagIcon } from '@/components/icons'
import { EmbedBubbleIcon } from '@/features/blocks/bubbles/embed'
import { ImageBubbleIcon } from '@/features/blocks/bubbles/image'
import { TextBubbleIcon } from '@/features/blocks/bubbles/textBubble'
import { VideoBubbleIcon } from '@/features/blocks/bubbles/video'
import { ButtonsInputIcon } from '@/features/blocks/inputs/buttons'
import { DateInputIcon } from '@/features/blocks/inputs/date'
import { EmailInputIcon } from '@/features/blocks/inputs/emailInput'
import { FileInputIcon } from '@/features/blocks/inputs/fileUpload'
import { NumberInputIcon } from '@/features/blocks/inputs/number'
import { PaymentInputIcon } from '@/features/blocks/inputs/payment'
import { PhoneInputIcon } from '@/features/blocks/inputs/phone'
import { RatingInputIcon } from '@/features/blocks/inputs/rating'
import { TextInputIcon } from '@/features/blocks/inputs/textInput'
import { UrlInputIcon } from '@/features/blocks/inputs/url'
import { ChatwootLogo } from '@/features/blocks/integrations/chatwoot'
import { GoogleAnalyticsLogo } from '@/features/blocks/integrations/googleAnalytics'
import { GoogleSheetsLogo } from '@/features/blocks/integrations/googleSheets'
import { MakeComLogo } from '@/features/blocks/integrations/makeCom'
import { PabblyConnectLogo } from '@/features/blocks/integrations/pabbly'
import { SendEmailIcon } from '@/features/blocks/integrations/sendEmail'
import { WebhookIcon } from '@/features/blocks/integrations/webhook'
import { ZapierLogo } from '@/features/blocks/integrations/zapier'
import { ConditionIcon } from '@/features/blocks/logic/condition'
import { RedirectIcon } from '@/features/blocks/logic/redirect'
import { ScriptIcon } from '@/features/blocks/logic/script/components/ScriptIcon'
import { SetVariableIcon } from '@/features/blocks/logic/setVariable'
import { TypebotLinkIcon } from '@/features/blocks/logic/typebotLink'
import { WaitIcon } from '@/features/blocks/logic/wait/components/WaitIcon'
import { Icon, IconProps, useColorModeValue } from '@chakra-ui/react'
import {
  BlockType,
  BubbleBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
} from 'models'
import { AiOutlineDelete, AiOutlineTag } from 'react-icons/ai'
import { BiShuffle } from 'react-icons/bi'
import { BsDoorClosed } from 'react-icons/bs'
import { FaRegHandPointUp } from 'react-icons/fa'
import { TbFiles } from 'react-icons/tb'

type BlockIconProps = { type: BlockType } & IconProps

export const BlockIcon = ({ type, ...props }: BlockIconProps) => {
  const blue = useColorModeValue('blue.500', 'blue.300')
  const orange = useColorModeValue('orange.500', 'orange.300')
  const purple = useColorModeValue('purple.500', 'purple.300')
  switch (type) {
    case BubbleBlockType.TEXT:
      return <TextBubbleIcon color={blue} {...props} />
    case BubbleBlockType.IMAGE:
      return <ImageBubbleIcon color={blue} {...props} />
    case BubbleBlockType.VIDEO:
      return <VideoBubbleIcon color={blue} {...props} />
    case BubbleBlockType.EMBED:
      return <EmbedBubbleIcon color={blue} {...props} />
    case BubbleBlockType.AUDIO:
      return <EmbedBubbleIcon color={blue} {...props} />
    case BubbleBlockType.BUTTON:
      return <Icon as={FaRegHandPointUp} color={blue} {...props} />
    case BubbleBlockType.FILE:
      return <Icon as={TbFiles} color={blue} {...props} />
    case InputBlockType.TEXT:
      return <TextInputIcon color={orange} {...props} />
    case InputBlockType.NUMBER:
      return <NumberInputIcon color={orange} {...props} />
    case InputBlockType.EMAIL:
      return <EmailInputIcon color={orange} {...props} />
    case InputBlockType.URL:
      return <UrlInputIcon color={orange} {...props} />
    case InputBlockType.DATE:
      return <DateInputIcon color={orange} {...props} />
    case InputBlockType.PHONE:
      return <PhoneInputIcon color={orange} {...props} />
    case InputBlockType.CHOICE:
      return <ButtonsInputIcon color={orange} {...props} />
    case InputBlockType.PAYMENT:
      return <PaymentInputIcon color={orange} {...props} />
    case InputBlockType.RATING:
      return <RatingInputIcon color={orange} {...props} />
    case InputBlockType.FILE:
      return <FileInputIcon color={orange} {...props} />
    case LogicBlockType.SET_VARIABLE:
      return <SetVariableIcon color={purple} {...props} />
    case LogicBlockType.CONDITION:
      return <ConditionIcon color={purple} {...props} />
    case LogicBlockType.REDIRECT:
      return <RedirectIcon color={purple} {...props} />
    case LogicBlockType.SCRIPT:
      return <ScriptIcon {...props} />
    case LogicBlockType.WAIT:
      return <WaitIcon color={purple} {...props} />
    case LogicBlockType.TAG:
      return <Icon as={AiOutlineTag} color={purple} {...props} />
    case LogicBlockType.REMOVE_TAG:
      return <Icon as={AiOutlineDelete} color={purple} {...props} />
    case LogicBlockType.WAIT_FOR:
      return <WaitIcon color={purple} {...props} />
    case LogicBlockType.TRANSFER:
      return <Icon as={BiShuffle} color={purple} {...props} />
    case LogicBlockType.TYPEBOT_LINK:
      return <TypebotLinkIcon color={purple} {...props} />
    case LogicBlockType.END:
      return <Icon as={BsDoorClosed} color={purple} {...props} />
    case IntegrationBlockType.GOOGLE_SHEETS:
      return <GoogleSheetsLogo {...props} />
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return <GoogleAnalyticsLogo {...props} />
    case IntegrationBlockType.WEBHOOK:
      return <WebhookIcon {...props} />
    case IntegrationBlockType.ZAPIER:
      return <ZapierLogo {...props} />
    case IntegrationBlockType.MAKE_COM:
      return <MakeComLogo {...props} />
    case IntegrationBlockType.PABBLY_CONNECT:
      return <PabblyConnectLogo {...props} />
    case IntegrationBlockType.EMAIL:
      return <SendEmailIcon {...props} />
    case IntegrationBlockType.CHATWOOT:
      return <ChatwootLogo {...props} />
    case 'start':
      return <FlagIcon {...props} />
  }
}
