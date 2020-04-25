<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="transaction_id"
				label="订单编号"
				min-width="20%">
			</el-table-column>
			<el-table-column
				prop="itemName"
				label="商品名称"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="times"
				label="下单时间"
				min-width="20%">
				<template slot-scope="scope">
					{{$utils.dateText(scope.row.createTime)}}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="username"
				label="用户"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="count"
				label="数量"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="type"
				label="商品类型"
				min-width="20%">
				<template slot-scope="scope">
					<span>{{scope.row.itemType | typeText }}</span>
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
import tButton from '@/components/common/t_button.vue'
export default {
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
	components: {
		tButton
	},
	filters: {
		typeText (val) {
			let arr = [ '权益卡', '门票' ]

			return arr[val - 1]
		}
	},
	created () {
		this.getOrderList()
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getOrderList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getOrderList()
		},
		getOrderList () {
			const params = {
				pageNum : this.pageIndex,
				pageSize: this.pageSize,
				username: this.searchContent
			}

			this.$http.get(this.$api.getOrderList, {params}).then(({data}) => {
				if (data.code === 0) {
					this.tableDateArr = data.data.data
					this.total = data.data.total
				} else {
					this.$message.error(data.message)
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.table-container {
    padding: 20px;
	.setting-input {
		width: 240px;
		height: 36px;
        font-size: 14px;
		padding-left: 10px;
		background: rgba(255, 255, 255, 1);
		border-radius: 2px;
		border: 1px solid rgba(238, 238, 238, 1);
		box-sizing: border-box;
		margin-right: 10px;
	}
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
    .form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.label {
			margin-right: 20px;
		}
		.el-table {
			display: inline-block;
		}
		.right-select {
			margin-top: 15px;
			align-self: flex-start;
        }
        .describ-area {
            width: 360px;
            height: 180px;
            padding: 10px;
            resize:none;
            box-sizing: border-box;
        }
	}
}
</style>
