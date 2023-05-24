import { GoogleLogo } from '@/components/GoogleLogo'
import { GithubIcon } from '@/components/icons'
import { AzureAdLogo } from '@/components/logos/AzureAdLogo'
import { FacebookLogo } from '@/components/logos/FacebookLogo'
import { GitlabLogo } from '@/components/logos/GitlabLogo'
import { Button, Stack } from '@chakra-ui/react'
import { omit } from '@typebot.io/lib'
import { BuiltInProviderType } from 'next-auth/providers'
import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react'
import { useRouter } from 'next/router'
import { stringify } from 'qs'
import { useState } from 'react'

type Props = {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | undefined
}

export const SocialLoginButtons = ({ providers }: Props) => {
  const { query } = useRouter()
  const { status } = useSession()
  const [authLoading, setAuthLoading] =
    useState<LiteralUnion<BuiltInProviderType, string>>()

  const handleSignIn = async (provider: string) => {
    setAuthLoading(provider)
    await signIn(provider, {
      callbackUrl:
        query.callbackUrl?.toString() ??
        `/typebots?${stringify(omit(query, 'error', 'callbackUrl'))}`,
    })
    setTimeout(() => setAuthLoading(undefined), 3000)
  }

  const handleGitHubClick = () => handleSignIn('github')

  const handleGoogleClick = () => handleSignIn('google')

  const handleFacebookClick = () => handleSignIn('facebook')

  const handleGitlabClick = () => handleSignIn('gitlab')

  const handleAzureAdClick = () => handleSignIn('azure-ad')

  const handleCustomOAuthClick = () => handleSignIn('custom-oauth')

  return (
    <Stack>
      {providers?.github && (
        <Button
          leftIcon={<GithubIcon />}
          onClick={handleGitHubClick}
          data-testid="github"
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'github'
          }
          variant="outline"
        >
          Continuar com o GitHub
        </Button>
      )}
      {providers?.google && (
        <Button
          leftIcon={<GoogleLogo />}
          onClick={handleGoogleClick}
          data-testid="google"
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'google'
          }
          variant="outline"
        >
          Continuar com o Google
        </Button>
      )}
      {providers?.facebook && (
        <Button
          leftIcon={<FacebookLogo />}
          onClick={handleFacebookClick}
          data-testid="facebook"
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'facebook'
          }
          variant="outline"
        >
          Continuar com o Facebook
        </Button>
      )}
      {providers?.gitlab && (
        <Button
          leftIcon={<GitlabLogo />}
          onClick={handleGitlabClick}
          data-testid="gitlab"
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'gitlab'
          }
          variant="outline"
        >
          Continuar com {providers.gitlab.name}
        </Button>
      )}
      {providers?.['azure-ad'] && (
        <Button
          leftIcon={<AzureAdLogo />}
          onClick={handleAzureAdClick}
          data-testid="azure-ad"
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'azure-ad'
          }
          variant="outline"
        >
          Continuar com {providers['azure-ad'].name}
        </Button>
      )}
      {providers?.['custom-oauth'] && (
        <Button
          onClick={handleCustomOAuthClick}
          isLoading={
            ['loading', 'authenticated'].includes(status) ||
            authLoading === 'custom-oauth'
          }
          variant="outline"
        >
          Continuar com {providers['custom-oauth'].name}
        </Button>
      )}
    </Stack>
  )
}
