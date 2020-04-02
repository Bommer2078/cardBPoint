<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="num"
				label="权益卡序号"
				min-width="20%">
				<template slot-scope="scope">
					<span >{{scope.row.order_number || '无'}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="code"
				label="权益卡编码"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="绑定状态"
				min-width="20%">
				<template slot-scope="scope">
					<span v-if="scope.row.convert_at">{{`已被${scope.row.nickname}用户绑定`}}</span>
					<span v-else>未绑定</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="create_at"
				label="生成时间"
				min-width="20%">
			</el-table-column>
			<el-table-column
				align="center"
				label="绑定时间"
				min-width="20%">
				<template slot-scope="scope">
					<span >{{scope.row.convert_at || '--'}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="150">
				<template slot-scope="scope">
					<el-switch
						:disabled="forbidClick"
						v-model="scope.row.state"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="正常"
						inactive-text="冻结"
						:active-value="0"
						:inactive-value="1"
						@change="handleChangeState(scope.row.id,scope.row.state)"
					>
					</el-switch>
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
	created () {
		this.getCardTicketList()
		this.$EventBus.$on('changeProductType', this.handleTypeChange)
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('changeProductType')
		this.$EventBus.$off('changeStatus')
		this.$EventBus.$off('search')
	},
	computed: {
		cardId () {
			return this.$route.query.editId
		}
	},
	methods: {
		handleChangeState (id, state) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const params = {
				id     : id,
				card_id: this.cardId,
				state  : state
			}

			this.$http.put(this.$api.batchUpdateStatus, params).then((res) => {
				if (res.data.code === 0) {
					this.getCardTicketList()
					this.$message.success(res.data.msg)
				} else {
					this.$message.error(res.data.msg)
				}
			}).finally(() => {
				this.forbidClick = false
			})
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getCardTicketList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getCardTicketList()
		},
		handleTypeChange (val) {
			this.searchContent = ''
			this.pageIndex = 1
			this.getCardTicketList()
		},
		getCardTicketList () {
			const params = {
				page    : this.pageIndex,
				pageSize: this.pageSize,
				card_id : this.cardId
			}

			if (this.searchContent) {
				params.num = this.searchContent
			}
			this.$http.get(this.$api.cardTicketList, {params})
				.then(({data}) => {
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
}
</style>
