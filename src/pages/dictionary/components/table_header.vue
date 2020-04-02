<template>
	<div class="table-header">
		<t-button @clickBtn="createdDictionary">创建字典</t-button>
		<div class="left-part">
		</div>
		<el-dialog
			width="530px"
			title="商家设置"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="form-item">
				<span class="label">字典名称</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="dictionaryName" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveDictionary">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
// import searchGroup from '@/components/common/search_group.vue'
export default {
	components: {
		tButton
		// searchGroup
	},
	data () {
		return {
			showSettingBox: false,
			dictionaryName: ''
		}
	},
	computed: {
		dictionaryId () {
			return this.$route.query.dictionaryId
		}
	},
	created () {
	},
	destroyed () {
	},
	methods: {
		createdDictionary (obj) {
			this.showSettingBox = true
		},
		saveDictionary () {
			let params = {
				name: this.dictionaryName
			}

			this.$http.post(this.$api.saveDictionary, params)
				.then((res) => {
					if (res.data.code === '0') {
						this.$message('成功')
						this.$EventBus.$emit('reflashDictionary')
						this.showSettingBox = false
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
}
</style>
