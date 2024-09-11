/* eslint-disable solid/components-return-once */

import { AudioBubble } from '@/features/blocks/bubbles/audio'
import ButtonBubble from '@/features/blocks/bubbles/button/components/ButtonBubble'
import { EmbedBubble } from '@/features/blocks/bubbles/embed'
import EndBubble from '@/features/blocks/bubbles/end/components/EndBubble'
import FileBubble from '@/features/blocks/bubbles/file/components/FileBubble'
import { ImageBubble } from '@/features/blocks/bubbles/image'
import SpreadBubble from '@/features/blocks/bubbles/spread/components/SpreadBubble'
import TagBubble from '@/features/blocks/bubbles/tag/components/TagBubble'
import TemplateBubble from '@/features/blocks/bubbles/template/components/TemplateBubble'
import { TextBubble } from '@/features/blocks/bubbles/textBubble'
import TransferBubble from '@/features/blocks/bubbles/transfer/components/TransferBubble'
import UpdateNameBubble from '@/features/blocks/bubbles/updateName/components/UpdateNameBubble/UpdateNameBubble'
import SendFromBubble from '@/features/blocks/bubbles/sendFrom/components/SendFromBubble'
import { VideoBubble } from '@/features/blocks/bubbles/video'
import WaitBubble from '@/features/blocks/bubbles/wait/components/WaitBubble'
import {
  AudioBubbleContent,
  BubbleBlockType,
  ButtonOptions,
  ChatMessage,
  EmbedBubbleContent,
  LogicBlockType,
  RemoveTagOptions,
  SpreadOptions,
  TagOptions,
  TemplateOptions,
  TransferOptions,
  TypingEmulation,
  VideoBubbleContent,
  WaitOptions,
} from '@typebot.io/schemas'
import { FileBubbleContent } from '@typebot.io/schemas/features/blocks/bubbles/file'

type Props = {
  message: ChatMessage
  typingEmulation: TypingEmulation
  onTransitionEnd: (offsetTop?: number) => void
}

export const HostBubble = (props: Props) => {
  const onTransitionEnd = (offsetTop?: number) => {
    props.onTransitionEnd(offsetTop)
  }

  const getHostBubble = () => {
    switch (props.message.type) {
      case BubbleBlockType.TEXT:
        return (
          <TextBubble
            content={props.message.content}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )
      case BubbleBlockType.IMAGE:
        return (
          <ImageBubble
            content={props.message.content}
            onTransitionEnd={onTransitionEnd}
          />
        )
      case BubbleBlockType.EMBED:
        return (
          <EmbedBubble
            content={props.message.content as EmbedBubbleContent}
            onTransitionEnd={onTransitionEnd}
          />
        )
      case BubbleBlockType.VIDEO:
        return (
          <VideoBubble
            content={props.message.content as VideoBubbleContent}
            onTransitionEnd={onTransitionEnd}
          />
        )
      case BubbleBlockType.AUDIO:
        return (
          <AudioBubble
            content={props.message.content as AudioBubbleContent}
            onTransitionEnd={onTransitionEnd}
          />
        )
      case BubbleBlockType.FILE:
        return (
          <FileBubble
            url={(props.message.content as FileBubbleContent).url}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.WAIT:
        return (
          <WaitBubble
            secondsToWaitFor={
              (props.message.content as WaitOptions).secondsToWaitFor
            }
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.UPDATE_SYSTEM_NAME:
        return (
          <UpdateNameBubble
            value={props.message.content?.value}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.SEND_FROM:
        return (
          <SendFromBubble
            device={props.message.content?.device?.name}
            contact={props.message.content?.contact}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.TAG:
        return (
          <TagBubble
            name={(props.message.content as TagOptions).name}
            type="add"
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.REMOVE_TAG:
        return (
          <TagBubble
            name={(props.message.content as RemoveTagOptions).name}
            type="remove"
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.END:
        return (
          <EndBubble
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case BubbleBlockType.BUTTON:
        return (
          <ButtonBubble
            content={props.message.content as ButtonOptions}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.SPREAD:
        return (
          <SpreadBubble
            options={props.message.content as SpreadOptions}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )

      case LogicBlockType.TEMPLATE:
        return (
          <TemplateBubble
            options={props.message.content as TemplateOptions}
            typingEmulation={props.typingEmulation}
            onTransitionEnd={onTransitionEnd}
          />
        )
    }

    return (
      <TransferBubble
        options={props.message.content as TransferOptions}
        typingEmulation={props.typingEmulation}
        onTransitionEnd={onTransitionEnd}
      />
    )
  }

  return <div>{getHostBubble()}</div>
}
