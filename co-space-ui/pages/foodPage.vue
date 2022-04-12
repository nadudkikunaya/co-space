<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="columns">
        <div class="column is-3">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div class=""></div>
            </div>
            <footer class="card-footer">
              <div class="card-content">
                <div class="content has-text-centered"></div>
                <div class="">test</div>
              </div>
            </footer>
          </div>
        </div>

        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div class="">
                <b-table :data="productList" :columns="columns"></b-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'FoodPage',
  components: {},
  data() {
    return {
      productList: [],
      columns: [
        {
          field: 'product_id',
          label: 'ID',
          width: '40',
          numeric: true,
        },
        {
          field: 'product_name',
          label: 'Name',
        },
        {
          field: 'product_type',
          label: 'Type',
        },
        {
          field: 'price',
          label: 'Price',
          centered: true,
        },
        {
          field: 'quantity',
          label: 'Qty',
          width: '40',
          numeric: true,
        },
      ],
    }
  },
  async mounted() {
    await this.getFoodList()
  },
  methods: {
    async getFoodList() {
      const response = await axios.get(`/foodlist`, {})
      console.log(response.data.data)
      this.productList = response.data.data
    },
  },
}
</script>

<style lang="css" scope>
.full-height {
  height: 100vh;
}

.card-footer {
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
}
</style>
