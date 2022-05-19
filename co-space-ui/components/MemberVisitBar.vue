<template>
  <section>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-12">
        <p class="title">เวลาเข้าใช้งาน</p>
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
        <div class="chart">
          <BarChart
            v-if="isLoadBar"
            :data="barChartData"
            :options="barChartOptions"
            :height="100"
          />
        </div>
      </div>
    </div>
    <div class="column"></div>
  </section>
</template>

<script>
import moment from 'moment'
import { axios } from '@/plugins/axios'

export default {
  name: 'MemberVisitBar',
  components: {
    BarChart: () => import('@/components/BarChart'),
  },

  data() {
    return {
      selectedStartDate: new Date(),
      selectedEndDate: new Date(),
      locale: 'en-GB',
      isLoadBar: false,
      barChartData: {
        labels: [
          '2019-06',
          '2019-07',
          '2019-08',
          '2019-09',
          '2019-10',
          '2019-11',
          '2019-12',
          '2020-01',
          '2020-02',
          '2020-03',
        ],
        datasets: [
          {
            label: 'ผู้เข้าใช้งาน',
            data: [2, 1, 16, 3, 4, 5, 0, 0, 4, 12, 2],
            backgroundColor: 'rgba(20, 255, 0, 0.3)',
            borderColor: 'rgba(100, 255, 0, 1)',
            borderWidth: 2,
          },
        ],
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text:
            'การเข้าใช้งานระหว่างวันที่ ' +
            moment(this.selectedStartDate).format('DD-MM-YYYY') +
            ' และ ' +
            moment(this.selectedEndDate).format('DD-MM-YYYY'),
          fontSize: 24,
          fontColor: '#6b7280',
        },
        tooltips: {
          backgroundColor: '#17BF62',
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'ช่วงเวลา',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                stepSize: 1,
              },
              gridLines: {
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'จำนวนการเข้าใช้งาน',
              },
            },
          ],
        },
      },
    }
  },
  async mounted() {
    await this.getBarData()
  },
  watch: {
    async selectedStartDate(date) {
      if (date !== null && this.selectedEndDate !== null) {
        if (moment(date).diff(this.selectedEndDate, 'days') > 0) {
          this.dangerDate()
          this.clearStartDate()
          return
        }
        await this.getBarData()
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
        await this.getBarData()
      }
    },
  },
  methods: {
    async getBarData() {
      const response = await axios.get(
        `/visit_chart?startDate=${moment(this.selectedStartDate).format(
          'YYYY-MM-DD'
        )}&endDate=${moment(this.selectedEndDate).format('YYYY-MM-DD')}`,
        {}
      )
      const obj = this.barChartData.datasets[0]
      obj.data = response.data.data
      this.barChartData.labels = response.data.labels

      const objOptions = this.barChartOptions
      objOptions.title.text =
        'การเข้าใช้งานระหว่างวันที่ ' +
        moment(this.selectedStartDate).format('DD-MM-YYYY') +
        ' และ ' +
        moment(this.selectedEndDate).format('DD-MM-YYYY')

      this.isLoadBar = false
      this.$nextTick(() => {
        this.isLoadBar = true
      })
    },
    clearStartDate() {
      this.selectedStartDate = null
    },
    clearEndDate() {
      this.selectedEndDate = null
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
