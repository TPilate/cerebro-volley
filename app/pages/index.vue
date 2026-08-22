<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Training Video',
    to: '/training',
    icon: 'i-lucide-square-play'
  },
  {
    label: 'Reviews',
    to: '/reviews',
    color: 'neutral',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageHero title="Cerebro VolleyBall"
    description="This web app has been created to regroup data for volleyball player trying to search to improve there game."
    headline="Current version | v.0.1" :links="links" />
</template>
