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
            <p class="has-text-centered">ราคา ：{{ price }}฿</p>
            <p v-if="page === 'book' && quantity > 0" class="has-text-centered">
              จำนวน : {{ quantity }}
            </p>
            <p
              v-else-if="page === 'book' && quantity === 0"
              class="text-red has-text-centered"
            >
              หนังสือหมด
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
    quantity: {
      type: Number,
    },
    page: {
      type: String,
    },
  },
  methods: {},
}
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
