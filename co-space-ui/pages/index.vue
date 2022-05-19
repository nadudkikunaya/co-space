<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
    >
      <div class="column">
        <MenuCard
          title="อาหารและเครื่องดื่ม"
          icon="utensils"
          to-page="foodpage"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="หนังสือ" icon="book" to-page="bookpage"></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="สมาชิก" icon="user-large" to-page="member"></MenuCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column is-2"></div>
      <div class="column">
        <MenuCard
          title="รายงาน"
          icon="chart-pie"
          to-page="datareport"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="การตั้งค่า" icon="gear" to-page="setting"></MenuCard>
      </div>
      <div class="column is-2"></div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'MainPage',
  middleware: ['auth'],
  components: {
    MenuCard: () => import('@/components/MenuCard'),
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
