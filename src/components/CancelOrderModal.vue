<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <transition name="modal">
        <div
          v-show="show"
          class="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div class="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 class="text-xl font-semibold text-slate-900">Cancel Order</h3>

            <button @click="$emit('close')" class="text-slate-500 hover:text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Reason for cancellation:
            </label>

            <textarea
              v-model="localReason"
              rows="4"
              class="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Please explain why you are cancelling this order..."
            ></textarea>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-200">
            <button
              @click="$emit('close')"
              class="px-4 py-2 rounded-md text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>

            <button
              @click="submit"
              :disabled="loading"
              class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ loading ? 'Cancelling…' : 'Confirm' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'

const props = defineProps<{
  show: boolean
  loading: boolean
}>()

const { show, loading } = toRefs(props)

const emit = defineEmits(['close', 'submit'])

const localReason = ref('')

watch(show, (val) => {
  if (val) localReason.value = ''
})

const submit = () => {
  emit('submit', localReason.value)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>
