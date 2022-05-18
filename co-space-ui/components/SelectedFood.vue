<template>
  <div class="card">
    <div class="card-content">
      <div class="columns">
        <div class="column is-4">
          <p>{{ name }}</p>
        </div>
        <div class="column is-4">
          <p>{{ calc_price }}</p>
        </div>
        <div class="column is-4">
          <button @click="increase()">+</button>
          {{ qnt }}
          <button @click="decrease()">-</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedFood',
  data() {
    return {
      qnt: this.selectedQuantity,
      base_price: this.price,
      calc_price: this.price,
    }
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    selectedQuantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    page: {
      type: String,
    },
  },
  methods: {
    increase() {
      if (this.page === 'food' || this.qnt + 1 <= this.quantity) {
        this.qnt++
        console.log(this.qnt)
        this.calc_price = this.base_price * this.qnt
        // console.log(this.qnt)
        this.$emit('updateQuantity', this.name, this.qnt)
      } else this.danger()
    },
    decrease() {
      this.qnt--
      // console.log(this.qnt)
      this.calc_price = this.base_price * this.qnt
      this.$emit('updateQuantity', this.name, this.qnt)
    },
    danger() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `หนังสือมีแค่ ${this.quantity} เล่ม`,
        type: 'is-danger',
      })
    },
  },
}
</script>

<style scoped></style>
