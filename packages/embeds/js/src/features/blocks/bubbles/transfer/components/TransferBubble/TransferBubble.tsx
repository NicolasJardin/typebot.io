import { TypingBubble } from '@/components'
import ChatText from '@/features/blocks/bubbles/components/ChatText'
import { TransferOptions, TypingEmulation } from '@typebot.io/schemas'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { computeTypingDuration } from '../../../textBubble/helpers/computeTypingDuration'

type Props = {
  options: TransferOptions
  typingEmulation: TypingEmulation
  onTransitionEnd: () => void
}

export const showAnimationDuration = 400

const defaultTypingEmulation = {
  enabled: true,
  speed: 300,
  maxDelay: 1.5,
}

let typingTimeout: NodeJS.Timeout

export default function TransferBubble(props: Props) {
  const [isTyping, setIsTyping] = createSignal(true)

  const onTypingEnd = () => {
    if (!isTyping()) return
    setIsTyping(false)
    setTimeout(() => {
      props.onTransitionEnd()
    }, showAnimationDuration)
  }

  const getText = () => {
    if (props.options.attendant?.name)
      return `atendente ${props.options.attendant.name}`

    if (props.options.group?.type) return `grupo finalizados`

    return `setor ${props.options.department?.name}`
  }

  onMount(() => {
    if (!isTyping) return
    const typingDuration =
      props.typingEmulation?.enabled === false
        ? 0
        : computeTypingDuration(
            `🔀 Transferido para o ${getText()}`,
            props.typingEmulation ?? defaultTypingEmulation
          )
    typingTimeout = setTimeout(onTypingEnd, typingDuration)
  })

  onCleanup(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
  })

  console.log('TransferBubble', { isTyping, typingTimeout, props })

  return (
    <div class="flex flex-col animate-fade-in">
      <div class="flex mb-2 w-full items-center">
        <div class={'flex relative items-start typebot-host-bubble'}>
          <div
            class="flex items-center absolute px-4 py-2 rounded-lg bubble-typing "
            style={{
              width: isTyping() ? '64px' : '100%',
              height: isTyping() ? '32px' : '100%',
            }}
            data-testid="host-bubble"
          >
            {isTyping() && <TypingBubble />}
          </div>

          <ChatText
            isTyping={!!isTyping()}
            text={`🔀 Transferido para o ${getText()}`}
          />
        </div>
      </div>
    </div>
  )
}
