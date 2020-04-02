<template>
	<div class="table-header">
		<t-button @clickBtn="createTicket">创建权益卡</t-button>
		<div class="left-part">
			<search-group ref="searchGroup" placeholder="请输入权益卡名称"></search-group>
		</div>
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
	created () {
		this.$EventBus.$on('editTicket', this.createTicket)
	},
	destroyed () {
		this.$EventBus.$off('editTicket')
	},
	methods: {
		createTicket (obj) {
			let url = obj ? `/ticketManage/editTicket?editId=${obj.row.id}` : '/ticketManage/editTicket'

			this.$router.push(url)
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
</style>
