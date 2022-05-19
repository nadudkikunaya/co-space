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
            <b-button class="is-blue" @click="openAddDepartmentModal()"
              >เพิ่มแผนก</b-button
            >
          </div>
        </div>
        <b-table
          :data="data === [] ? [] : data"
          :striped="isStriped"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column :field="field_1" label="ID" width="40" v-slot="props">
            {{ props.row.department_id }}
          </b-table-column>

          <b-table-column
            :field="field_2"
            label="ชื่อแผนก"
            width="500"
            v-slot="props"
          >
            {{ props.row.department_name }}
          </b-table-column>

          <b-table-column label="" v-slot="props">
            <b-button
              size="is-small"
              type="is-warning is-light"
              @click="openEditDepartmentModal(props.row)"
              ><font-awesome-icon icon="pen-to-square" />
              แก้ไข
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="deleteDepartment(props.row.department_id)"
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
      v-model="isEditDepartmentModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <EditDepartmentModal
        :modalData="Object.assign({}, modalData)"
        @close="closeEditDepartmentModal"
        @updateData="updateData"
      ></EditDepartmentModal>
    </b-modal>

    <b-modal
      v-model="isAddDepartmentModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
      @reload="getDepartmentList()"
    >
      <AddDepartmentModal @close="closeAddDepartmentModal"></AddDepartmentModal>
    </b-modal>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingDepartMent',
  components: {
    EditDepartmentModal: () => import('@/components/EditDepartmentModal'),
    AddDepartmentModal: () => import('@/components/AddDepartmentModal'),
  },
  data() {
    return {
      data: [],
      columns: [],
      hasMobileCards: true,
      isStriped: true,
      field_1: 'department_id',
      field_2: 'department_name',
      searchTerm: '',
      total: 0,
      page: 1,
      perPage: 20,
      isSimple: true,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      isEditDepartmentModal: false,
      isAddDepartmentModal: false,
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
    await this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const response = await axios.get(
        `/departments?page=${this.page}&perPage=${this.perPage}&searchTerm=${this.searchTerm}`,
        {}
      )
      this.data = response.data.data
      this.total = response.data.total
    },

    async deleteDepartment(departmentId) {
      let index = -1
      const response = await axios.delete(
        `/departments_delete/${departmentId}`,
        {}
      )
      if (response.data.success) {
        this.success()
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].department_id === departmentId) {
            index = i
          }
        }
        if (index > -1) this.data.splice(index, 1)
      } else this.danger()
    },

    async searchFromInput() {
      await this.getDepartmentList()
    },
    openAddDepartmentModal() {
      this.isAddDepartmentModal = true
    },
    closeAddDepartmentModal() {
      this.isAddDepartmentModal = false
    },
    openEditDepartmentModal(val) {
      this.isEditDepartmentModal = true
      this.modalData = val
    },
    closeEditDepartmentModal() {
      this.isEditDepartmentModal = false
      this.modalData = {}
    },
    updateData(data) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].department_id === data.department_id) {
          this.data[i].department_name = data.department_name
          return
        }
      }
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

<style scoped>
.is-blue {
  background: #70b6c2;
  color: white;
}
</style>
