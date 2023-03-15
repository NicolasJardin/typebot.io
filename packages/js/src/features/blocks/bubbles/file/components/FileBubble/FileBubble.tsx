import { TypingBubble } from '@/components'
import ChatText from '@/features/blocks/bubbles/components/ChatText'
import { computeTypingDuration } from '@/features/blocks/bubbles/textBubble/utils/computeTypingDuration'
import type { TypingEmulation } from 'models'
import { createSignal, onCleanup, onMount } from 'solid-js'

type Props = {
  url?: string
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

export default function FileBubble(props: Props) {
  const [isTyping, setIsTyping] = createSignal(true)

  const onTypingEnd = () => {
    if (!isTyping()) return
    setIsTyping(false)
    setTimeout(() => {
      props.onTransitionEnd()
    }, showAnimationDuration)
  }

  onMount(() => {
    if (!isTyping) return
    const typingDuration =
      props.typingEmulation?.enabled === false
        ? 0
        : computeTypingDuration(
            'Enviado arquivo (clique aqui para ver)',
            props.typingEmulation ?? defaultTypingEmulation
          )
    typingTimeout = setTimeout(onTypingEnd, typingDuration)
  })

  onCleanup(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
  })

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
            text="🖇 Enviado arquivo"
            url={
              props.url
                ? {
                    href: props.url,
                    title: '(clique aqui para ver)',
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
