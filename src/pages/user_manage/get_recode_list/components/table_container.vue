<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="venue.name"
				label="场馆名称"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="create_at"
				label="入场时间"
				min-width="25%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="binding"
				label="使用价格"
				min-width="25%">
				<template slot-scope="scope">
					<div>
						{{scope.row.price/100}}元
					</div>
				</template>>
			</el-table-column>
			<el-table-column
				align="center"
				prop="create_at"
				label="支付状态"
				min-width="25%">
				<template slot-scope="scope">
					<div>
						{{ scope.row.paid_state | payText }}
					</div>
				</template>>
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
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
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
	computed: {
		currentUserId () {
			return this.$route.query.id
		}
	},
	methods: {
		changeCover (e, item) {
			this.uploadImg(e).then((res) => {
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
