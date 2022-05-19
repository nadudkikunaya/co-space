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
            <b-button class="is-blue" @click="openAddBookModal()"
              >เพิ่มหนังสือ</b-button
            >
          </div>
        </div>
        <b-table
          :data="data === [] ? [] : data"
          :striped="isStriped"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column :field="field_1" label="ID" width="40" v-slot="props">
            {{ props.row.book_id }}
          </b-table-column>

          <b-table-column
            :field="field_2"
            label="ชื่อ"
            width="500"
            v-slot="props"
          >
            {{ props.row.book_name }}
          </b-table-column>

          <b-table-column
            :field="field_3"
            label="ประเภท"
            width="200"
            v-slot="props"
          >
            {{ props.row.book_type }}
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

          <b-table-column
            :field="field_5"
            label="จำนวน"
            width="40"
            numeric
            v-slot="props"
          >
            {{ props.row.quantity }}
          </b-table-column>

          <b-table-column label="" v-slot="props">
            <b-button
              size="is-small"
              type="is-warning is-light"
              @click="openEditBookModal(props.row)"
              ><font-awesome-icon icon="pen-to-square" />
              แก้ไข
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="deleteBook(props.row.book_id)"
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
      v-model="isEditBookModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <EditBookModal
        :modalData="Object.assign({}, modalData)"
        @close="closeEditBookModal"
        @updateData="updateData"
      ></EditBookModal>
    </b-modal>

    <b-modal
      v-model="isAddBookModal"
      :width="900"
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
      @reload="getBookList"
    >
      <AddBookModal @close="closeAddBookModal"></AddBookModal>
    </b-modal>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingBook',
  middleware: ['auth'],
  components: {
    EditBookModal: () => import('@/components/EditBookModal'),
    AddBookModal: () => import('@/components/AddBookModal'),
  },
  data() {
    return {
      data: [],
      columns: [],
      hasMobileCards: true,
      isStriped: true,
      field_1: 'book_id',
      field_2: 'book_name',
      field_3: 'book_type',
      field_4: 'price',
      field_5: 'quantity',
      searchTerm: '',
      total: 0,
      page: 1,
      perPage: 20,
      isSimple: true,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      isEditBookModal: false,
      isAddBookModal: false,
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
    await this.getBookList()
  },
  methods: {
    async getBookList() {
      const response = await axios.get(
        `/books?page=${this.page}&perPage=${this.perPage}&searchTerm=${this.searchTerm}`,
        {}
      )
      console.log(response)
      this.data = response.data.data
      this.total = response.data.total
    },

    async deleteBook(bookId) {
      let index = -1
      const response = await axios.delete(`/books_delete/${bookId}`, {})
      if (response.data.success) {
        this.success()
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].book_id === bookId) {
            index = i
          }
        }
        if (index > -1) this.data.splice(index, 1)
      } else this.danger()
    },

    async searchFromInput() {
      await this.getBookList()
    },
    openAddBookModal() {
      this.isAddBookModal = true
    },
    closeAddBookModal() {
      this.isAddBookModal = false
    },
    openEditBookModal(val) {
      this.isEditBookModal = true
      this.modalData = val
    },
    closeEditBookModal() {
      this.isEditBookModal = false
      this.modalData = {}
    },
    updateData(data) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].book_id === data.book_id) {
          this.data[i].book_name = data.book_name
          this.data[i].book_type = data.book_type
          this.data[i].price = data.price
          this.data[i].quantity = data.quantity
          this.data[i].book_image = data.book_image
          return
        }
      }
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
