<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">แก้ไขแผนก</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่อแผนก">
          <b-input v-model="data.department_name"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button label="แก้ไขแผนก" @click="updateData()" type="is-primary" />
      </footer>
    </div>
  </form>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'EditDepartmentModal',
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
    }
  },

  mounted() {},

  methods: {
    async updateDepartment() {
      console.log('test')
      if (this.data.department_name.trim() === '') {
        this.danger()
        return
      }
      const response = await axios.put(`/departments_put`, {
        department_id: this.data.department_id,
        department_name: this.data.department_name,
      })
      if (response.data.success) {
        this.success()
      } else this.danger()
    },
    closeModal() {
      this.$emit('close')
    },
    async updateData() {
      await this.updateDepartment()
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
