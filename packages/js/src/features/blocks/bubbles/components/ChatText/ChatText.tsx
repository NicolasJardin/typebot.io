type ChatTextProps = {
  text: string
  url?: { href: string; title: string }
  isTyping?: boolean
}

export default function ChatText(props: ChatTextProps) {
  return (
    <p
      class={
        'overflow-hidden text-fade-in mx-4 my-2 whitespace-pre-wrap slate-html-container relative text-ellipsis ' +
        (props.isTyping ? 'opacity-0 h-6' : 'opacity-100 h-full')
      }
    >
      {props.text}{' '}
      {props.url && (
        <a rel="noreferrer" target="_blank" href={props.url.href}>
          {props.url.title}
        </a>
      )}
    </p>
  )
}
