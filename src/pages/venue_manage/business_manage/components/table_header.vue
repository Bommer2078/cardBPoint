<template>
	<div class="table-header">
		<t-button @clickBtn="createdBusiness">绑定商家账号</t-button>
		<el-dialog
			width="530px"
			title="商家设置"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="left-part">
				<search-group ref="searchGroup" placeholder="请输入用户昵称"></search-group>
			</div>
			<el-table
				:data="tableDateArr"
				@selection-change="handleSelectionChange"
				style="width: 100%">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column
					prop="nickname"
					label="微信昵称"
					min-width="33%">
				</el-table-column>
				<el-table-column
					align="center"
					prop="state"
					label="头像"
					min-width="33%">
					<template slot-scope="scope">
						<img class="avatar-img" :src="scope.row.avatar">
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer">
				<t-button @clickBtn="saveBusiness">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
import searchGroup from '@/components/common/search_group.vue'
export default {
	components: {
		tButton,
		searchGroup
	},
	props: {
		currentObj: {
			type   : Object,
			default: null
		}
	},
	data () {
		return {
			tableDateArr  : [],
			showSettingBox: false,
			searchContent : '',
			userArr       : []
		}
	},
	computed: {
		venueId () {
			return this.$route.query.id
		}
	},
	created () {
		this.$nextTick(() => {
			this.$EventBus.$on('search', this.handleSearch)
		})
	},
	destroyed () {
		this.$EventBus.$off('search')
	},
	methods: {
		handleSearch (val) {
			if (!val) {
				this.$message.error('搜索内容不能为空')
			}
			this.searchContent = val
			this.getUserList()
		},
		getUserList () {
			const params = {
				page    : 1,
				pageSize: 100,
				search  : String(this.searchContent)
			}

			this.$http.get(this.$api.getCommenUserList, {params}).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.tableDateArr = data.data
				} else {
					this.$message.error(msg)
				}
			})
		},
		createdBusiness (bl) {
			this.showSettingBox = true
		},
		handleSelectionChange (val) {
			this.userArr = val
		},
		saveBusiness () {
			if (!this.userArr.length > 0) {
				this.$message.error('还未选中任何用户作为管理员')
				return
			}
			let params = {
				user_id : this.userArr[0].id,
				venue_id: this.venueId
			}

			this.$http.post(this.$api.venueSaveUser, params)
				.then((res) => {
					if (res.data.code === 0) {
						this.showSettingBox = false
						this.$EventBus.$emit('reflash')
					} else if (res.data.code === '10002') {
						this.$message.error('用户已存在')
					} else {
						this.$message.error(res.data.message)
					}
				})
		}
	}
}
</script>

<style lang="less" scoped>
.table-header {
	padding: 20px;
	font-size: 0;
	.avatar-img {
		width: 50px;
		height: 50px;
	}
	.t-button + .t-button{
		margin-left: 10px;
	}
	.left-part {
		display: flex;
		float: right;
		.search-group {
			margin-left: 10px;
		}
		& /deep/ .el-select .el-input__inner{
			height: 36px;
		}
		.el-select + .el-select {
			margin-left: 10px;
		}
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
    .form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.label {
			width: 100px;
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
		textarea {
			width: 300px;
			height: 200px;
			padding-top: 10px;
			resize: none;
		}
		.align-top {
			align-self: flex-start;
		}
	}
	.left-part {
		display: flex;
		float: right;
		.search-group {
			margin-left: 10px;
		}
		& /deep/ .el-select .el-input__inner{
			height: 36px;
		}
		.el-select + .el-select {
			margin-left: 10px;
		}
	}
}
</style>
