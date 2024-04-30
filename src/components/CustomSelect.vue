<template>
  <div class="relative">
    <div class="font-bold mb-1">{{ label }}</div>
    <div class="inline-block w-full h-10">
      <button
        @click="toggleDropdown"
        :class="[buttonClass]"
        :aria-expanded="isOpen"
        class="flex items-center justify-between w-full h-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-success focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
        aria-haspopup="listbox"
      >
        <span>{{ selectedOption }}</span>
        <svg
          width="13"
          height="8"
          viewBox="0 0 13 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.48169 1.5L6.48169 6.5L11.4817 1.5"
            stroke="#A0AEC0"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-lg">
      <ul
        class="p-2 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
      >
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          :class="{
            'bg-gray-100': selectedOption === option,
            'text-gray-900': selectedOption !== option
          }"
          class="cursor-pointer rounded-xl select-none relative p-4"
          role="option"
        >
          <div
            class="flex items-center space-x-1"
            :class="{
              'text-green-500': option === 'active',
              'text-orange-500': option === 'inactive',
              'text-purple-500': option === 'paid',
              'text-yellow-500': option === 'unpaid',
              'text-red-500': option === 'overdue'
            }"
          >
            <svg
              v-if="option !== 'all'"
              width="7"
              height="6"
              viewBox="0 0 7 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3.5" cy="3" r="3" fill="currentColor" />
            </svg>
            <span class="block truncate capitalize">{{ option }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  buttonClass: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  }
})

const isOpen = ref(false)
const emits = defineEmits(['update:value'])
let selectedOption = ref(props.value)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  selectedOption.value = option
  emits('update:value', option)
  isOpen.value = false
}

watch(
  () => props.value,
  (newValue) => {
    selectedOption.value = newValue
  }
)
</script>

<style scoped></style>
