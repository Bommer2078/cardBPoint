<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="transaction_id"
				label="订单编号"
				min-width="16%">
				<template slot-scope="scope">
					<div class="transaction-id" :title="scope.row.transaction_id">{{ scope.row.transaction_id }}</div>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="nickname"
				label="用户"
				min-width="16%">
			</el-table-column>
			<el-table-column
				v-if="orderType === 0"
				align="center"
				label="场馆名称"
				min-width="16%">
				<template slot-scope="scope">
					<div>{{ scope.row.venue && scope.row.venue.name }}</div>
				</template>
			</el-table-column>
			<el-table-column
				v-else
				align="center"
				label="权益卡名称和规格"
				min-width="16%">
				<template slot-scope="scope">
					<span>{{scope.row.card && scope.row.card.name}}/{{scope.row.card_sku && scope.row.card_sku.name}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				label="场馆来源"
				min-width="16%">
				<template slot-scope="scope">
					<div>{{ scope.row.venue && scope.row.venue.name || '--'}}</div>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="create_at"
				label="下单时间"
				min-width="16%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="price"
				label="支付价格"
				min-width="16%">
				<template slot-scope="scope">
					<div>{{ scope.row.price / 100 }}元</div>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="count"
				label="支付状态"
				min-width="16%">
				<template slot-scope="scope">
					<div>{{ scope.row.paid_state | payText }}</div>
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
			pageSize     : 15,
			forbidClick  : false,
			searchContent: '',
			orderType    : 0 // （0：购买场馆，1：购买权益卡）
		}
	},
	components: {
		tButton
	},
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
	created () {
		this.getOrderList()
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
			this.$EventBus.$on('changeType', this.changeType)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		changeType (val) {
			this.pageIndex = 0
			this.searchContent = ''
			this.orderType = val
			this.getOrderList()
		},
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
				page    : this.pageIndex,
				pageSize: this.pageSize,
				venue_id: this.searchContent,
				type    : this.orderType
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
	.transaction-id {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
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
