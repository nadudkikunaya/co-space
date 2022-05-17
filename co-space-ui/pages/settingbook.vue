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
            width="50"
            numeric
            v-slot="props"
          >
            {{ props.row.quantity || '-' }}
          </b-table-column>

          <b-table-column label="" v-slot="props">
            <button @click="test(props.row.food_id)">edit</button>
            <button @click="test(props.row.food_id)">delete</button>
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
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'SettingBook',
  components: {},
  data() {
    return {
      selectedTab: 0,
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
      this.data = response.data.data
      this.total = response.data.total
    },
    async searchFromInput() {
      await this.getBookList()
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
