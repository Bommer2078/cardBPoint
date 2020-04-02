<template>
	<div class="ticket-manage">
		<table-header></table-header>
		<div class="location-container">
			<template v-for="item in locationArr">
				<location-card :location-obj="item" :key="item.id"></location-card>
			</template>
		</div>
	</div>
</template>

<script>
import tableHeader from './components/table_header.vue'
import locationCard from './components/location_card.vue'
export default {
	components: {
		tableHeader,
		locationCard
	},
	created () {
		this.getLocationArr()
		this.$EventBus.$on('reflash', this.getLocationArr)
	},
	destroyed () {
		this.$EventBus.$off('reflash')
	},
	data () {
		return {
			locationArr: [],
			pageIndex  : 1,
			pageSize   : 100
		}
	},
	methods: {
		getLocationArr () {
			let params = {
				pageNum : this.pageIndex,
				pageSize: this.pageSize
			}

			this.$http.post(this.$api.getLocationList, {params})
				.then(({data:{code, data, message}}) => {
					if (code === 0) {
						this.locationArr = data.data
					}
				})
		}
	}
}
</script>

<style lang="less" scoped>
	.location-container {
		padding: 20px;
		display: flex;
		flex-flow: wrap;
		.location-card {
			margin-right: 20px;
			margin-bottom: 20px;
		}
	}
</style>
