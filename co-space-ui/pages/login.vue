<template>
  <div>
    <section class="section is-medium">
      <div
        class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
      >
        <div class="column is-3"></div>
        <div class="column is-6">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered">
                <p class="title">ลงชื่อเข้าใช้งาน</p>
                <div class="columns">
                  <div class="column is-12">
                    <b-input
                      v-model="username"
                      size="is-medium"
                      placeholder="ชื่อผู้ใช้"
                      rounded
                    ></b-input>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-12">
                    <b-input
                      v-model="password"
                      size="is-medium"
                      rounded
                      placeholder="รหัสผ่าน"
                    ></b-input>
                  </div>
                </div>
                <b-button size="is-medium bg-blue" @click="addMember"
                  >ลงชื่อเข้าสู่ระบบ</b-button
                >
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
  name: 'LoginPage',
  components: {},
  data() {
    return {
      username: '',
      password: '',
    }
  },
  mounted() {},
  methods: {
    async addVisit() {
      const response = await axios.post(`/visit`, {
        memberId: this.memberId,
      })
      if (response.data.success) {
        this.success()
        this.clear()
      } else this.danger(response.data.reason)
    },
    async addMember() {
      const arr = this.fullname.split(' ')
      if (arr.length < 2 || this.phone === '') {
        this.danger('กรุณาใส่ชื่อและนามสกุล')
        return
      }
      this.firstname = arr[0]
      this.lastname = arr[1]
      const response = await axios.post(`/member`, {
        member_firstname: this.firstname,
        member_lastname: this.lastname,
        gender: this.gender,
        phone: this.phone,
      })
      if (response.data.success) {
        this.success()
        this.clear()
      } else this.danger(response.data.reason)
    },
    clear() {
      this.fullname = ''
      this.firstname = ''
      this.lastname = ''
      this.phone = ''
      this.gender = 'male'
    },
    success() {
      this.$buefy.toast.open({
        message: 'ทำรายการสำเร็จ',
        type: 'is-success',
      })
    },
    danger(reason) {
      if (reason === null || reason === undefined) reason = ''
      this.$buefy.toast.open({
        duration: 5000,
        message: `ทำรายการไม่สำเร็จ ${reason}`,
        type: 'is-danger',
      })
    },
  },
}
</script>

<style scoped>
.bg-blue {
  background-color: #70b6c2;
  color: white;
}
</style>
