<template>
  <section class="section is-large">
    <div class="card">
      <div class="card-content">
        <div class="content">
          <h1 class="title has-text-centered">Login system</h1>
          <center>
            <b-field label="Name" :label-position="labelPosition">
              <b-input value="Kevin Garvey"></b-input>
            </b-field>

            <b-field label="Password" :label-position="labelPosition">
              <b-input value="Kevin Garvey"></b-input>
            </b-field>

            <b-button type="is-info">Login</b-button>
          </center>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
      expandOnHover: false,
      expandWithDelay: false,
      mobile: 'reduce',
      reduce: false,
    }
  },
}
</script>
