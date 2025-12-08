<template>
  <RouterLink
    :to="to"
    :class="[
      'flex items-center gap-2 text-sm font-medium px-2 py-2 rounded-md transition',
      isActive
        ? 'text-blue-600 font-semibold bg-slate-100'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
      block ? 'w-full block' : '',
    ]"
  >
    <slot>{{ label }}</slot>
    <span
      v-if="count"
      class="ml-2 text-xs font-semibold bg-slate-800 text-white rounded-full px-2 py-0.5"
    >
      {{ count }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

interface Props {
  to: string
  label?: string
  count?: number
  block?: boolean
}
const props = defineProps<Props>()
const route = useRoute()
const isActive = computed(() => route.path === props.to)
const { to, label, count, block } = props
</script>
