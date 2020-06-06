import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    labels: {
      type: Array,
      default: null
    },
    datasets: {
      type: Array,
      default: null
    },
    background_color: {
      type: Array,
      default: null
    }
  },
  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: [{
          //label: 'Totoal Request count',
          data: this.datasets,
          backgroundColor: this.background_color
        }],
      },
    {
      responsive: true,
      maintainAspectRatio: false
    })
  }
}
