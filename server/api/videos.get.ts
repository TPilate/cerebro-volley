export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  const { data, error } = await supabase.from('videos').select('*')

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to load videos',
      data: { message: error.message }
    })
  }

  return data ?? []
})
