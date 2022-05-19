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

                <div v-for="item in selectedList" :key="item.book_id">
                  <SelectedFood
                    :name="item.book_name"
                    :price="parseInt(item.price)"
                    :selectedQuantity="item.selectedQuantity"
                    page="book"
                    :quantity="item.quantity"
                    @updateQuantity="updateQuantity"
                  ></SelectedFood>
                </div>
              </div>
            </div>
            <div class="card-content bg-blue">
              <div class="content">
                <div class="columns">
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-8">
                        <b-input
                          v-model="memberId"
                          size="is-small"
                          rounded
                        ></b-input>
                      </div>
                      <div class="column is-4">
                        <p>{{ memberDetails.member_firstname }}</p>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-8">
                        <div class="box">
                          <p>ราคา : {{ realPrice }}</p>
                          <p>ส่วนลด : {{ discount }}</p>
                          <p>รวม : {{ total_price }}</p>
                        </div>
                      </div>
                      <div class="column is-4">
                        <b-button class="is-grey" @click="clear"
                          >เคลียร์</b-button
                        >
                        <b-button class="is-purple" @click="createTransaction"
                          >คิดเงิน</b-button
                        >
                      </div>
                    </div>
                  </div>
                  <!-- <div class="column is-4">
                    <div class="columns">
                      <div class="column">
                        <p>{{ memberDetails.member_firstname }}</p>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column">
                        <b-button class="is-grey" @click="clear"
                          >เคลียร์</b-button
                        >
                        <b-button class="is-purple" @click="createTransaction"
                          >คิดเงิน</b-button
                        >
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <b-tabs v-model="selectedTab">
                <b-tab-item label="เบ็ดเตล็ด"></b-tab-item>
                <b-tab-item label="พัฒนาตนเอง"></b-tab-item>
                <b-tab-item label="การ์ตูน"></b-tab-item>
                <b-tab-item label="การศึกษา"></b-tab-item>
                <b-tab-item label="อาหาร"></b-tab-item>
              </b-tabs>

              <div class="content has-text-centered"></div>
              <div class="columns">
                <div class="column is-4">
                  <b-field label="ค้นหา">
                    <b-input
                      v-model="searchTerm"
                      placeholder="คำค้นหา"
                      size="is-small"
                      rounded
                    ></b-input>
                  </b-field>
                </div>
              </div>
              <div
                v-for="row in Math.ceil(productList.length / 4)"
                :key="row.book_id"
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
                    :name="productList[4 * (row - 1) + (i - 1)].book_name"
                    :img="productList[4 * (row - 1) + (i - 1)].book_image"
                    :price="
                      parseInt(productList[4 * (row - 1) + (i - 1)].price)
                    "
                    :quantity="productList[4 * (row - 1) + (i - 1)].quantity"
                    page="book"
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
  name: 'BookPage',
  middleware: ['auth'],
  components: {},
  data() {
    return {
      productList: [],
      selectedList: [],
      total_price: 0,
      memberId: '',
      selectedTab: 0,
      memberDetails: '',
      discount: 0,
      realPrice: 0,
      searchTerm: '',
    }
  },
  watch: {
    selectedTab(value) {
      this.updateMenu(value)
    },

    memberId(value) {
      setTimeout(() => {
        if (value.length > 0 && value !== undefined && value !== null) {
          this.getMemberDetails()
        } else if (value === '') {
          this.memberDetails = ''
          this.updateTotal()
        }
      }, 1000)
    },

    searchTerm(value) {
      setTimeout(() => {
        this.getBookList(this.indexToType(this.selectedTab))
      }, 1000)
    },
  },
  async mounted() {
    await this.getBookList('เบ็ดเตล็ด')
  },
  methods: {
    async getBookList(type) {
      const response = await axios.get(
        `/booklist?type=${type}&searchTerm=${this.searchTerm}`,
        {}
      )
      this.productList = response.data.data
    },

    async getMemberDetails() {
      const response = await axios.get(`/members_get/${this.memberId}`, {})
      this.memberDetails = response.data.data || ''
      if (response.data.success) this.updateTotal()
    },

    async createTransaction() {
      const response = await axios.post(`/sale_books`, {
        selectedList: this.selectedList,
        total: this.realPrice,
        member_id: this.memberDetails?.member_id || null,
        discount: this.discount,
      })
      if (response.data.success) {
        this.success()
        this.clear()
        this.selectedTab = 0
        this.getBookList('เบ็ดเตล็ด')
        this.searchTerm = ''
      } else {
        this.danger()
      }
    },
    addToSelectedList(item) {
      let found = -1
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].book_name === item.book_name) {
          found = i
          break
        }
      }
      if (found === -1 && item.quantity > 0) {
        item.selectedQuantity = 1
        this.selectedList.push(item)
        this.updateTotal()
      } else {
        this.dangerNotEnough()
      }
    },
    updateQuantity(name, qnt) {
      let index = -1
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].book_name === name) {
          index = i
          break
        }
      }

      if (index === -1) {
        console.log('not found')
        return
      }

      this.selectedList[index].selectedQuantity = qnt

      if (this.selectedList[index].selectedQuantity <= 0) {
        this.selectedList.splice(index, 1)
      }

      this.updateTotal()
    },
    updateTotal() {
      let newPrice = 0
      for (const item of this.selectedList) {
        newPrice += item.price * item.selectedQuantity
      }
      this.realPrice = newPrice
      if (this.memberDetails !== '') {
        this.total_price = newPrice * 0.9
        this.discount = newPrice * 0.1
      } else this.total_price = newPrice
    },

    clear() {
      this.total_price = 0
      this.selectedList = []
      this.memberId = ''
      this.memberDetails = ''
      this.realPrice = 0
      this.total_price = 0
      this.discount = 0
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

    updateMenu(index) {
      this.getBookList(this.indexToType(index))
    },
    indexToType(index) {
      if (index === 0) {
        return 'เบ็ดเตล็ด'
      } else if (index === 1) {
        return 'พัฒนาตนเอง'
      } else if (index === 2) {
        return 'การ์ตูน'
      } else if (index === 3) {
        return 'การศึกษา'
      } else if (index === 4) {
        return 'อาหาร'
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
    dangerNotEnough() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `หนังสือหมดแล้ว`,
        type: 'is-danger',
      })
    },
  },
}
</script>

<style lang="css" scope>
.full-height {
  display: flex;
  position: relative;
}

.card-footer {
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
}

.bg-blue {
  background-color: #70b6c2;
}

.price-section {
  background-color: white;
  border-radius: 30%;
}

.is-purple {
  background-color: #617fab;
  color: white;
}

.is-grey {
  background-color: #bababa;
  color: white;
}
</style>
