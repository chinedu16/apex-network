<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['update:selectedTab'])
const selectedTab = ref(props.selectedTab)

const selectTab = (option: string) => {
  selectedTab.value = option
  emits('update:selectedTab', option)
}

// Watch for changes to the selectedTab prop from the parent
watch(
  () => props.selectedTab,
  (newValue) => {
    selectedTab.value = newValue
  }
)
</script>

<template>
  <div class="flex space-x-6 border-b border-border">
    <button
      v-for="(option, index) in options"
      :key="index"
      @click="selectTab(option as string)"
      :class="{
        'text-success font-semibold border-b-2 border-success': selectedTab === option,
        'text-sub-title': selectedTab !== option
      }"
      class="px-2 py-3 font-normal cursor-pointer capitalize transition-colors duration-300"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped></style>
