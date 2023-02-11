import { Seo } from '@/components/Seo'
import { VStack } from '@chakra-ui/react'
import { CreateNewTypebotButtons } from './CreateNewTypebotButtons'

export const TemplatesPage = () => (
  <VStack>
    <Seo title="Templates" />

    <CreateNewTypebotButtons />
  </VStack>
)
