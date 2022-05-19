<template>
  <section>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-12">
        <div class="columns">
          <b-field>
            <a
              ><b-tag
                class="onhover"
                size="is-medium"
                rounded
                @click="changeTag('day')"
                >รายชั่วโมง</b-tag
              ></a
            >
            <a
              ><b-tag
                class="onhover"
                size="is-medium"
                rounded
                @click="changeTag('month')"
                >รายวัน</b-tag
              ></a
            >
            <a
              ><b-tag
                class="onhover"
                size="is-medium"
                rounded
                @click="changeTag('year')"
                >รายเดือน</b-tag
              ></a
            >
          </b-field>
        </div>
        <div v-if="selectedTag === 'day'" class="columns">
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
        <div v-if="selectedTag === 'month'" class="columns">
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
        <div v-if="selectedTag === 'year'" class="columns">
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
  name: 'MemberRegisterBar',
  components: {
    BarChart: () => import('@/components/BarChart'),
  },

  data() {
    return {
      selectedDate: new Date(),
      selectedMonth: new Date(),
      selectedYear: new Date().getFullYear(),
      yearArr: [],
      locale: 'en-GB',
      selectedTag: 'day',
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
            label: 'Visualizaciones',
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
            'การสมัครสมาชิกวันที่ ' +
            moment(this.selectedDate).format('DD-MM-YYY'),
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
                labelString: 'เวลา',
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
                labelString: 'จำนวนสมาชิก',
              },
            },
          ],
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
  },
  methods: {
    async getBarData(val) {
      let response
      let xAxes
      if (val === 'day') {
        const date = moment(this.selectedDate).format('YYYY-MM-DD')
        response = await axios.get(
          `/memberregis_chart?type=${this.selectedTag}&date=${date}`,
          {}
        )
        xAxes = [
          {
            gridLines: {
              display: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'เวลา',
            },
          },
        ]
      } else if (val === 'month') {
        const month = moment(this.selectedMonth).format('MM')
        const year = moment(this.selectedMonth).format('YYYY')
        response = await axios.get(
          `/memberregis_chart?type=${this.selectedTag}&month=${month}&year=${year}`,
          {}
        )
        xAxes = [
          {
            gridLines: {
              display: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'วันที่',
            },
          },
        ]
      } else if (val === 'year') {
        const year = this.selectedYear
        response = await axios.get(
          `/memberregis_chart?type=${this.selectedTag}&year=${year}`,
          {}
        )
        xAxes = [
          {
            gridLines: {
              display: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'เดือน',
            },
          },
        ]
      }

      const datasets = [
        {
          label: 'จำนวนสมาชิก',
          data: response.data.data,
          backgroundColor: 'rgba(20, 255, 0, 0.3)',
          borderColor: 'rgba(100, 255, 0, 1)',
          borderWidth: 2,
        },
      ]
      this.barChartData.labels = response.data.labels
      this.barChartData.datasets = datasets
      const obj = this.barChartOptions.scales
      obj.xAxes = xAxes
      // title
      let range = 'วันที่'
      if (val === 'day')
        range = 'วันที่ ' + moment(this.selectedDate).format('DD-MM-YYY')
      else if (val === 'month')
        range = 'เดือนที่ ' + moment(this.selectedMonth).format('MM-YY')
      else if (val === 'year') range = 'ปีที่ ' + this.selectedYear
      const title = {
        display: true,
        text: 'การสมัครสมาชิก' + range,
        fontSize: 24,
        fontColor: '#6b7280',
      }
      this.barChartOptions.title = title
      // reload

      this.isLoadBar = false
      this.$nextTick(() => {
        this.isLoadBar = true
      })
    },
    clearDate() {
      this.selectedDate = null
    },
    clearMonth() {
      this.selectedMonth = null
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
