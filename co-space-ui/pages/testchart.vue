<template>
  <section class="section is-large">
    <div class="chart">
      <BarChart :data="barChartData" :options="barChartOptions" :height="100" />
      <PieChart :data="pieChartData" :options="pieChartOptions" :height="200" />
      <LineChart
        :data="lineChartData"
        :options="lineChartOptions"
        :height="400"
      />
    </div>
  </section>
</template>

<script>
import BarChart from '~/components/BarChart.vue'
import PieChart from '~/components/PieChart.vue'
import LineChart from '~/components/LineChart.vue'
export default {
  name: 'TestChart',
  components: { BarChart, PieChart, LineChart },
  data() {
    return {
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
      pieChartData: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10],
          },
        ],
      },

      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Google analytics data',
          fontSize: 24,
          fontColor: '#6b7280',
        },
      },
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
          text: 'Google analytics data',
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
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 7,
                min: 0,
                stepSize: 1,
              },
              gridLines: {
                display: true,
              },
            },
          ],
        },
      },
    }
  },
}
</script>

<style scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 400;
  font-size: 100px;
  color: #2e495e;
  letter-spacing: 1px;
  font-size: 6em;
}
.green {
  color: #00c48d;
}

.subtitle {
  font-weight: 300;
  font-size: 1em;
  color: #2e495e;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
