<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="booker"
				label="姓名"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="bookerPhone"
				label="手机号码"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="itemName"
				label="权益卡名称"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="ticketNum"
				label="权益卡编码"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="createTime"
				label="预约时间"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{$utils.dateText(scope.row.createTime)}}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="状态"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.status | statusText}}</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="80">
				<template slot-scope="scope">
					<span type="text" class="setting-btn" @click="handleEdit(scope)">{{scope.row.status === 1 ? '撤销' : '--' }}</span>
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
			searchContent: '',
			startTime    : '',
			endTime      : ''
		}
	},
	created () {
		this.getBookList()
		this.$EventBus.$on('changeTime', this.handleChangeTime)
		this.$EventBus.$on('search', this.handleSearch)
	},
	computed: {
		venueId () {
			return this.$route.query.id
		}
	},
	filters: {
		statusText (val) {
			return val === 1 ? '成功预约' : '已撤销'
		}
	},
	destroyed () {
		this.$EventBus.$off('changeTime')
		this.$EventBus.$off('search')
	},
	methods: {
		intoAppointmentList (val) {
			let url = `/venueManage/appointmentManage?id=${val.row.id}`

			this.$router.push(url)
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getBookList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getBookList()
		},
		handleEdit (val) {
			if (val.row.status === 2) {
				return
			}
			this.$http.put(`${this.$api.cancelBooking}/${val.row.id}`)
				.then(({data:{code, data, message}}) => {
					if (code === '0') {
						this.getBookList()
					}
				})
		},
		handleChangeTime (val) {
			this.timeSearch = val
			this.searchContent = ''
			this.pageIndex = 1
			this.getBookList()
		},
		getBookList () {
			const params = {
				venueId    : this.venueId,
				pageNo     : this.pageIndex,
				pageSize   : this.pageSize,
				bookerPhone: this.searchContent,
				startTime  : this.startTime,
				endTime    : this.endTime
			}

			this.$http.get(this.$api.getBookList, {params}).then(({data:{code, data, message}}) => {
				if (code === '0') {
					this.tableDateArr = data.list
					this.total = data.total
				} else {
					this.$message.error(message)
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
		max-width: 240px;
		width: 100%;
		height: 130px;
	}
}
</style>
