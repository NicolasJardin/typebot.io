import { Typebot } from '@typebot.io/schemas'
import { sendRequest } from '@typebot.io/lib'

export const updateTypebotQuery = async (
  id: string,
  typebot: Partial<Typebot>
) =>
  sendRequest<{ typebot: Typebot }>({
    url: `${process.env.NEXT_PUBLIC_VIEWER_URL}/api/typebots/${id}/typebots`,
    method: 'PATCH',
    body: typebot,
  })
