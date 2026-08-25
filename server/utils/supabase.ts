import { createAdminClient } from '@supabase/server/core'

export function useServerSupabase() {
  const config = useRuntimeConfig()

  return createAdminClient({
    env: {
      url: config.supabaseUrl,
      secretKeys: {
        default: config.supabaseSecretKey
      }
    }
  })
}
