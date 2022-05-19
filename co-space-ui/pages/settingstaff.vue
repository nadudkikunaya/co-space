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
            <b-button class="is-blue" @click="openAddStaffModal()"
              >เพิ่มพนักงาน</b-button
            >
          </div>
        </div>
        <b-table
          :data="data === [] ? [] : data"
          :striped="isStriped"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column :field="field_1" label="ID" width="40" v-slot="props">
            {{ props.row.staff_id }}
          </b-table-column>

          <b-table-column
            :field="field_2"
            label="ชื่อพนักงาน"
            width="500"
            v-slot="props"
          >
            {{ props.row.staff_name }}
          </b-table-column>
          <b-table-column
            :field="field_3"
            label="แผนก"
            width="500"
            v-slot="props"
          >
            {{ toDepartName(props.row.department_id) }}
          </b-table-column>
          <b-table-column
            :field="field_4"
            label="เพศ"
            width="100"
            v-slot="props"
          >
            {{ toThai(props.row.gender) }}
          </b-table-column>
          <b-table-column label="" v-slot="props">
            <b-button
              size="is-small"
              type="is-warning is-light"
              @click="openEditStaffModal(props.row)"
              ><font-awesome-icon icon="pen-to-square" />
              แก้ไข
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="deleteStaff(props.row.staff_id)"
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
      v-model="isEditStaffModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <EditStaffModal
        :modalData="Object.assign({}, modalData)"
        @close="closeEditStaffModal"
        @updateData="updateData"
      ></EditStaffModal>
    </b-modal>

    <b-modal
      v-model="isAddStaffModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
      @reload="getStaffList()"
    >
      <AddStaffModal @close="closeAddStaffModal"></AddStaffModal>
    </b-modal>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingStaff',
  middleware: ['auth'],
  components: {
    EditStaffModal: () => import('@/components/EditStaffModal'),
    AddStaffModal: () => import('@/components/AddStaffModal'),
  },
  data() {
    return {
      data: [],
      columns: [],
      hasMobileCards: true,
      isStriped: true,
      field_1: 'staff_id',
      field_2: 'staff_name',
      searchTerm: '',
      total: 0,
      page: 1,
      perPage: 20,
      isSimple: true,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      isEditStaffModal: false,
      isAddStaffModal: false,
      modalData: {},
      departArr: [],
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
    await this.getStaffList()
    await this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const response = await axios.get(`/department_name`, {})
      this.departArr = response.data.data
    },
    async getStaffList() {
      const response = await axios.get(
        `/staffs?page=${this.page}&perPage=${this.perPage}&searchTerm=${this.searchTerm}`,
        {}
      )
      this.data = response.data.data
      this.total = response.data.total
    },

    async deleteStaff(staffId) {
      let index = -1
      const response = await axios.delete(`/staffs_delete/${staffId}`, {})
      if (response.data.success) {
        this.success()
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].staff_id === staffId) {
            index = i
          }
        }
        if (index > -1) this.data.splice(index, 1)
      } else this.danger()
    },

    async searchFromInput() {
      await this.getStaffList()
    },
    openAddStaffModal() {
      this.isAddStaffModal = true
    },
    closeAddStaffModal() {
      this.isAddStaffModal = false
    },
    openEditStaffModal(val) {
      this.isEditStaffModal = true
      this.modalData = val
    },
    closeEditStaffModal() {
      this.isEditStaffModal = false
      this.modalData = {}
    },
    updateData(data) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].staff_id === data.staff_id) {
          this.data[i].staff_name = data.staff_name
          this.data[i].staff_username = data.staff_username
          this.data[i].staff_password_hash = data.staff_password_hash
          this.data[i].gender = data.gender
          this.data[i].department_id = data.department_id
          return
        }
      }
    },
    toDepartName(val) {
      for (let i = 0; i < this.departArr.length; i++) {
        if (this.departArr[i].department_id === val) {
          return this.departArr[i].department_name
        }
      }
    },
    toThai(val) {
      if (val === 'male') return 'ชาย'
      else if (val === 'female') return 'หญิง'
      else if (val === 'others') return 'อื่นๆ'
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
