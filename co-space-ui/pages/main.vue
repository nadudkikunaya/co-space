<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-5-desktop is-5-widescreen is-5-fuulhd"
    >
      <div class="column">
        <FoodCard title="Food/Beverage" icon="utensils" toPage="foodPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Books" icon="book" toPage="booksPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Member" icon="user-large" toPage="memberPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column is-2"></div>
      <div class="column">
        <FoodCard title="Report" icon="chart-pie" toPage="reportPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Setting" icon="gear" toPage="settingPage">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-2"></div>
    </div>
  </section>
</template>
<script>
import FoodCard from '~/components/FoodCard'
export default {
  name: 'MainPage',
  components: {
    FoodCard,
  },
}
</script>
