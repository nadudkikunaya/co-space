<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">แก้ไขข้อมูลหนังสือ</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        {{ data }}

        <b-field label="ชื่อหนังสือ">
          <b-input v-model="data.book_name"></b-input>
        </b-field>

        <b-field label="ชนิดหนังสือ">
          <b-select placeholder="ชนิดหนังสือ" v-model="data.book_type" expanded>
            <option v-for="value of foodTypeArr" :value="value" :key="value">
              {{ value }}
            </option>
          </b-select>
        </b-field>
        <b-field label="ราคา">
          <b-input v-model="data.price"></b-input>
        </b-field>
        <b-field label="จำนวน">
          <b-input v-model="data.quantity"></b-input>
        </b-field>
        <b-field label="รูปภาพ">
          <b-input v-model="data.book_image"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button
          label="อัพเดทข้อมูล"
          @click="updateData()"
          type="is-primary"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'EditBookModal',
  props: {
    modalData: {
      type: Object,
      required: true,
    },
  },

  components: {},
  data() {
    return {
      data: this.modalData,
      isUpdate: false,

      foodTypeArr: ['พัฒนาตนเอง'],
    }
  },

  mounted() {},

  methods: {
    async updateBook() {
      if (
        this.data.book_type.trim() === '' ||
        this.data.book_name.trim() === '' ||
        this.data.quantity < 0
      ) {
        this.danger()
        return
      }
      if (this.data.book_image === '') this.data.book_image = null
      const response = await axios.put(`/books`, {
        book_id: Number(this.data.book_id),
        book_name: this.data.book_name,
        book_type: this.data.book_type,
        price: Number(this.data.price),
        quantity: Number(this.data.quantity),
        book_image: this.data.book_image,
      })
      if (response.data.success) {
        this.success()
      } else this.danger()
    },
    closeModal() {
      this.$emit('close')
    },
    async updateData() {
      await this.updateBook()
      this.$emit('updateData', this.data)
      this.closeModal()
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
