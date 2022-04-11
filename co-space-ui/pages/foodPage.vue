<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="columns">
        <div class="column is-3">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div class=""></div>
            </div>
            <footer class="card-footer">
              <div class="card-content">
                <div class="content has-text-centered"></div>
                <div class="">test</div>
              </div>
            </footer>
          </div>
        </div>

        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <div class="content has-text-centered"></div>
              <div class="">
                <h1 class="title has-text-centered color-blue">test</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'foodPage',
  components: {},
}
</script>

<style lang="css" scope>
.full-height {
  height: 100vh;
}

.card-footer {
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
}
</style>
