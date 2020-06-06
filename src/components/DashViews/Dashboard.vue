<template>
	<v-container fill-height fluid grid-list-xl>
		<v-layout wrap>
			<v-flex md12 sm12 lg4>
				<material-card title="Request Count">
					<pie-chart v-if="loaded" :labels="CountLabel" :datasets="CountDataset"
						:background_color="CountColor" />

				</material-card>
			</v-flex>
			<v-flex md12 sm12 lg4>
				<material-card title="Cache Hit/Miss Ratio">
					<pie-chart v-if="loaded" :labels="CacheLabel" :datasets="CacheDataset"
						:background_color="CacheHitMissColor" />

				</material-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import PieChart  from './charts/PieChart.js';
import BarChart  from './charts/BarChart.js';

export default {
  name: 'Dashboard',
  components : {PieChart},
  data: ()=>({
    loaded:  false,
    chartdata: null,
    CountDataset: [],
    CountLabel: [],
    CountColor: [],

    CacheDataset: [],
    CacheLabel: ['Hit', 'Miss'],
    CacheHitMissColor: []

  }),
  async mounted () {
    this.loaded = false
    try {
      this.$http.get('/analytics/gettotal')
       .then(response => {
          const keys = response.data
          keys.forEach(key => {
            const k = Object.keys(key)[0]
            if ((/analytics:response:/).test(k)) {
              this.CountLabel.push(k.split(':')[2])
              this.CountDataset.push(parseInt(key[k]))
              this.CountColor.push(this.getRandomColor())
						}

            else if ((/analytics:hit/).test(k)) {

							this.CacheDataset[0] = parseInt(key[k])
							this.CacheHitMissColor[0] = this.getRandomColor()
            } else if ((/analytics:miss/).test(k)) {
							this.CacheDataset[1] = parseInt(key[k])
							this.CacheHitMissColor[1] = this.getRandomColor()
						}

          })
          console.log(this.CountLabel, this.CountDataset );
          this.chartdata = this.CountDataset
          this.loaded = true
       }).catch(error => {
         console.log(error)
       })

    } catch (e) {
      console.error(e)
    }
  },
  created () {

  },
  methods: {
    complete (index) {
      this.list[index] = !this.list[index]
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }
  }
}
</script>
