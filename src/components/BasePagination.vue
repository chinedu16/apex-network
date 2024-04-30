<template>
  <div class="mt-10 px-7 pb-8 flex items-center justify-between">
    <div class="flex-1 flex items-center justify-between">
      <div class="space-x-4">
        <span class="text-gray-500">Show result:</span>
        <select
          :value="pageSize"
          @change="changePageSize"
          class="relative z-0 inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div>
        <nav class="relative flex items-center rounded-md" aria-label="Pagination">
          <button
            @click="emitPreviousPage"
            :disabled="currentPage === 1"
            :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
            class="relative inline-flex items-center px-4 py-3 bg-white text-sm font-medium text-gray-500 focus:z-10"
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.96338 1.00098L1.96338 6.00098L6.96338 11.001"
                stroke="#A0AEC0"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Page numbers -->
          <div class="flex space-x-2">
            <!-- First 4 page numbers -->
            Page {{ currentPage }}
          </div>

          <!-- Next button -->
          <button
            @click="emitNextPage"
            :disabled="currentPage === totalPages"
            :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
            class="relative inline-flex items-center px-4 py-3 bg-white text-sm font-medium text-gray-500 focus:z-10"
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.96338 1.00098L6.96338 6.00098L1.96338 11.001"
                stroke="#A0AEC0"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
  pageSize: Number
})

const emits = defineEmits(['previousPage', 'nextPage', 'changePageSize', 'pageChange'])

const emitPreviousPage = () => {
  emits('previousPage')
}

const emitNextPage = () => {
  emits('nextPage')
}

const emitPageChange = (pageNumber) => {
  emits('pageChange', pageNumber)
}

const changePageSize = (event) => {
  emits('changePageSize', event)
}
</script>
