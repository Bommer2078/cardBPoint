<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="name"
				label="名称"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="banner"
				label="缩略图"
				min-width="25%">
				<template slot-scope="scope">
					<img class="img-compressed" :src="scope.row.banner ? JSON.parse(scope.row.banner)[0]: ''">
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="city_name"
				label="所属地"
				min-width="25%">
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				min-width="25%">
				<template slot-scope="scope">
					<span type="text" class="setting-btn" @click="gotoList(scope)">生产列表</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="handleEdit(scope)">编辑</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="checkDel(scope.row)">删除</span>
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
			placeId      : '',
			total        : 0,
			pageIndex    : 1,
			pageSize     : 10,
			forbidClick  : false,
			searchContent: ''
		}
	},
	created () {
		this.getTicketList()
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		gotoList (val) {
			this.$router.push({
				path : '/ticketManage/productTicket',
				query: {
					editId: val.row.id
				}
			})
		},
		handleEdit (obj) {
			this.$EventBus.$emit('editTicket', obj)
		},
		checkDel (obj) {
			this.$alert('删除后无法恢复，确认删除该权益卡？', '删除权益卡', {
				confirmButtonText: '确定'}).then(() => {
				this.handleDelet(obj)
			})
		},
		handleDelet (obj) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			let params = {
				id: obj.id
			}

			this.$http.post(this.$api.delTicket, params).then((res) => {
				if (res.data.code === 0) {
					// 删除为空时，向前跳页
					if (this.tableDateArr.length === 1 && this.pageIndex > 1) {
						this.pageIndex -= 1
					}
					this.getTicketList()
					this.$message.success('删除成功')
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
			this.getTicketList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getTicketList()
		},
		getTicketList () {
			const params = {
				page    : this.pageIndex,
				pageSize: this.pageSize,
				search  : this.searchContent
			}

			this.$http.get(this.$api.getTicketList, {params}).then(({data}) => {
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
		max-width: 240px;
		width: 100%;
		height: 130px;
	}
}
</style>
