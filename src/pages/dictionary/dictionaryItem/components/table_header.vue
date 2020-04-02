<template>
	<div class="table-header">
		<t-button @clickBtn="creatDictionaryItem">创建字典项</t-button>
		<div class="left-part">
		</div>
		<el-dialog
			width="530px"
			title="新增字典项"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="form-item">
				<span class="label">字典项名字</span>
				<input type="text" class="setting-input" placeholder="请输入账户名称" v-model.trim="dictionaryItemName" />
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveDictionaryItem">保存</t-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
export default {
	components: {
		tButton
	},
	data () {
		return {
			showSettingBox    : false,
			dictionaryItemName: ''
		}
	},
	methods: {
		creatDictionaryItem () {
			this.showSettingBox = true
		},
		saveDictionaryItem () {
			let params = {
				dictionaryId  : this.$route.query.dictionaryId,
				dictionaryName: this.$route.query.dictionaryName,
				itemName      : this.dictionaryItemName
			}

			this.$http.post(this.$api.saveDictionaryItem, params)
				.then((res) => {
					if (res.data.code === '0') {
						this.$message('成功')
						this.$EventBus.$emit('reflashDictionaryItem')
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
	margin-left: 10px;
}
</style>
