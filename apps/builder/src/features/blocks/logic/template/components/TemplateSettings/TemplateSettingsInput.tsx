import { ImageUploadContent } from '@/components/ImageUploadContent'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { TemplateOptions, Typebot, Variable } from '@typebot.io/schemas'
import { VideoUploadContent } from '@/features/blocks/bubbles/video/components/VideoUploadContent'
import FileBubbleForm from '@/features/blocks/bubbles/file/components/FileBubbleForm'

type PlaceholderType = 'image' | 'video' | 'document'

type Props = {
  index: number
  options: TemplateOptions
  onOptionsChange: (options: TemplateOptions) => void
  placeholder: string
  type: PlaceholderType
  typebot: Typebot
  blockId: string
}

export function TemplateSettingsInput({
  options,
  onOptionsChange,
  index,
  placeholder,
  type,
  typebot,
  blockId,
}: Props) {
  const handleVariableChange = (variable: Variable | undefined) => {
    if (options && variable) {
      const updatedPlaceholders = [...options.placeholders]
      updatedPlaceholders[index] = {
        placeholder,
        value: variable.id,
      }

      return onOptionsChange({
        ...options,
        placeholders: updatedPlaceholders,
      })
    }
  }

  const handleFileChange = (type: PlaceholderType, value: string) => {
    if (options) {
      const updatedPlaceholders = [...options.placeholders]
      updatedPlaceholders[index] = {
        placeholder,
        value,
        type,
      }

      return onOptionsChange({
        ...options,
        placeholders: updatedPlaceholders,
      })
    }
  }

  switch (type) {
    case 'image':
      return (
        <ImageUploadContent
          filePath={`typebots/${typebot.id}/blocks/${blockId}`}
          defaultUrl={options.placeholders[index]?.value}
          onSubmit={(url) => handleFileChange('image', url)}
        />
      )
    case 'video':
      return (
        <VideoUploadContent
          content={
            options.placeholders[index]?.value
              ? {
                  url: options.placeholders[index]?.value,
                }
              : undefined
          }
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(video) => handleFileChange('video', video.url)}
        />
      )
    case 'document':
      return (
        <FileBubbleForm
          content={{
            url: options.placeholders[index]?.value,
          }}
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(document) => handleFileChange('document', document.url)}
        />
      )
  }

  return (
    <VariableSearchInput
      initialVariableId={options?.placeholders[index]?.value}
      onSelectVariable={(variable) => handleVariableChange(variable)}
      placeholder={placeholder}
    />
  )
}
