<template>
  <div>
    <PageNavbar />

    <section class="section is-medium">
      <div
        class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
      >
        <div class="column is-1"></div>
        <div class="column is-4">
          <MenuCard
            title="รายการอาหาร"
            icon="wheat-awn-circle-exclamation"
            to-page="settingfood"
          ></MenuCard>
        </div>
        <div class="column is-2"></div>
        <div class="column is-4">
          <MenuCard
            title="รายการหนังสือ"
            icon="address-book"
            to-page="settingbook"
          ></MenuCard>
        </div>
        <div class="column is-1"></div>
      </div>

      <div
        class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fuulhd"
      >
        <div class="column is-1"></div>
        <div class="column is-4">
          <MenuCard
            title="รายชื่อพนักงาน"
            icon="clipboard-user"
            to-page="settingstaff"
          ></MenuCard>
        </div>
        <div class="column is-2"></div>
        <div class="column is-4">
          <MenuCard
            title="รายชื่อแผนก"
            icon="network-wired"
            to-page="settingdepartment"
          ></MenuCard>
        </div>
        <div class="column is-1"></div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'SettingPage',
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
