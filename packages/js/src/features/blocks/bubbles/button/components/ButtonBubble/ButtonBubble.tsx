import { TypingBubble } from '@/components'
import { computeTypingDuration } from '@/features/blocks/bubbles/textBubble/utils/computeTypingDuration'
import { ButtonOptions, TypingEmulation } from 'models'
import { createSignal, onCleanup, onMount } from 'solid-js'

type Props = {
  content: ButtonOptions
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

export default function ButtonBubble(props: Props) {
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
            props.content.title || '',
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

          {/* <button
            onClick={() => window.open(props.content.url, '_blank')}
            type="button"
            class={
              'text-white bg-[#FFA500] hover:bg-[#FFA500E6]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2'
              // (isTyping() ? 'opacity-0 h-6' : 'opacity-100 h-full')
            }
          >
            {props.content.title}
          </button> */}

          <button
            type="button"
            class={
              'text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2' +
              isTyping()
                ? 'opacity-0 h-6'
                : 'opacity-100 h-full'
            }
          >
            Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  )
}
