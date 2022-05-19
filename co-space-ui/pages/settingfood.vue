<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="box">
        <div class="columns">
          <div class="column is-4">
            <b-field label="ค้นหา">
              <b-input
                v-model="searchTerm"
                placeholder="คำค้นหา"
                size="is-small"
                @change="searchFromInput()"
                rounded
              ></b-input>
            </b-field>
          </div>
          <div class="column is-5"></div>
          <div class="column is-3 has-text-right">
            <b-button class="is-blue" @click="openAddFoodModal()"
              >เพิ่มอาหาร</b-button
            >
          </div>
        </div>
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
            <b-button
              size="is-small"
              type="is-warning is-light"
              @click="openEditFoodModal(props.row)"
              ><font-awesome-icon icon="pen-to-square" />
              แก้ไข
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="deleteFood(props.row.food_id)"
              icon-right="delete"
            >
              ลบรายการ
            </b-button>
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
        :modalData="Object.assign({}, modalData)"
        @close="closeEditFoodModal"
        @updateData="updateData"
      ></EditFoodModal>
    </b-modal>

    <b-modal
      v-model="isAddFoodModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
      @reload="getFoodList"
    >
      <AddFoodModal @close="closeAddFoodModal"></AddFoodModal>
    </b-modal>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingFood',
  middleware: ['auth'],
  components: {
    EditFoodModal: () => import('@/components/EditFoodModal'),
    AddFoodModal: () => import('@/components/AddFoodModal'),
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
      isAddFoodModal: false,
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

    async deleteFood(foodId) {
      let index = -1
      const response = await axios.delete(`/foods_delete/${foodId}`, {})
      if (response.data.success) {
        this.success()
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].food_id === foodId) {
            index = i
          }
        }
        if (index > -1) this.data.splice(index, 1)
      } else this.danger()
    },

    async searchFromInput() {
      await this.getFoodList()
    },
    openAddFoodModal() {
      this.isAddFoodModal = true
    },
    closeAddFoodModal() {
      this.isAddFoodModal = false
    },
    openEditFoodModal(val) {
      this.isEditFoodModal = true
      this.modalData = val
    },
    closeEditFoodModal() {
      this.isEditFoodModal = false
      this.modalData = {}
    },
    updateData(data) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].food_id === data.food_id) {
          this.data[i].food_name = data.food_name
          this.data[i].food_type = data.food_type
          this.data[i].price = parseFloat(data.price)
          this.data[i].food_image = data.food_image
          return
        }
      }
    },
    toThai(val) {
      if (val === 'bakery') return 'เบเกอรี่'
      else if (val === 'snack') return 'ขนมขบเคี้ยว'
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

<style scoped>
.is-blue {
  background: #70b6c2;
  color: white;
}
</style>
