<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fuulhd"
    >
      <div class="column">
        <FoodCard title="Food/Beverage" icon="utensils" to-page="foodpage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Books" icon="book" to-page="booksPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Member" icon="user-large" to-page="memberPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column is-2"></div>
      <div class="column">
        <FoodCard title="Report" icon="chart-pie" to-page="reportPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Setting" icon="gear" to-page="settingPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-2"></div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'MainPage',
  components: {
    FoodCard: () => import('@/components/FoodCard'),
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
