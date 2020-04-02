<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="orderNum"
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
				prop="status"
				label="状态"
				min-width="20%">
				<template slot-scope="scope">
					<span>{{scope.row.status | statusText }}</span>
				</template>
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
			<el-table-column
				class="option"
				align="right"
				label="操作"
				min-width="20%">
				<template slot-scope="scope">
					<span type="text"
						class="setting-btn"
						v-if="scope.row.itemType === 3 && scope.row.status === 2"
						@click="handleShip(scope.row)">发货</span>
					<span
						type="text"
						class="setting-btn"
						v-else-if="scope.row.itemType === 3 && scope.row.status === 3"
						@click="handleShip(scope.row)">修改物流订单</span>
					<span type="text" class="setting-btn" v-else > -- </span>
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
		<el-dialog
			width="530px"
			:title="boxTitle"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox"
		>
			<div class="form-item">
				<span class="label">发货快递单号</span>
				<input type="text" class="setting-input" placeholder="请输入快递单号" v-model.trim="shipCode" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveShipCode">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
export default {
	data () {
		return {
			tableDateArr    : [],
			total           : 0,
			pageIndex       : 1,
			pageSize        : 10,
			forbidClick     : false,
			searchContent   : '',
			showSettingBox  : false,
			shipCode        : '',
			boxTitle        : '',
			currentShipOrder: ''
		}
	},
	components: {
		tButton
	},
	filters: {
		statusText (val) {
			// 0. 已取消，1. 待付款，2. 待发货，3. 已发货
			let arr = [ '已取消', '待付款', '待发货', '已发货' ]

			return arr[val]
		},
		typeText (val) {
			let arr = [ '权益卡', '特惠票', '实物商品' ]

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
	watch: {
		showSettingBox (newVal) {
			if (!newVal) {
				this.currentShipOrder = ''
			}
		}
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
				if (data.code === '0') {
					this.tableDateArr = data.data.list
					this.total = data.data.total
				} else {
					this.$message.error(data.message)
				}
			})
		},
		handleShip (obj) {
			this.boxTitle = obj.trackingNumber ? '编辑快递单号' : '发货'
			this.shipCode = obj.trackingNumber ? obj.trackingNumber : ''
			this.currentShipOrder = obj.id
			this.showSettingBox = true
		},
		saveShipCode () {
			if (!this.shipCode) {
				this.$message.error('物流编号不能为空')
				return
			}
			let params = {
				trackingNumber: this.shipCode
			}

			this.$http.put(`${this.$api.ship}/${this.currentShipOrder}`, params).then((res) => {
				if (res.data.code === '0') {
					this.$message.success('发货成功')
					this.getOrderList()
				} else {
					this.$message.error(res.message)
				}
			})
			this.showSettingBox = false
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
