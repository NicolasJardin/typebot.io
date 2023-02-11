import { Seo } from '@/components/Seo'
import { TextLink } from '@/components/TextLink'
import { VStack, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SignInForm } from './SignInForm'

type Props = {
  type: 'signin' | 'signup'
  defaultEmail?: string
}

export const SignInPage = ({ type }: Props) => {
  const { query } = useRouter()

  return (
    <VStack spacing={4} h="100vh" justifyContent="center">
      <Seo title={type === 'signin' ? 'Entrar' : 'Registrar'} />
      <Heading
        onClick={() => {
          throw new Error('Sentinela está funcionando')
        }}
      >
        {type === 'signin' ? 'Entrar' : 'Crie a sua conta aqui'}
      </Heading>
      {type === 'signin' ? (
        <Text>
          Não tem uma conta ?{' '}
          <TextLink href="/register">Inscreva-se gratuitamente</TextLink>
        </Text>
      ) : (
        <Text>
          já tem uma conta? <TextLink href="/signin">Entrar</TextLink>
        </Text>
      )}
      <SignInForm defaultEmail={query.g?.toString()} />
    </VStack>
  )
}
