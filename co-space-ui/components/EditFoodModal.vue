<template>
  <form action="">
    <div class="modal-card" style="height: 100vh; width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">แก้ไขข้อมูลอาหาร</p>
        <button type="button" class="delete" @click="closeModal" />
      </header>
      <section class="modal-card-body">
        {{ data }}
        <b-field label="รหัสอาหาร">
          <b-input v-model="data.food_id"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="closeModal" />
        <b-button label="เพิ่ม" @click="addCustomer()" type="is-primary" />
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EditFoodModal',
  props: {
    modalData: {
      type: Object,
      required: true,
    },
  },

  components: {},
  data() {
    return {
      data: this.modalData,
    }
  },

  mounted() {},

  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>
