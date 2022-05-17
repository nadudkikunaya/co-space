<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">เพิ่มข้อมูลอาหาร</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่ออาหาร">
          <b-input v-model="data.food_name"></b-input>
        </b-field>

        <b-field label="ชนิดอาหาร">
          <b-select placeholder="ชนิดอาหาร" v-model="data.food_type" expanded>
            <option v-for="value of foodTypeArr" :value="value" :key="value">
              {{ toThai(value) }}
            </option>
          </b-select>
        </b-field>
        <b-field label="ราคา">
          <b-input v-model="data.price"></b-input>
        </b-field>
        <b-field label="รูปภาพ">
          <b-input v-model="data.food_image"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button label="เพิ่มอาหาร" @click="insertFood()" type="is-primary" />
      </footer>
    </div>
  </form>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'AddFoodModal',
  props: {},

  components: {},
  data() {
    return {
      data: {
        food_name: '',
        food_type: '',
        price: '',
        food_image: '',
      },

      foodTypeArr: ['beverage', 'snack', 'bakery'],
    }
  },

  mounted() {},

  methods: {
    async insertFood() {
      if (
        this.data.food_type.trim() === '' ||
        this.data.food_name.trim() === ''
      ) {
        this.danger()
        return
      }
      if (this.data.food_image === '') this.data.food_image = null
      const response = await axios.post(`/food`, {
        food_name: this.data.food_name,
        food_type: this.data.food_type,
        price: parseFloat(this.data.price),
        food_image: this.data.food_image,
      })
      if (response.data.success) {
        this.success()
        this.closeModal()
      } else this.danger()
    },
    closeModal() {
      this.$emit('close')
      this.$emit('reload')
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
