<template>
  <div class="column">
    <div class="card">
      <div class="card-content">
        <div class="content has-text-centered">
          <font-awesome-icon :icon="icon" size="10x" class="" />
        </div>
        <div>
          <h1 class="title has-text-centered color-blue">{{ title }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.color-blue {
  color: #70b6c2;
}

.color-grey {
  color: #bababa;
}

.card:hover {
  background: #dddddd;
}
</style>
