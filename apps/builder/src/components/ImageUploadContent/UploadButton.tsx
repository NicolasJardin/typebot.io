import { useToast } from '@/hooks/useToast'
import { compressFile } from '@/utils/helpers'
import { Button, ButtonProps, chakra } from '@chakra-ui/react'
import { ChangeEvent, useMemo, useState } from 'react'
import { uploadFiles } from 'utils'

type UploadButtonProps = {
  fileType: 'image' | 'audio' | 'file'
  filePath: string
  includeFileName?: boolean
  onFileUploaded: (url: string) => void
} & ButtonProps

export const UploadButton = ({
  fileType,
  filePath,
  includeFileName,
  onFileUploaded,
  ...props
}: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const { showToast } = useToast()

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return
    setIsUploading(true)
    const file = e.target.files[0] as File | undefined

    if (!file)
      return showToast({ description: 'Could not read file.', status: 'error' })
    const urls = await uploadFiles({
      files: [
        {
          file: await compressFile(file),
          path: `public/${filePath}${includeFileName ? `/${file.name}` : ''}`,
        },
      ],
    })

    if (urls.length && urls[0]) onFileUploaded(urls[0] + '?v=' + Date.now())
    setIsUploading(false)
  }

  const filesToAccept = useMemo(() => {
    if (fileType === 'image') return '.jpg, .jpeg, .png, .gif'

    if (fileType === 'audio') return '.mp3, .wav'

    return 'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf'
  }, [fileType])

  return (
    <>
      <chakra.input
        data-testid="file-upload-input"
        type="file"
        id="file-input"
        display="none"
        onChange={handleInputChange}
        accept={filesToAccept}
      />
      <Button
        as="label"
        size="sm"
        htmlFor="file-input"
        cursor="pointer"
        isLoading={isUploading}
        {...props}
      >
        {props.children}
      </Button>
    </>
  )
}
