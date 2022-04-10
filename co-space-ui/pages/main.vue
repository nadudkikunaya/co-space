<template>
  <section class="section is-medium">
    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column">
        <FoodCard title="Food/Beverage" icon="utensils">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Books" icon="book">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Rooms" icon="chalkboard-user">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
    </div>

    <div
      class="columns is-variable is-2-mobile is-0-tablet is-8-desktop is-8-widescreen is-8-fuulhd"
    >
      <div class="column">
        <FoodCard title="Member" icon="user-large">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Report" icon="chart-pie">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
      <div class="column is-1"></div>
      <div class="column">
        <FoodCard title="Setting" icon="gear">
          Open source on <a href="https://github.com/buefy/buefy"> GitHub </a>
        </FoodCard>
      </div>
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
