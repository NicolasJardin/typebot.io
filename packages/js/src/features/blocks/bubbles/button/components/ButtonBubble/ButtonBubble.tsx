import { ButtonOptions, TypingEmulation } from 'models'
import { onCleanup, onMount } from 'solid-js'

type Props = {
  content: ButtonOptions
  typingEmulation: TypingEmulation
  onTransitionEnd: () => void
}

export default function ButtonBubble(props: Props) {
  onMount(() => {
    props.onTransitionEnd()
  })

  return (
    <div class="flex flex-col animate-fade-in">
      <div class="flex mb-2 w-full items-center">
        <button
          onClick={() => window.open(props.content.url, '_blank')}
          class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
        >
          {props.content.title}
        </button>
      </div>
    </div>
  )
}
