<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="nickname"
				label="微信昵称"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="state"
				label="头像"
				min-width="15%">
				<template slot-scope="scope">
					<img class="avatar-img" :src="scope.row.avatar">
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="state"
				label="状态"
				min-width="15%">
				<template slot-scope="scope">
					{{scope.row.state | statusText}}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="注册时间"
				min-width="15%">
				<template slot-scope="scope">
					{{ scope.row.create_at }}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="会员状态"
				min-width="15%">
				<template>
					<span>非会员</span>
				</template>
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="250">
				<template slot-scope="scope">
					<el-switch
						:disabled="forbidClick"
						v-model="scope.row.state"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="恢复"
						inactive-text="冻结"
						:active-value="0"
						:inactive-value="1"
						@change="handleChangeState(scope,scope.row.state)"
					>
					</el-switch>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="intoRecodeList(scope)">足迹</span>
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
	filters: {
		statusText (val) {
			let temp = val === 1 ? '已冻结' : '正常'

			return temp
		}
	},
	created () {
		this.getUserList()
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		intoRecodeList (val) {
			this.$router.push(`/userManage/recodeList?id=${val.row.id}&name=${val.row.nickname}`)
		},
		handleChangeState (obj, state) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const params = {
				id   : obj.row.id,
				state: state === 0 ? 0 : 1
			}

			this.$http.put(this.$api.changeUserState, params).then((res) => {
				if (res.data.code === 0) {
					this.getUserList()
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
			this.getUserList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getUserList()
		},
		getUserList () {
			const params = {
				page    : this.pageIndex,
				pageSize: this.pageSize,
				search  : this.searchContent
			}

			this.$http.get(this.$api.getCommenUserList, {params}).then(({data}) => {
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
	.avatar-img {
		width: 40px;
		height: 40px;
	}
}
</style>
