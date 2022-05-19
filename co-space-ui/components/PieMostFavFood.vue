<template>
  <section>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-12">
        <p class="title">สินค้ายอดนิยม</p>
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
        <div class="columns">
          <div class="column is-2">
            <b-field label="วันที่เริ่ม">
              <b-datepicker
                v-model="selectedStartDate"
                placeholder="เลือกวันที่"
                icon="calendar-today"
                :icon-right="selectedStartDate ? 'close-circle' : ''"
                :locale="locale"
                icon-right-clickable
                @icon-right-click="clearStartDate"
                trap-focus
              >
              </b-datepicker>
            </b-field>
          </div>

          <div class="column is-2">
            <b-field label="วันที่สิ้นสุด">
              <b-datepicker
                v-model="selectedEndDate"
                placeholder="เลือกวันที่"
                icon="calendar-today"
                :icon-right="selectedEndDate ? 'close-circle' : ''"
                :locale="locale"
                icon-right-clickable
                @icon-right-click="clearEndDate"
                trap-focus
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
        <div>
          <PieChart
            v-if="isLoadPie"
            :data="pieChartData"
            :options="pieChartOptions"
          />
        </div>
      </div>
      <div class="column"></div>
    </div>
    <hr />
  </section>
</template>

<script>
import moment from 'moment'
import { axios } from '@/plugins/axios'

export default {
  name: 'PieMostFavFood',
  components: {
    PieChart: () => import('@/components/PieChart'),
  },

  async mounted() {
    await this.getPieData(this.selectedTag)
  },
  data() {
    return {
      selectedStartDate: new Date(),
      selectedEndDate: new Date(),
      locale: 'en-GB',
      selectedTag: 'book',
      isLoadPie: false,
      pieChartData: {
        labels: ['ไม่มีข้อมูลระหว่างวันดังกล่าว'],
        datasets: [
          {
            backgroundColor: ['#a1a09f'],
            data: [100],
          },
        ],
      },

      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: `อาหารที่มีจำนวนถูกซื้อมากที่สุด`,
          fontSize: 24,
          fontColor: '#6b7280',
        },
      },
    }
  },
  watch: {
    async selectedStartDate(date) {
      if (date !== null && this.selectedEndDate !== null) {
        if (moment(date).diff(this.selectedEndDate, 'days') > 0) {
          this.dangerDate()
          this.clearStartDate()
          return
        }
        await this.getPieData(this.selectedTag)
      }
    },
    async selectedEndDate(date) {
      if (date !== null && this.selectedStartDate !== null) {
        if (moment(date).diff(this.selectedStartDate, 'days') < 0) {
          this.clearEndDate()
          this.dangerDate()
          console.log(moment(date).diff(this.selectedStartDate, 'days'))
          return
        }
        await this.getPieData(this.selectedTag)
      }
    },
    async selectedTag(val) {
      await this.getPieData(val)
    },
  },
  methods: {
    async getPieData(val) {
      const response = await axios.get(
        `/favourite_food?tag=${val}&startDate=${moment(
          this.selectedStartDate
        ).format('YYYY-MM-DD')}&endDate=${moment(this.selectedEndDate).format(
          'YYYY-MM-DD'
        )}`,
        {}
      )

      if (response.data.labels.length) {
        const dataSets = [
          {
            backgroundColor: [
              '#e60b0b',
              '#0be60f',
              '#e6800b',
              '#5b0be6',
              '#0bc5e6',
              '#e6d00b',
              '#92e60b',
              '#e60bc1',
              '#0be6af',
              '#0b5be6',
            ],
            data: response.data.data,
          },
        ]
        const title = {
          display: true,
          text: response.data.title,
          fontSize: 24,
          fontColor: '#6b7280',
        }
        this.pieChartData.labels = response.data.labels
        this.pieChartData.datasets = dataSets
        this.pieChartOptions.title = title
      } else {
        const dataSets = [
          {
            backgroundColor: ['#a1a09f'],
            data: [100],
          },
        ]
        const title = {
          display: true,
          text: response.data.title,
          fontSize: 24,
          fontColor: '#6b7280',
        }
        this.pieChartData.datasets = dataSets
        this.pieChartOptions.title = title
        this.pieChartData.labels = ['ไม่มีข้อมูลระหว่างวันดังกล่าว']
      }
      this.isLoadPie = false
      this.$nextTick(() => {
        this.isLoadPie = true
      })
    },
    clearStartDate() {
      this.selectedStartDate = null
    },
    clearEndDate() {
      this.selectedEndDate = null
    },
    changeTag(name) {
      this.selectedTag = name
    },
    dangerDate() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `กรุณาเลือกวันที่ให้ถูกต้อง`,
        type: 'is-danger',
      })
    },
  },
}
</script>

<style scoped>
.onhover:hover {
  background-color: darkgrey;
}
</style>
