<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="columns">
        <div class="column is-3">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div class="">
                <!-- <div class="">{{ selectedItem }}</div> -->

                <div v-for="item in selectedList" :key="item.food_id">
                  <SelectedFood
                    @updateQuantity="updateQuantity"
                    :name="item.food_name"
                    :price="parseInt(item.price)"
                    :quantity="item.quantity"
                  ></SelectedFood>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="content has-text-centered">
                <div class="columns">
                  <div class="column is-4">
                    <input type="text" @keydown="searchMember" />
                    {{ memberId }}
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-4">total : {{ total_price }}</div>
                  <div class="column is-4">
                    <button>Buy</button>
                    <button @click="clear">clear</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div
                v-for="row in Math.ceil(productList.length / 4)"
                :key="row.food_id"
                class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fullhd"
              >
                <div
                  v-for="i in 4"
                  :key="i"
                  class="column is-3"
                  @click="
                    addToSelectedList(productList[4 * (row - 1) + (i - 1)])
                  "
                >
                  <FoodCard
                    v-if="4 * (row - 1) + (i - 1) <= productList.length - 1"
                    :name="productList[4 * (row - 1) + (i - 1)].food_name"
                    :img="productList[4 * (row - 1) + (i - 1)].food_image"
                    :price="
                      parseInt(productList[4 * (row - 1) + (i - 1)].price)
                    "
                  ></FoodCard>
                </div>
                <!-- <div
                class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
              >

                <b-table :data="productList" :columns="columns"></b-table> >
              </div> -->
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
      selectedItem: [],
      selectedList: [],
      total_price: 0,
      memberId: '',
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
    addToSelectedList(item) {
      const found = this.selectedItem.indexOf(item.food_name)
      if (found === -1) {
        this.selectedItem.push(item.food_name)
        item.quantity = 1
        this.selectedList.push(item)
      }
      this.updateTotal()
    },
    updateQuantity(name, qnt) {
      let index = -1
      let itemIndex = -1
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].food_name === name) {
          index = i
          break
        }
      }

      if (index === -1) {
        console.log('not found')
        return
      }

      this.selectedList[index].quantity = qnt

      if (this.selectedList[index].quantity <= 0) {
        itemIndex = this.selectedItem.indexOf(name)
        this.selectedList.splice(index, 1)
        this.selectedItem.splice(itemIndex, 1)
      }

      this.updateTotal()
    },
    updateTotal() {
      let newPrice = 0
      for (const item of this.selectedList) {
        newPrice += item.price * item.quantity
      }
      this.total_price = newPrice
    },

    clear() {
      this.total_price = 0
      this.selectedItem = []
      this.selectedList = []
    },

    searchMember(e) {
      if (e.code === 'Backspace') {
        this.memberId = this.memberId.substring(0, this.memberId.length - 1)
      }
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 97 && e.keyCode <= 122)
      ) {
        console.log(e.key)
        this.memberId += e.key
      }
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
