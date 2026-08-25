<!--

-->

<script setup lang="ts">
const filters = ['All', 'Team', 'Solo', 'Musculation', 'Setter', 'Opposite', 'Libero', 'Defense']
const filterValue = ref('All')
const page = ref(1)
const pageSize = 9
type VideoRow = {
  id: number | string
  title?: string | null
  description?: string | null
  category?: string | null
  position?: string | null
  context?: string | null
  url: string
}

const { data: videos, error: fetchError, status } = await useFetch<VideoRow[]>('/api/videos')

const filteredVideos = computed(() => {
  if (filterValue.value === 'All') {
    return videos.value ?? []
  }

  return (videos.value ?? []).filter(video => [video.category, video.position, video.context].includes(filterValue.value))
})

const paginatedVideos = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredVideos.value.slice(start, start + pageSize)
})

watch(filterValue, () => {
  page.value = 1
})

const typeOfMedia = (videosUrl: string) => {
  if (videosUrl.includes('instagram')) {
    return 'instagram'
  } else {
    return 'youtube'
  }
}

const getYoutubeId = (videoUrl: string) => {
  return videoUrl.replace('https://www.youtube.com/watch?v=', '').split('&')[0]
}
</script>

<template>
  <UContainer class="py-10 pb-24">
    <header class="mb-10 max-w-3xl">
      <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Train smarter
      </p>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        Training Library
      </h1>
      <p class="mt-4 text-lg text-muted">
        Explore focused volleyball drills and advice for team, individual, and position-specific training.
      </p>
    </header>

    <div class="mb-8 flex flex-col justify-between gap-4 border-y border-default py-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-medium text-muted">
          Browse by focus
        </p>
        <p class="text-sm text-dimmed">
          {{ filteredVideos.length }} videos available
        </p>
      </div>
      <USelectMenu v-model="filterValue" :items="filters" class="w-full sm:w-52" />
    </div>

    <section>
      <p v-if="status === 'pending'">
        Loading videos...
      </p>
      <p v-else-if="fetchError" class="text-error">
        Unable to load videos: {{ fetchError.message }}
      </p>
      <p v-else-if="!filteredVideos.length">
        No videos found.
      </p>

      <ul v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="video in paginatedVideos" :key="video.id">
          <NuxtLink :to="`/training/${video.id}`" class="group block h-full">
            <UCard
              class="h-full overflow-hidden transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div class="relative aspect-video overflow-hidden bg-elevated">
                <img v-if="typeOfMedia(video.url) === 'youtube'"
                  :src="`https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`"
                  :alt="video.title || 'Training video'"
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-105">
                <div v-else
                  class="flex h-full items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-white">
                  <UIcon name="i-lucide-instagram" class="size-10" />
                </div>
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/25">
                  <span
                    class="flex size-12 scale-90 items-center justify-center rounded-full bg-white text-primary opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                    <UIcon name="i-lucide-play" class="size-5 fill-current" />
                  </span>
                </div>
              </div>
              <div class="space-y-2 p-1">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary">{{ video.category || 'Training'
                    }}</p>
                  <UIcon name="i-lucide-arrow-up-right" class="size-4 text-muted transition group-hover:text-primary" />
                </div>
                <h2 class="line-clamp-2 text-lg font-semibold">{{ video.title || 'Untitled training video' }}</h2>
                <p class="line-clamp-2 text-sm text-muted">{{ video.description || 'Open this video to start training.'
                  }}</p>
              </div>
            </UCard>
          </NuxtLink>
        </li>
      </ul>

      <div v-if="filteredVideos.length > pageSize" class="mt-10 flex justify-center">
        <UPagination v-model:page="page" :total="filteredVideos.length" :items-per-page="pageSize" />
      </div>
    </section>
  </UContainer>
</template>
