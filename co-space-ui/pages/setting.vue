<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
    >
      <div class="column">
        <MenuCard
          title="ตั้งค่าอาหาร"
          icon="wrench"
          to-page="settingfood"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard
          title="ตั้งค่าหนังสือ"
          icon="wrench"
          to-page="settingbook"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard
          title="ตั้งค่าแผนก"
          icon="wrench"
          to-page="settingdepartment"
        ></MenuCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column is-2"></div>
      <div class="column">
        <MenuCard
          title="ตั้งค่าพนักงาน"
          icon="wrench"
          to-page="settingstaff"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="Setting" icon="gear" to-page="setting"></MenuCard>
      </div>
      <div class="column is-2"></div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'SettingPage',
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
