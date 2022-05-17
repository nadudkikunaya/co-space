<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="box">
        <b-input
          v-model="searchTerm"
          @change="searchFromInput()"
          size="is-small"
          rounded
        ></b-input>
        <b-table
          :data="data === [] ? [] : data"
          :striped="isStriped"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column :field="field_1" label="ID" width="40" v-slot="props">
            {{ props.row.food_id }}
          </b-table-column>

          <b-table-column
            :field="field_2"
            label="ชื่อ"
            width="500"
            v-slot="props"
          >
            {{ props.row.food_name }}
          </b-table-column>

          <b-table-column
            :field="field_3"
            label="ประเภท"
            width="200"
            v-slot="props"
          >
            {{ toThai(props.row.food_type) }}
          </b-table-column>

          <b-table-column
            :field="field_4"
            label="ราคา"
            width="40"
            numeric
            v-slot="props"
          >
            {{ props.row.price }}
          </b-table-column>

          <b-table-column label="" v-slot="props">
            <button @click="openEditFoodModal(props.row)">edit</button>
            <button @click="deleteFood(props.row.food_id)">delete</button>
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">No records</div>
          </template>
        </b-table>
        <hr />
        <b-pagination
          :total="total"
          v-model="page"
          :simple="isSimple"
          :per-page="perPage"
          :icon-prev="prevIcon"
          :icon-next="nextIcon"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          @change="searchFromInput()"
        >
        </b-pagination>
        <!-- <b-table
          cellClass="has-text-left"
          :data="data"
          :columns="columns"
        ></b-table> -->
      </div>
    </section>
    <b-modal
      v-model="isEditFoodModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <EditFoodModal
        @close="closeEditFoodModal"
        :modalData="modalData"
      ></EditFoodModal>
    </b-modal>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingFood',
  components: {
    EditFoodModal: () => import('@/components/EditFoodModal'),
  },
  data() {
    return {
      data: [],
      columns: [],
      hasMobileCards: true,
      isStriped: true,
      field_1: 'food_id',
      field_2: 'food_name',
      field_3: 'food_type',
      field_4: 'price',
      searchTerm: '',
      total: 0,
      page: 1,
      perPage: 20,
      isSimple: true,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      isEditFoodModal: false,
      modalData: {},
    }
  },
  watch: {
    searchTerm(value) {
      setTimeout(() => {
        this.searchFromInput()
      }, 1000)
    },
  },
  async mounted() {
    await this.getFoodList()
  },
  methods: {
    async getFoodList() {
      const response = await axios.get(
        `/foods?page=${this.page}&perPage=${this.perPage}&searchTerm=${this.searchTerm}`,
        {}
      )
      console.log(response)
      this.data = response.data.data
      this.total = response.data.total
    },
    async getBookList() {
      const response = await axios.get(
        `/books?page=${this.page}&perPage=${this.perPage}&searchTerm=${this.searchTerm}`,
        {}
      )
      this.data = response.data.data
      this.total = response.data.total
    },
    async searchFromInput() {
      await this.getFoodList()
    },
    openEditFoodModal(val) {
      this.isEditFoodModal = true
      this.modalData = val
    },
    closeEditFoodModal() {
      this.isEditFoodModal = false
      this.modalData = {}
    },
    toThai(val) {
      if (val === 'bakery') return 'เบเกอรี่'
      else if (val === 'snack') return 'ขนมชบเคี้ยว'
      else if (val === 'beverage') return 'เครื่องเดื่ม'
    },
    success() {
      this.$buefy.toast.open({
        message: 'ทำรายการสำเร็จ',
        type: 'is-success',
      })
    },
    danger() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `ทำรายการไม่สำเร็จ`,
        type: 'is-danger',
      })
    },
  },
}
</script>
