import { TextInput } from '@/components/inputs'
import FileBubbleForm from '@/features/blocks/bubbles/file/components/FileBubbleForm'
import { TemplateOptions, Typebot } from '@typebot.io/schemas'

type PlaceholderType = 'image' | 'video' | 'audio' | 'document'

type Props = {
  index: number
  options: TemplateOptions
  onOptionsChange: (options: TemplateOptions) => void
  example: string
  format: PlaceholderType | undefined
  type: string
  typebot: Typebot
  blockId: string
  variables: TemplateOptions['variables']
}

export function TemplateSettingsInput({
  options,
  onOptionsChange,
  index,
  example,
  format,
  typebot,
  blockId,
  type,
  variables,
}: Props) {
  const handleVariableChange = (newValue: string | undefined) => {
    if (options) {
      const updatedVariables =
        variables?.map((variable, index) => ({
          ...variable,
          value: options.variables?.[index]?.value,
        })) || []

      updatedVariables[index] = {
        format,
        type,
        example,
        value: newValue,
      }

      return onOptionsChange({
        ...options,
        variables: updatedVariables,
      })
    }
  }

  const handleFileChange = (format: PlaceholderType, value: string) => {
    if (options) {
      const updatedVariables =
        variables?.map((variable, index) => ({
          ...variable,
          value: options.variables?.[index]?.value,
        })) || []

      updatedVariables[index] = {
        type,
        example,
        value,
        format,
      }

      return onOptionsChange({
        ...options,
        variables: updatedVariables,
      })
    }
  }

  switch (format) {
    case 'audio':
      return (
        <FileBubbleForm
          content={{
            url: options.variables?.[index]?.value,
          }}
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(audio) => handleFileChange('audio', audio.url || '')}
          fileType="audio"
        />
      )
    case 'image':
      return (
        <FileBubbleForm
          content={{
            url: options.variables?.[index]?.value,
          }}
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(image) => handleFileChange('image', image.url || '')}
          fileType="image"
        />
      )
    case 'video':
      return (
        <FileBubbleForm
          content={{
            url: options.variables?.[index]?.value,
          }}
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(video) => handleFileChange('video', video.url || '')}
          fileType="video"
        />
      )
    case 'document':
      return (
        <FileBubbleForm
          content={{
            url: options.variables?.[index]?.value,
          }}
          fileUploadPath={`typebots/${typebot.id}/blocks/${blockId}`}
          onSubmit={(document) =>
            handleFileChange('document', document.url || '')
          }
          fileType="document"
        />
      )
  }

  return (
    <TextInput
      defaultValue={options?.variables?.[index]?.value || ''}
      onChange={handleVariableChange}
      placeholder={example}
    />
  )
}
