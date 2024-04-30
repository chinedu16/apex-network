<script setup>
import TabItems from '../components/TabItems.vue'
import IconFilters from '../components/icons/IconFilters.vue'
import CustomInput from '../components/CustomInput.vue'
import CustomSelect from '../components/CustomSelect.vue'

import BasePagination from '../components/BasePagination.vue'

import { ref, computed, onMounted, watch } from 'vue'

const tabOptions = ['all', 'paid', 'unpaid', 'overdue']
const statusOptions = ['all', 'active', 'inactive']

const selectedTab = ref('all')
const name = ref('')
const amount = ref('')
const status = ref('all')

// Mock data
const data = ref([
  {
    id: 1,
    userStatus: 'Active',
    email: 'chiekoChute@gmail.com',
    paymentStatus: 'Paid',
    amount: '$100',
    name: 'John Doe'
  }
])

const selectedRows = ref([])
const selectAll = ref(false)
const transactionData = ref([])
const loading = ref(false)
const openDropdownIndex = ref(null)
const pageSize = ref(5)
const currentPage = ref(1)
const totalPages = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    const payload = {
      page: currentPage.value,
      per_page: pageSize.value,
      state: selectedTab.value
    }
    const queryParams = new URLSearchParams(payload).toString()
    const url = `https://apex-payments-eca4dc83534e.herokuapp.com/api/transactions?${queryParams}`
    const response = await fetch(url)
    const responseData = await response.json()
    transactionData.value = responseData.data
    totalPages.value = responseData.total
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

watch(selectedTab, () => {
  fetchData()
})

watch(status, () => {
  fetchData()
})

watch(amount, () => {
  fetchData()
})

watch(name, () => {
  fetchData()
})

// Computed
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return data.value.slice(startIndex, endIndex)
})

const selectAllRows = () => {
  if (selectAll.value) {
    selectedRows.value = data.value.map((item) => item.id)
  } else {
    selectedRows.value = []
  }
}

const toggleDropdown = (index) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index
}

const closeDropdown = () => {
  openDropdownIndex.value = null
}

const editItem = (index) => {
  console.log('Edit item:', paginatedData.value[index])
}

const viewProfile = (index) => {
  console.log('View profile:', paginatedData.value[index])
}

const deleteItem = (index) => {
  console.log('Delete item:', paginatedData.value[index])
}

const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    fetchData()
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    fetchData()
  }
}

const handleChangePageSize = (event) => {
  pageSize.value = event.target.value
  fetchData()
}

const handleTabChanges = (params) => {
  selectedTab.value = params
}

const handlePageChange = (pageNumber) => {
  currentPage.value = pageNumber
}

const handleStatusChanges = (params) => {
  selectedTab.value = params
}

const handleUserChanges = (params) => {
  status.value = params
}

function getPaymentStatus(paymentMadeAt, paymentExpectedAt) {
  const currentDate = new Date()

  if (paymentMadeAt) {
    return 'paid'
  } else if (paymentExpectedAt) {
    const expectedDate = new Date(paymentExpectedAt)

    if (currentDate > expectedDate) {
      return 'overdue'
    } else {
      return 'unpaid'
    }
  } else {
    return 'unknown'
  }
}

function formatDate(inputDate) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const dateObj = new Date(inputDate)
  const year = dateObj.getFullYear()
  const monthIndex = dateObj.getMonth()
  const month = months[monthIndex]
  const day = dateObj.getDate()

  return `${day} ${month}, ${year}`
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <main class="px-12 py-10">
    <div class="flex justify-between items-center">
      <TabItems
        @update:selectedTab="handleTabChanges"
        :options="tabOptions"
        :selectedTab="selectedTab"
        class="w-1/2"
      />
      <button
        class="bg-success text-white px-10 py-4 font-bold rounded-xl cursor-pointer transition-colors duration-300"
      >
        Pay Dues
      </button>
    </div>

    <div class="mt-4 rounded-2xl bg-white">
      <div class="w-full py-6 px-7 flex justify-end">
        <div
          class="bg-gray-50 border-border border text-success flex space-x-2 p-4 rounded-xl w-fit"
        >
          <IconFilters />
          <span>Filters</span>
        </div>
      </div>

      <div class="px-7 grid grid-cols-4 gap-4">
        <CustomInput v-model="name" label="Name" placeholder="name" />
        <CustomInput v-model="amount" label="Amount" placeholder="amount" />

        <CustomSelect
          :value="status"
          label="User’s Status"
          :options="statusOptions"
          @update:value="handleUserChanges"
        />
        <CustomSelect
          :options="tabOptions"
          label="Payment Status"
          :value="selectedTab"
          @update:value="handleStatusChanges"
        />
      </div>

      <div class="mt-8">
        <div>
          <table v-if="!loading" class="min-w-full divide-y border-b divide-gray-200">
            <thead>
              <tr class="border-t border-gray-200">
                <th
                  scope="col"
                  class="p-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <input type="checkbox" v-model="selectAll" @change="selectAllRows" />
                </th>
                <th scope="col" class="p-6 text-left font-medium text-sub-title capitalize">
                  Name
                </th>
                <th scope="col" class="p-6 text-left font-medium text-sub-title capitalize">
                  User Status
                </th>
                <th scope="col" class="p-6 text-left font-medium text-sub-title capitalize">
                  Payment Status
                </th>
                <th scope="col" class="p-6 text-left font-medium text-sub-title capitalize">
                  Amount
                </th>
                <th scope="col" class="p-6 text-left font-medium text-sub-title capitalize"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in transactionData" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" v-model="selectedRows" :value="item.id" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-bold">{{ item.user.name }}</div>
                  <div class="text-gray-500">{{ item.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="flex mb-1 items-center px-2 py-2 font-semibold text-sm rounded-lg space-x-1"
                    :class="{
                      'text-green-500 bg-green-100 w-fit': item.user.status === 'active',
                      'text-orange-500 bg-orange-100 w-fit': item.user.status === 'inactive'
                    }"
                  >
                    <svg
                      v-if="item.user.status !== 'all'"
                      width="7"
                      height="6"
                      viewBox="0 0 7 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="3.5" cy="3" r="3" fill="currentColor" />
                    </svg>
                    <span class="font-semibold capitalize">{{ item.user.status }}</span>
                  </div>
                  <div>Last Login: {{ formatDate(item.user.last_login_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="flex mb-1 items-center px-2 py-2 font-semibold text-sm rounded-lg space-x-1"
                    :class="{
                      'text-purple-500 bg-purple-100 w-fit':
                        getPaymentStatus(item.payment_made_at, item.payment_expected_at) === 'paid',
                      'text-yellow-500 bg-yellow-100 w-fit':
                        getPaymentStatus(item.payment_made_at, item.payment_expected_at) ===
                        'unpaid',
                      'text-red-500 bg-red-100 w-fit':
                        getPaymentStatus(item.payment_made_at, item.payment_expected_at) ===
                        'overdue'
                    }"
                  >
                    <svg
                      v-if="
                        getPaymentStatus(item.payment_made_at, item.payment_expected_at) !== 'all'
                      "
                      width="7"
                      height="6"
                      viewBox="0 0 7 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="3.5" cy="3" r="3" fill="currentColor" />
                    </svg>
                    <span class="font-semibold capitalize">{{
                      getPaymentStatus(item.payment_made_at, item.payment_expected_at)
                    }}</span>
                  </div>
                  <div>
                    {{
                      getPaymentStatus(item.payment_made_at, item.payment_expected_at) === 'unpaid'
                        ? 'Dues on'
                        : getPaymentStatus(item.payment_made_at, item.payment_expected_at) ===
                            'overdue'
                          ? 'Dued on'
                          : 'Paid on'
                    }}:
                    {{
                      getPaymentStatus(item.payment_made_at, item.payment_expected_at) ===
                        'unpaid' ||
                      getPaymentStatus(item.payment_made_at, item.payment_expected_at) === 'overdue'
                        ? formatDate(item.payment_expected_at)
                        : formatDate(item.payment_made_at)
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-bold">
                    {{ item.amount }}
                  </div>
                  <div class="text-gray-500">{{ item.currency }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative">
                    <button
                      @click="toggleDropdown(index)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        class="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM10 9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zM16 9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="openDropdownIndex === index"
                      @click="closeDropdown"
                      class="origin-top-right z-30 bg-white absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div class="py-1" role="none">
                        <a
                          @click="editItem(index)"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          >Edit</a
                        >
                        <a
                          @click="viewProfile(index)"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          >Profile</a
                        >
                        <a
                          @click="deleteItem(index)"
                          class="block px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                          role="menuitem"
                          >Delete</a
                        >
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="flex h-40 w-full justify-center items-center">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-green-500"
              role="status"
            >
              <span
                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
              >
            </div>
          </div>

          <BasePagination
            v-if="!loading"
            :totalPages="totalPages"
            :currentPage="currentPage"
            :pageSize="pageSize"
            @previousPage="handlePreviousPage"
            @nextPage="handleNextPage"
            @changePageSize="handleChangePageSize"
            @pageChange="handlePageChange"
          />
        </div>
      </div>
    </div>
  </main>
</template>
