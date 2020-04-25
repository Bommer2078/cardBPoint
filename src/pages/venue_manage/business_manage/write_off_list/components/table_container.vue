<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="avatar"
				label="头像"
				min-width="15%">
				<template slot-scope="scope">
					<img :src="scope.row.avatar" class="avatar">
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="nickname"
				label="用户昵称"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="card.name"
				label="使用的权益卡"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="paid_date"
				label="下单时间"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="price"
				label="下单价格"
				min-width="15%">
				<template slot-scope="scope">
					<span>{{scope.row.price / 100}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="times"
				label="支付状态"
				width="150">
				<template slot-scope="scope">
					<span>{{scope.row.paid_state | payText}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-show="total > pageSize"
			align="center"
			style="margin-top:20px;"
			background
			@current-change="changePage"
			layout="prev, pager, next"
			:current-page="pageIndex"
			:page-size="pageSize"
			:total="total">
		</el-pagination>
	</div>
</template>

<script>
export default {
	filters: {
		// paid_state：支付状态，-1：支付失败，0：未支付，1：预支付，10：已支付
		payText (val) {
			let text = ''

			switch (val) {
				case -1:
					text = '支付失败'
					break
				case 0:
					text = '未支付'
					break
				case 1:
					text = '预支付'
					break
				case 10:
					text = '已支付'
					break
				default:
					text = '未支付'
					break
			}
			return text
		}
	},
	data () {
		return {
			tableDateArr : [],
			total        : 0,
			pageIndex    : 1,
			pageSize     : 10,
			forbidClick  : false,
			searchContent: ''
		}
	},
	computed: {
		businessName () {
			return this.$route.query.businessName
		}
	},
	watch: {
		businessName (newVal) {
			if (!newVal) return
			this.handleBusinessChange()
		}
	},
	created () {
		if (this.businessName) {
			this.getwriteOffList()
		}
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getwriteOffList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getwriteOffList()
		},
		handleBusinessChange () {
			this.searchContent = ''
			this.pageIndex = 1
			this.getwriteOffList()
		},
		getwriteOffList () {
			const params = {
				page    : this.pageIndex,
				pageSize: this.pageSize,
				search  : this.searchContent,
				user_id : this.businessName
			}

			this.$http.post(this.$api.getVenueOrder, params).then(({data}) => {
				if (data.code === 0) {
					this.tableDateArr = data.data.data
					this.total = data.data.total
				} else {
					this.$message.error(data.msg)
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.table-container {
    padding: 20px;
	.split {
		color: #409eff;
		margin-left: 10px;
		margin-right: 10px;
		user-select: none;
	}
	.setting-btn {
		color: #409eff;
		cursor: pointer;
		user-select: none;
	}
	.option {
		font-size: 0;
	}
	.img-compressed {
		width: 240px;
		height: 130px;
	}
	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
}
</style>
