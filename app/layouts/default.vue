<template>
  <div class="flex min-h-screen flex-col">
    <UHeader>
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <UNavigationMenu :items="headerItems" />

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <main class="flex-1">
      <slot />
    </main>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Cerebro-volley | Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <!--
        <UNavigationMenu :items="footerItems" variant="link" />

        <template #right>
          <UButton icon="i-simple-icons-discord" color="neutral" variant="ghost" to="https://go.nuxt.com/discord"
            target="_blank" aria-label="Discord" />
          <UButton icon="i-simple-icons-x" color="neutral" variant="ghost" to="https://go.nuxt.com/x" target="_blank"
            aria-label="X" />
          <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com/nuxt/nuxt"
            target="_blank" aria-label="GitHub" />
        </template>
      -->
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const headerItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Training',
    to: '/training',
    active: route.path.includes('/training')
  },
  {
    label: 'Reviews',
    to: '/reviews',
    active: route.path.includes('/reviews')
  }
])

// const footerItems: NavigationMenuItem[] = [
//   {
//     label: 'Figma Kit',
//     to: 'https://go.nuxt.com/figma-ui',
//     target: '_blank'
//   },
//   {
//     label: 'Playground',
//     to: 'https://stackblitz.com/edit/nuxt-ui',
//     target: '_blank'
//   },
//   {
//     label: 'Releases',
//     to: 'https://github.com/nuxt/ui/releases',
//     target: '_blank'
//   }
// ]
</script>

<style></style>
