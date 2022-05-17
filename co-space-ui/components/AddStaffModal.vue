<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">เพิ่มพนักงาน</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่อพนักงาน">
          <b-input v-model="data.staff_name"></b-input>
        </b-field>
        <b-field label="ชื่อผู้ใช้">
          <b-input v-model="data.staff_username"></b-input>
        </b-field>
        <b-field label="รหัส">
          <b-input v-model="data.staff_password_hash"></b-input>
        </b-field>
        <b-field label="เพศ">
          <b-select placeholder="เพศ" v-model="data.gender" expanded>
            <option v-for="value of genderArr" :value="value" :key="value">
              {{ toThai(value) }}
            </option>
          </b-select>
        </b-field>
        <b-field label="แผนก">
          <b-select placeholder="แผนก" v-model="data.department_id" expanded>
            <option
              v-for="value of departArr"
              :value="value.department_id"
              :key="value.department_id"
            >
              {{ value.department_name }}
            </option>
          </b-select>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button
          label="เพิ่มพนักงาน"
          @click="insertStaff()"
          type="is-primary"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'AddStaffModal',
  props: {},

  components: {},
  data() {
    return {
      data: {
        staff_name: '',
        staff_username: '',
        staff_password_hash: '',
        gender: '',
        department_id: '',
      },
      genderArr: ['male', 'female', 'others'],
      departArr: [],
    }
  },

  async mounted() {
    await this.getDepartment()
  },

  methods: {
    async getDepartment() {
      const response = await axios.get(`/department_name`, {})
      this.departArr = response.data.data
    },
    async insertStaff() {
      if (
        this.data.staff_name.trim() === '' ||
        this.data.staff_username.trim() === '' ||
        this.data.staff_password_hash.trim() === '' ||
        this.data.gender.trim() === '' ||
        this.data.department_id === undefined ||
        this.data.department_id === null
      ) {
        this.danger()
        return
      }

      const response = await axios.post(`/staffs`, {
        staff_name: this.data.staff_name,
        staff_username: this.data.staff_username,
        staff_password_hash: this.data.staff_password_hash,
        gender: this.data.gender,
        department_id: this.data.department_id,
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
      if (val === 'male') return 'ชาย'
      else if (val === 'female') return 'หญิง'
      else if (val === 'others') return 'อื่นๆ'
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
