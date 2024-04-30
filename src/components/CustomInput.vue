<template>
  <div>
    <div class="font-bold mb-1">{{ label }}</div>
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :class="[inputClass]"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block bg-gray-100 w-full h-10 px-4 py-2 rounded-md border focus:border-success focus:bg-white focus:outline-none transition duration-300"
    />
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const inputValue = ref(props.modelValue)
</script>

<style scoped></style>
