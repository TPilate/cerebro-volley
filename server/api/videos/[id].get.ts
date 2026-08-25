export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const supabase = useServerSupabase();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw createError({
      statusCode: error.code === "PGRST116" ? 404 : 502,
      statusMessage:
        error.code === "PGRST116" ? "Video not found" : "Unable to load video",
      data: { message: error.message },
    });
  }

  return data;
});
