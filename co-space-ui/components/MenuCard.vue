<template>
  <div class="column">
    <a>
      <div class="card" @click="changePage">
        <div class="card-content">
          <div class="content has-text-centered">
            <font-awesome-icon :icon="icon" size="10x" class="" />
          </div>
          <div>
            <h1 class="title has-text-centered color-blue">{{ title }}</h1>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'MenuCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    toPage: {
      type: String,
      required: true,
    },
  },
  methods: {
    changePage() {
      this.$buefy.notification.open(this.toPage)
      this.$router.push({
        name: this.toPage,
        params: {},
      })
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
  background: red;
  transition-delay: 1s;
}
</style>
