<script setup lang="ts">
type VideoRow = {
  id: number | string
  title?: string | null
  description?: string | null
  category?: string | null
  position?: string | null
  context?: string | null
  url: string
}

const route = useRoute()
const { data: video, error: fetchError, status } = await useFetch<VideoRow>(`/api/videos/${route.params.id}`)

const isInstagram = computed(() => video.value?.url.includes('instagram'))
const youtubeId = computed(() => video.value?.url.replace('https://www.youtube.com/watch?v=', '').split('&')[0] || '')
</script>

<template>
  <UContainer class="py-10 pb-24">
    <UButton to="/training" variant="ghost" color="neutral" icon="i-lucide-arrow-left" class="mb-8 -ml-3">
      Back to library
    </UButton>

    <p v-if="status === 'pending'">Loading video...</p>
    <p v-else-if="fetchError" class="text-error">Unable to load video: {{ fetchError.message }}</p>
    <article v-else-if="video" class="mx-auto max-w-4xl">
      <div class="mb-6 flex flex-wrap gap-2 text-sm">
        <UBadge v-if="video.category" color="primary" variant="subtle">{{ video.category }}</UBadge>
        <UBadge v-if="video.position" color="neutral" variant="subtle">{{ video.position }}</UBadge>
        <UBadge v-if="video.context" color="neutral" variant="subtle">{{ video.context }}</UBadge>
      </div>
      <h1 class="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{{ video.title || 'Training video' }}</h1>
      <p v-if="video.description" class="mt-4 max-w-2xl text-lg text-muted">{{ video.description }}</p>
      <div class="mt-8 overflow-hidden rounded-xl bg-black shadow-xl">
        <ScriptInstagramEmbed v-if="isInstagram" :post-url="video.url" :captions="true" />
        <ScriptYouTubePlayer v-else :video-id="youtubeId" />
      </div>
    </article>
  </UContainer>
</template>
