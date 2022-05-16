<template>
  <div>
    <PageNavbar />

    <section class="section is-medium">
      <div
        class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
      >
        <div class="column is-3"></div>
        <div class="column is-6">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered">
                <div class="columns">
                  <div class="column is-12">
                    <b-input
                      v-model="fullname"
                      size="is-medium"
                      placeholder="ชื่อ-นามสกุล"
                      rounded
                    ></b-input>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-12">
                    <b-input
                      v-model="phone"
                      size="is-medium"
                      rounded
                      placeholder="เบอร์โทรศัพท์"
                    ></b-input>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-4"></div>
                  <div class="column is-4">
                    <div class="block">
                      <b-radio v-model="gender" native-value="male" selected>
                        ชาย
                      </b-radio>
                      <b-radio v-model="gender" native-value="female">
                        หญิง
                      </b-radio>
                      <b-radio v-model="gender" native-value="others">
                        อื่นๆ
                      </b-radio>
                    </div>
                    <b-button size="is-medium bg-blue" @click="addMember"
                      >เพิ่มข้อมูลสมาชิก</b-button
                    >
                  </div>
                  <div class="column is-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-3"></div>
      </div>
    </section>
  </div>
</template>
<script>
import { axios } from '@/plugins/axios'
export default {
  name: 'MemberPage',
  components: {},
  data() {
    return {
      fullname: '',
      firstname: '',
      lastname: '',
      phone: '',
      gender: 'male',
    }
  },
  mounted() {},
  methods: {
    async addMember() {
      const arr = this.fullname.split(' ')
      if (arr.length < 2 || this.phone === '') {
        this.danger()
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
      } else this.danger()
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
.bg-blue {
  background-color: #70b6c2;
  color: white;
}
</style>
