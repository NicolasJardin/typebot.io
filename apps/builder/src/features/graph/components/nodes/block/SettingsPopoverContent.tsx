import ButtonSettings from '@/features/blocks/bubbles/button/components/ButtonSettings'
import { ButtonsBlockSettings } from '@/features/blocks/inputs/buttons/components/ButtonsBlockSettings'
import { DateInputSettings } from '@/features/blocks/inputs/date/components/DateInputSettings'
import { EmailInputSettings } from '@/features/blocks/inputs/emailInput/components/EmailInputSettings'
import { FileInputSettings } from '@/features/blocks/inputs/fileUpload/components/FileInputSettings'
import { NumberInputSettings } from '@/features/blocks/inputs/number/components/NumberInputSettings'
import { PaymentSettings } from '@/features/blocks/inputs/payment/components/PaymentSettings'
import { PhoneInputSettings } from '@/features/blocks/inputs/phone/components/PhoneInputSettings'
import { PictureChoiceSettings } from '@/features/blocks/inputs/pictureChoice/components/PictureChoiceSettings'
import { RatingInputSettings } from '@/features/blocks/inputs/rating/components/RatingInputSettings'
import { TextInputSettings } from '@/features/blocks/inputs/textInput/components/TextInputSettings'
import { UrlInputSettings } from '@/features/blocks/inputs/url/components/UrlInputSettings'
import { ChatwootSettings } from '@/features/blocks/integrations/chatwoot/components/ChatwootSettings'
import { GoogleAnalyticsSettings } from '@/features/blocks/integrations/googleAnalytics/components/GoogleAnalyticsSettings'
import { GoogleSheetsSettings } from '@/features/blocks/integrations/googleSheets/components/GoogleSheetsSettings'
import { MakeComSettings } from '@/features/blocks/integrations/makeCom/components/MakeComSettings'
import { OpenAISettings } from '@/features/blocks/integrations/openai/components/OpenAISettings'
import { PabblyConnectSettings } from '@/features/blocks/integrations/pabbly/components/PabblyConnectSettings'
import { SendEmailSettings } from '@/features/blocks/integrations/sendEmail/components/SendEmailSettings'
import { WebhookSettings } from '@/features/blocks/integrations/webhook/components/WebhookSettings'
import { ZapierSettings } from '@/features/blocks/integrations/zapier/components/ZapierSettings'
import { AbTestSettings } from '@/features/blocks/logic/abTest/components/AbTestSettings'
import { JumpSettings } from '@/features/blocks/logic/jump/components/JumpSettings'
import { RedirectSettings } from '@/features/blocks/logic/redirect/components/RedirectSettings'
import RemoveTagSettings from '@/features/blocks/logic/removeTag/components/RemoveTagSettings'
import { ScriptSettings } from '@/features/blocks/logic/script/components/ScriptSettings'
import { SetVariableSettings } from '@/features/blocks/logic/setVariable/components/SetVariableSettings'
import SpreadSettings from '@/features/blocks/logic/spread/components/SpreadSettings/SpreadSettings'
import TagSettings from '@/features/blocks/logic/tag/components/TagSettings'
import UpdateNameSettings from '@/features/blocks/logic/updateName/components/UpdateNameSettings'
import TransferSettings from '@/features/blocks/logic/transfer/components/TransferSettings'
import { TypebotLinkForm } from '@/features/blocks/logic/typebotLink/components/TypebotLinkForm'
import { WaitSettings } from '@/features/blocks/logic/wait/components/WaitSettings'
import WaitForSettings from '@/features/blocks/logic/waitFor/components/WaitForSettings'
import TemplateSettings from '@/features/blocks/logic/template/components/TemplateSettings'
import {
  Flex,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
  SlideFade,
  Stack,
  useColorModeValue,
  useEventListener,
} from '@chakra-ui/react'
import {
  Block,
  BlockOptions,
  BlockWithOptions,
  BubbleBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
  Typebot,
} from '@typebot.io/schemas'
import { Fragment, useRef, useState } from 'react'
import { SettingsHoverBar } from './SettingsHoverBar'
import { PixelSettings } from '@/features/blocks/integrations/pixel/components/PixelSettings'

type Props = {
  block: BlockWithOptions
  onExpandClick: () => void
  onBlockChange: (updates: Partial<Block>) => void
  typebot: Typebot
}

export const SettingsPopoverContent = ({
  onExpandClick,
  typebot,
  ...props
}: Props) => {
  const [isHovering, setIsHovering] = useState(false)
  const arrowColor = useColorModeValue('white', 'gray.800')
  const ref = useRef<HTMLDivElement | null>(null)
  const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation()

  const handleMouseWheel = (e: WheelEvent) => {
    e.stopPropagation()
  }
  useEventListener('wheel', handleMouseWheel, ref.current)
  return (
    <Portal>
      <PopoverContent onMouseDown={handleMouseDown} pos="relative">
        <PopoverArrow bgColor={arrowColor} />
        <PopoverBody
          pt="3"
          pb="6"
          overflowY="auto"
          maxH="600px"
          ref={ref}
          shadow="lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Stack spacing={3}>
            <Flex
              w="full"
              pos="absolute"
              top="-56px"
              height="300px"
              right={0}
              justifyContent="flex-end"
              align="center"
            >
              <SlideFade in={isHovering} unmountOnExit>
                <SettingsHoverBar
                  onExpandClick={onExpandClick}
                  blockType={props.block.type}
                />
              </SlideFade>
            </Flex>
            <BlockSettings {...props} typebot={typebot} />
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  )
}

export const BlockSettings = ({
  block,
  onBlockChange,
  typebot,
}: {
  block: BlockWithOptions
  onBlockChange: (block: Partial<Block>) => void
  typebot: Typebot
}): JSX.Element => {
  const updateOptions = (options: BlockOptions) => {
    onBlockChange({ options } as Partial<Block>)
  }

  //@ts-ignore
  switch (block.type) {
    //@ts-ignore
    case BubbleBlockType.BUTTON:
      return (
        <ButtonSettings
          //@ts-ignore
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    case InputBlockType.TEXT: {
      return (
        <TextInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.NUMBER: {
      return (
        <NumberInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.EMAIL: {
      return (
        <EmailInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.URL: {
      return (
        <UrlInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.DATE: {
      return (
        <DateInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.PHONE: {
      return (
        <PhoneInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.CHOICE: {
      return (
        <ButtonsBlockSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.PICTURE_CHOICE: {
      return (
        <PictureChoiceSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.PAYMENT: {
      return (
        <PaymentSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.RATING: {
      return (
        <RatingInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case InputBlockType.FILE: {
      return (
        <FileInputSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case LogicBlockType.SET_VARIABLE: {
      return (
        <SetVariableSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case LogicBlockType.REDIRECT: {
      return (
        <RedirectSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case LogicBlockType.SCRIPT: {
      return (
        <ScriptSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case LogicBlockType.TYPEBOT_LINK: {
      return (
        <TypebotLinkForm
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case LogicBlockType.TRANSFER: {
      return (
        <TransferSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }

    case LogicBlockType.SPREAD: {
      return (
        <SpreadSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }

    case LogicBlockType.WAIT: {
      return (
        <WaitSettings options={block.options} onOptionsChange={updateOptions} />
      )
    }

    case LogicBlockType.UPDATE_SYSTEM_NAME:
      return (
        <UpdateNameSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    case LogicBlockType.TAG:
      return (
        <TagSettings options={block.options} onOptionsChange={updateOptions} />
      )

    case LogicBlockType.JUMP:
      return (
        <JumpSettings
          groupId={block.groupId}
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    case LogicBlockType.REMOVE_TAG:
      return (
        <RemoveTagSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    case LogicBlockType.AB_TEST:
      return (
        <AbTestSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    case LogicBlockType.TEMPLATE:
      return (
        <TemplateSettings
          options={block.options}
          onOptionsChange={updateOptions}
          typebot={typebot}
          blockId={block.id}
        />
      )

    case InputBlockType.WAIT_FOR:
      return (
        <WaitForSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )

    //@ts-ignore
    case LogicBlockType.END:
      return <Fragment />

    case IntegrationBlockType.GOOGLE_SHEETS: {
      return (
        <GoogleSheetsSettings
          options={block.options}
          onOptionsChange={updateOptions}
          blockId={block.id}
        />
      )
    }
    case IntegrationBlockType.GOOGLE_ANALYTICS: {
      return (
        <GoogleAnalyticsSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case IntegrationBlockType.ZAPIER: {
      return <ZapierSettings block={block} onOptionsChange={updateOptions} />
    }
    case IntegrationBlockType.MAKE_COM: {
      return <MakeComSettings block={block} onOptionsChange={updateOptions} />
    }
    case IntegrationBlockType.PABBLY_CONNECT: {
      return (
        <PabblyConnectSettings block={block} onOptionsChange={updateOptions} />
      )
    }
    case IntegrationBlockType.WEBHOOK: {
      return <WebhookSettings block={block} onOptionsChange={updateOptions} />
    }
    case IntegrationBlockType.EMAIL: {
      return (
        <SendEmailSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case IntegrationBlockType.CHATWOOT: {
      return (
        <ChatwootSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case IntegrationBlockType.OPEN_AI: {
      return (
        <OpenAISettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
    case IntegrationBlockType.PIXEL: {
      return (
        <PixelSettings
          options={block.options}
          onOptionsChange={updateOptions}
        />
      )
    }
  }
}
