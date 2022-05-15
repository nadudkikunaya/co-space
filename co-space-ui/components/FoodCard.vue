<template>
  <div class="column">
    <a>
      <div class="card">
        <div class="card-content">
          <div>
            <b-image :src="img" ratio="1by1"></b-image>
            <p class="has-text-centered">
              {{ name }}
            </p>
            <p class="has-text-centered">
              {{ price }}
            </p>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
  },
  methods: {},
}
</script>

<style scoped></style>
