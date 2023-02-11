import { CodeEditor } from '@/components/CodeEditor'
import { OrderedList, ListItem, Tag } from '@chakra-ui/react'
import { useState } from 'react'
import { BubbleParams } from 'typebot-js'
import { env, getViewerUrl } from 'utils'
import { ChatEmbedCode } from '../../codeSnippets/Chat/EmbedCode'
import { ChatEmbedSettings } from '../../codeSnippets/Chat/EmbedSettings'
import { StandardEmbedWindowSettings } from '../../codeSnippets/Container/EmbedSettings'
import {
  parseInitContainerCode,
  typebotJsHtml,
} from '../../codeSnippets/params'
import { PopupEmbedCode } from '../../codeSnippets/Popup/EmbedCode'
import { PopupEmbedSettings } from '../../codeSnippets/Popup/EmbedSettings'
import { ModalProps } from '../../EmbedButton'

type GtmInstructionsProps = {
  type: 'standard' | 'popup' | 'bubble'
  publicId: string
}

export const GtmInstructions = ({ type, publicId }: GtmInstructionsProps) => {
  switch (type) {
    case 'standard': {
      return <StandardInstructions publicId={publicId} />
    }
    case 'popup': {
      return <PopupInstructions />
    }
    case 'bubble': {
      return <BubbleInstructions />
    }
  }
}

const StandardInstructions = ({ publicId }: Pick<ModalProps, 'publicId'>) => {
  const [windowSizes, setWindowSizes] = useState({
    height: '100%',
    width: '100%',
  })

  const jsCode = parseInitContainerCode({
    url: `${env('VIEWER_INTERNAL_URL') ?? getViewerUrl()}/${publicId}`,
  })
  const headCode = `${typebotJsHtml}
  <script>
    ${jsCode}
  </script>`

  const elementCode = `<div id="typebot-container" style="height: ${windowSizes.height}; width: ${windowSizes.width}"></div>`
  return (
    <OrderedList spacing={2} mb={4}>
      <ListItem>
        No painel da sua conta GTM, clique em <Tag>Adicionar uma nova tag</Tag>
      </ListItem>
      <ListItem>
        Escolha o tipo <Tag>Tag HTML</Tag> personalizado
      </ListItem>
      <ListItem>
        Cole o código abaixo:
        <CodeEditor value={headCode} mt={2} isReadOnly lang="html" />
      </ListItem>
      <ListItem>
        Em sua página web, você precisa ter um elemento no qual o typebot irá
        ir. Ele precisa ter o id <Tag>typebot-container</Tag>:
        <StandardEmbedWindowSettings
          my={4}
          onUpdateWindowSettings={(sizes) =>
            setWindowSizes({
              height: sizes.heightLabel,
              width: sizes.widthLabel,
            })
          }
        />
        <CodeEditor value={elementCode} mt={2} isReadOnly lang="html" />
      </ListItem>
    </OrderedList>
  )
}

const PopupInstructions = () => {
  const [inputValue, setInputValue] = useState<number>()

  return (
    <OrderedList spacing={2} mb={4}>
      <ListItem>
        No painel da sua conta GTM, clique em <Tag>Adicionar uma nova tag</Tag>
      </ListItem>
      <ListItem>
        Escolha o tipo <Tag>Tag HTML</Tag> personalizado
      </ListItem>
      <ListItem>
        Cole o código abaixo:
        <PopupEmbedSettings
          my={4}
          onUpdateSettings={(settings) => setInputValue(settings.delay)}
        />
        <PopupEmbedCode delay={inputValue} />
      </ListItem>
    </OrderedList>
  )
}

const BubbleInstructions = () => {
  const [inputValues, setInputValues] = useState<
    Pick<BubbleParams, 'proactiveMessage' | 'button'>
  >({
    proactiveMessage: undefined,
    button: {
      color: '',
      iconUrl: '',
    },
  })

  return (
    <OrderedList spacing={2} mb={4}>
      <ListItem>
        No painel da sua conta GTM, clique em <Tag>Adicionar uma nova tag</Tag>
      </ListItem>
      <ListItem>
        Escolha o tipo <Tag>Tag HTML</Tag> personalizado
      </ListItem>
      <ListItem>
        Cole o código abaixo:
        <ChatEmbedSettings
          onUpdateSettings={(settings) => setInputValues({ ...settings })}
        />
        <ChatEmbedCode my={4} {...inputValues} />
      </ListItem>
    </OrderedList>
  )
}
