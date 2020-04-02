<template>
	<div class="business-manage">
		<table-header :current-obj="currentObj"></table-header>
		<div class="line"></div>
		<div class="business-container">
			<div v-for="item in businessArr" :key="item.id" @click="changeBusiness(item.id)">
				<business-card
					:business-obj="item"
					:class="{'active':current === item.id}"></business-card>
			</div>
		</div>
		<div class="list-container" v-if="currentObj">
			<write-off-list></write-off-list>
		</div>
	</div>
</template>

<script>
import tableHeader from './components/table_header.vue'
import businessCard from './components/business_card.vue'
import writeOffList from './write_off_list/write_off_list.vue'
export default {
	components: {
		tableHeader,
		writeOffList,
		businessCard
	},
	data () {
		return {
			businessArr: [],
			pageNum    : 1,
			pageSize   : 10,
			current    : '',
			currentObj : null
		}
	},
	created () {
		this.getBusinessList()
		this.$EventBus.$on('reflash', this.getBusinessList)
	},
	destroyed () {
		this.$EventBus.$off('reflash')
	},
	computed: {
		venueId () {
			return this.$route.query.id
		}
	},
	methods: {
		changeBusiness (username) {
			let path = this.$route.path

			this.$router.replace({
				path,
				query: {
					...this.$route.query,
					businessName: username
				}
			})
			this.current = username
			this.currentObj = this.businessArr.find((item) => {
				return item.username === this.current
			})
		},
		getBusinessList () {
			let username = this.$route.query.businessName
			let params = {
				page    : this.pageNum,
				pageSize: this.pageSize,
				venue_id: this.venueId
			}

			this.$http.get(this.$api.venueUserList, {params})
				.then((res) => {
					if (res.data.code === 0) {
						let data = res.data.data

						this.businessArr = data.data

						console.log(this.businessArr)
						if (username) {
							this.changeBusiness(username)
						}
					}
				})
		}
	}
}
</script>

<style lang="less" scoped>
.business-container {
    display: inline-block;
    width: 235px;
    height: 600px;
    border: 1px solid #eee;
    flex-direction: column;
    padding: 10px;
    margin-left: 20px;
    .business-card {
        margin-bottom: 20px;
    }
}
.line {
    border: 1px solid #eee;
    height: 0;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.list-container {
    display: inline-block;
    width: calc(100% - 305px);
    vertical-align: top;
}
.active {
	box-shadow: 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12), 0 3px 5px -1px rgba(0,0,0,.11);
}
</style>
