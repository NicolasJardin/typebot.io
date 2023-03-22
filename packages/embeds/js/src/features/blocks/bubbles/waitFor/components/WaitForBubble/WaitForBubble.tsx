import ChatText from '@/features/blocks/bubbles/components/ChatText'
import { InputSubmitContent } from '@/types'
import { WaitForOptions } from '@typebot.io/schemas'
import { onMount } from 'solid-js'

enum WaitForTypeEnum {
  DAY = 'DAY',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
}

type Props = {
  options: WaitForOptions
  onSubmit: (value: InputSubmitContent) => void
}

export default function WaitForBubble(props: Props) {
  const getMessage = () => {
    const number = Number(props.options.number || 0)

    switch (props.options.type) {
      case WaitForTypeEnum.DAY:
        return `⌛ Aguardar por ${number} ${number !== 1 ? 'dias' : 'dia'} ${
          props.options.time ? `e enviar ás ${props.options.time}` : ''
        }`
      case WaitForTypeEnum.HOUR:
        return `⌛ Aguardar por ${number} ${number !== 1 ? 'horas' : 'hora'}`
    }

    return `⌛ Aguardar por ${number} ${number !== 1 ? 'minutos' : 'minuto'}`
  }

  const message = getMessage()

  onMount(() => {
    props.onSubmit({
      value: message,
    })
  })

  return (
    <div class="flex flex-col animate-fade-in">
      <div class="flex mb-2 w-full items-center">
        <div class={'flex relative items-start typebot-host-bubble'}>
          <ChatText text={message} />
        </div>
      </div>
    </div>
  )
}
