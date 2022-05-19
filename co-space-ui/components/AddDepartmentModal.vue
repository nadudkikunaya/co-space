<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">เพิ่มแผนก</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่อแผนก">
          <b-input v-model="data.department_name"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button
          label="เพิ่มแผนก"
          @click="insertDepartment()"
          class="is-blue"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'AddDepartmentModal',
  props: {},

  components: {},
  data() {
    return {
      data: {
        department_name: '',
      },
    }
  },

  mounted() {},

  methods: {
    async insertDepartment() {
      if (this.data.department_name.trim() === '') {
        this.danger()
        return
      }

      const response = await axios.post(`/department`, {
        department_name: this.data.department_name,
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
<style scoped>
.is-blue {
  background: #70b6c2;
  color: white;
}
</style>
