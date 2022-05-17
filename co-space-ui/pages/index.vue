<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fullhd"
    >
      <div class="column">
        <MenuCard
          title="Food/Beverage"
          icon="utensils"
          to-page="foodpage"
        ></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="Book" icon="book" to-page="bookpage"></MenuCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <MenuCard title="Member" icon="user-large" to-page="member"></MenuCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column is-2"></div>
      <div class="column">
        <MenuCard
          title="Report"
          icon="chart-pie"
          to-page="reportPage"
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
  name: 'MainPage',
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
