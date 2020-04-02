<template>
	<div class="ticket-manage">
		<table-header :sku-arr="cardInforData ? cardInforData.sku_arr : [] "></table-header>
		<table-container></table-container>
	</div>
</template>

<script>
import tableHeader from './components/table_header.vue'
import tableContainer from './components/table_container.vue'
export default {
	components: {
		tableHeader,
		tableContainer
	},
	data () {
		return {
			editId       : '',
			cardInforData: null
		}
	},
	created () {
		this.getCardDetails()
	},
	methods: {
		getCardDetails () {
			this.editId = this.$route.query.editId
			if (!this.editId) return
			let params = {
				id: this.editId
			}

			this.$http.get(this.$api.getCardDetails, {params}).then((res) => {
				if (res.data.code === 0) {
					this.cardInforData = res.data.data
				}
			})
		}
	}
}
</script>
