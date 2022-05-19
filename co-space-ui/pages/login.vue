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
              <form @submit="login">
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
                  <b-button size="is-medium bg-blue" native-type="submit"
                    >ลงชื่อเข้าสู่ระบบ</b-button
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  // middleware: ['isNotLoggedIn'],
  data() {
    return {
      username: '',
      password: '',
    }
  },
  computed: {},
  methods: {
    async login(e) {
      e.preventDefault()
      const payload = {
        username: this.username,
        password: this.password,
      }
      try {
        await this.$auth.loginWith('local', {
          data: payload,
        })
        this.$router.push('/')

        this.success()
      } catch (e) {
        console.log(e)
        this.$router.push('/login')
        this.danger()
      }
    },
    success() {
      this.$buefy.toast.open({
        message: 'เข้าสู่ระบบสำเร็จ',
        type: 'is-success',
      })
    },
    danger() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `มีข้อผิดพลาด กรุณาลองใหหม่อีกครั้ง`,
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
