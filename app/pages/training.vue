<script setup>
const supabase = useSupabaseClient()
const videos = ref([])
const error = ref(null)
const loading = ref(false)
const supabaseError = ref(null)

async function getVideos() {
  loading.value = true
  error.value = null
  supabaseError.value = null
  
  try {
    const { data, error: fetchError, count } = await supabase
      .from('videos')
      .select('*', { count: 'exact' })

    if (fetchError) {
      throw fetchError
    }

    videos.value = data || []
    console.log('Videos loaded:', data)
    console.log('Total count:', count)
    
    if (data && data.length === 0) {
      console.warn('Videos table is empty or RLS is blocking access')
      // Try to check if we can see the table at all
      const { data: testData } = await supabase.from('videos').select('id').limit(1)
      console.log('RLS test result:', testData)
    }
  } catch (err) {
    error.value = err
    console.error('Supabase error:', err)
    supabaseError.value = err.message
  } finally {
    loading.value = false
  }
}

// Also try with a test insert to check RLS
async function testInsert() {
  try {
    const { data, error: insertError } = await supabase
      .from('videos')
      .insert([{ title: 'Test Video', url: 'https://example.com/test.mp4' }])
      .select()
    
    if (insertError) {
      console.error('Insert error (RLS):', insertError.message)
      supabaseError.value = `RLS Policy Error: ${insertError.message}`
    } else {
      console.log('Insert successful:', data)
      await getVideos()
    }
  } catch (err) {
    console.error('Insert failed:', err)
    supabaseError.value = err.message
  }
}

onMounted(() => {
  getVideos()
})
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Training Videos</h1>
    
    <div v-if="supabaseError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-bold">Supabase Error:</p>
      <p>{{ supabaseError }}</p>
      <p class="text-sm mt-2">This is likely a Row-Level Security (RLS) policy issue. Check your Supabase table policies.</p>
    </div>
    
    <p v-if="loading">Loading videos...</p>
    
    <p v-if="error && !supabaseError" class="text-red-500">
      Error loading videos: {{ error.message }}
    </p>
    
    <div v-if="videos.length === 0 && !loading && !error" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <p><strong>No videos found.</strong> This could mean:</p>
      <ul class="list-disc list-inside mt-2">
        <li>The videos table is empty</li>
        <li>Row-Level Security (RLS) is blocking read access</li>
        <li>The table name is incorrect</li>
      </ul>
      <p class="mt-2 text-sm">Open your Supabase dashboard and check the videos table RLS policies.</p>
    </div>
    
    <div v-if="videos.length > 0" class="mt-4">
      <p class="text-sm text-gray-500 mb-2">{{ videos.length }} video(s) found</p>
      <ul class="space-y-2">
        <li v-for="video in videos" :key="video.id" class="p-3 border rounded hover:bg-gray-50">
          <strong>{{ video.title || 'Untitled' }}</strong>
          <p v-if="video.description" class="text-gray-500 text-sm mt-1">{{ video.description }}</p>
          <p v-if="video.url" class="text-blue-500 text-sm mt-1">
            <a :href="video.url" target="_blank" class="underline">Watch video</a>
          </p>
        </li>
      </ul>
    </div>
    
    <div class="mt-6 p-4 bg-gray-100 rounded">
      <h2 class="font-semibold mb-2">Debug Info</h2>
      <p class="text-sm text-gray-600">
        Supabase URL: {{ $config.public.supabaseUrl }}<br>
        Connection: {{ error ? 'Failed' : loading ? 'Loading' : 'OK' }}
      </p>
    </div>
  </div>
</template>
