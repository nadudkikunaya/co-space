<template>
  <div>
    <PageNavbar />
    <section class="section is-small">
      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-content">
              <b-tabs v-model="selectedTab" size="is-medium">
                <b-tab-item label="การขาย"></b-tab-item>
                <b-tab-item label="ผู้ใช้งาน"></b-tab-item>
                <b-tab-item label="สมาชิก"></b-tab-item>
              </b-tabs>
              <PieMostFavFood v-if="selectedTab === 0"></PieMostFavFood>
              <SalesTable v-if="selectedTab === 0"></SalesTable>
              <MemberVisitBar v-if="selectedTab === 1"></MemberVisitBar>
              <MemberRegisterBar v-if="selectedTab === 2"></MemberRegisterBar>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import { axios } from '@/plugins/axios'

export default {
  name: 'DataReport',
  middleware: ['auth'],
  components: {
    PieMostFavFood: () => import('@/components/PieMostFavFood'),
    MemberRegisterBar: () => import('@/components/MemberRegisterBar'),
    SalesTable: () => import('@/components/SalesTable'),
    MemberVisitBar: () => import('@/components/MemberVisitBar'),
  },
  data() {
    return {
      selectedTab: 0,
    }
  },
}
</script>
<style scoped></style>
