export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body must be a JSON object'
    })
  }

  const supabase = useServerSupabase()
  const { data, error } = await supabase
    .from('videos')
    .insert(body)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to create video',
      data: { message: error.message }
    })
  }

  setResponseStatus(event, 201)
  return data
})
