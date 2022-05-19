<template>
  <section class="section is-small">
    <div class="columns">
      <div class="column is-12">
        <p class="title">ยอดขาย</p>
        <div class="columns">
          <b-field>
            <a
              ><b-tag
                class="onhover"
                size="is-medium"
                rounded
                @click="changeTag('book')"
                >หนังสือ</b-tag
              ></a
            >
            <a
              ><b-tag
                class="onhover"
                size="is-medium"
                rounded
                @click="changeTag('food')"
                >อาหาร</b-tag
              ></a
            >
          </b-field>
        </div>
        <b-tabs v-model="selectedTab" size="is-small">
          <b-tab-item label="รายชั่วโมง"></b-tab-item>
          <b-tab-item label="รายวัน"></b-tab-item>
          <b-tab-item label="รายเดือน"></b-tab-item>
        </b-tabs>
        <div v-if="selectedTab === 0" class="columns">
          <div class="column is-2">
            <b-field label="วันที่">
              <b-datepicker
                v-model="selectedDate"
                placeholder="เลือกวันที่"
                icon="calendar-today"
                :icon-right="selectedDate ? 'close-circle' : ''"
                :locale="locale"
                icon-right-clickable
                @icon-right-click="clearDate"
                trap-focus
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
        <div v-if="selectedTab === 1" class="columns">
          <div class="column is-2">
            <b-field label="เดือนที่">
              <b-datepicker
                v-model="selectedMonth"
                type="month"
                placeholder="เลือกเดือน"
                icon="calendar-today"
                :icon-right="selectedMonth ? 'close-circle' : ''"
                :locale="locale"
                icon-right-clickable
                @icon-right-click="clearMonth"
                trap-focus
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
        <div v-if="selectedTab === 2" class="columns">
          <div class="column is-2">
            <b-field label="ปี">
              <b-select placeholder="เลือกปี" v-model="selectedYear" expanded>
                <option v-for="value of yearArr" :value="value" :key="value">
                  {{ value }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
        <div>
          <LineChart
            v-if="isLoadLine"
            :data="lineChartData"
            :options="lineChartOptions"
            :height="400"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import { axios } from '@/plugins/axios'
export default {
  name: 'SalesTable',
  components: {
    LineChart: () => import('@/components/LineChart'),
  },
  data() {
    return {
      yearArr: [],
      isLoadLine: false,
      locale: 'en-GB',
      selectedTab: 0,
      selectedTag: 'book',
      selectedDate: new Date(),
      selectedMonth: new Date(),
      selectedYear: new Date().getFullYear(),
      lineChartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            fill: true,
            data: [40, 39, 10, 40, 39, 80, 40],
          },
          {
            label: 'Data Two',
            backgroundColor: '#111111',
            fill: false,
            borderColor: '#03fc5e',
            lineColor: '#03fc5e',
            lineWidth: 100,
            tension: 0.9,
            data: [40, 60, 70, 80, 90, 100, 120],
          },
        ],
      },

      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          labels: {
            fontSize: 16,
            usePointStyle: true,
          },
        },
      },
    }
  },
  async mounted() {
    await this.getBarData(this.selectedTag)
    for (let i = parseInt(new Date().getFullYear()); i >= 1900; i--) {
      this.yearArr.push(i)
    }
  },
  watch: {
    async selectedDate(date) {
      if (date !== null) {
        await this.getBarData(this.selectedTag)
      }
    },
    async selectedMonth(date) {
      if (date !== null) {
        await this.getBarData(this.selectedTag)
      }
    },
    async selectedYear(date) {
      if (date !== null) {
        await this.getBarData(this.selectedTag)
      }
    },

    async selectedTag(val) {
      await this.getBarData(val)
    },
    async selectedTab() {
      await this.getBarData(this.selectedTag)
    },
  },
  methods: {
    async getBarData(val) {
      let response
      if (this.selectedTab === 0) {
        response = await axios.post(`/sales_line`, {
          product: this.selectedTag,
          type: this.selectedTab,
          date: moment(this.selectedDate).format('YYYY-MM-DD'),
        })
      } else if (this.selectedTab === 1) {
        response = await axios.post(`/sales_line`, {
          product: this.selectedTag,
          type: this.selectedTab,
          month: moment(this.selectedMonth).format('MM'),
          year: moment(this.selectedMonth).format('YYYY'),
        })
      } else if (this.selectedTab === 2) {
        response = await axios.post(`/sales_line`, {
          product: this.selectedTag,
          type: this.selectedTab,
          year: this.selectedYear,
        })
      }
      const lc = this.lineChartData
      lc.labels = response.data.labels
      lc.datasets = []
      lc.datasets = lc.datasets.concat(response.data.dataType)
      lc.datasets.push({
        label: 'ยอดขายรวม',
        backgroundColor: '#f87979',
        fill: true,
        data: response.data.data,
      })

      console.log(lc.datasets)
      this.isLoadLine = false
      this.$nextTick(() => {
        this.isLoadLine = true
      })
    },
    changeTag(val) {
      this.selectedTag = val
    },
    clearDate() {
      this.selectedDate = null
    },
    clearMonth() {
      this.selectedMonth = null
    },
  },
}
</script>

<style scoped>
.onhover:hover {
  background-color: darkgrey;
}
</style>
e
