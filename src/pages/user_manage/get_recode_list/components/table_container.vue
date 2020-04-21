<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="venue.name"
				label="场馆名称"
				min-width="33%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="create_at"
				label="入场时间"
				min-width="33%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="binding"
				label="使用权益卡名称"
				min-width="33%">
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
		this.getRecodeList()
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	computed: {
		currentUserId () {
			return this.$route.query.id
		}
	},
	methods: {
		changeCover (e, item) {
			this.uploadImg(e).then((res) => {
				console.log('res', res)
			})
		},
		bindTicket (item, url) {
			let params = {
				bindingName : item.bindingName,
				bingingPhoto: url,
				childCode   : item.childCode,
				password    : item.password,
				username    : item.username,
				id          : item.id
			}

			this.$http.put(this.$api.bindTicket, params).then((res) => {
				if (res.data.code === '0') {
					this.$message('绑定成功！')
					this.getRecodeList()
				} else {
					this.$message.error(res.data.message)
				}
			})
				.finally(() => {
					this.forbidClick = false
				})
		},
		handleSearch (val) {
			this.searchContent = val
			this.pageIndex = 1
			this.getRecodeList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getRecodeList()
		},
		getRecodeList () {
			const params = {
				page    : this.pageIndex,
				pageSize: this.pageSize,
				user_id : this.currentUserId,
				type    : 0
			}

			if (this.searchContent) {
				params.childCode = this.searchContent
			}
			this.$http.post(this.$api.getRecodeList, params).then(({data}) => {
				if (data.code === 0) {
					this.tableDateArr = data.data.data
					console.log(this.tableDateArr)
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
	.file-img {
		display: block;
		width: 100px;
		height: 36px;
		font-size: 0;
		position: absolute;
		cursor: pointer;
		top: 60px;
		left: 0;
		opacity: 0;
	}
}
</style>
