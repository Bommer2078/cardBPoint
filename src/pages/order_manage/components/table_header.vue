<template>
	<div class="table-header">
		<div class="left-part">
			<el-select v-model="selected" placeholder="选择订单类型" @change="changeSelected">
				<template v-for="item in selectArr" >
					<el-option
						:key="item.id"
						:label="item.type"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<search-group ref="searchGroup" placeholder="请输入下单用户名"></search-group>
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
	data () {
		return {
			selected : 0,
			selectArr: [ {
				type: '购买场馆',
				id  : 0
			}, {
				type: '购买权益卡',
				id  : 1
			} ]
		}
	},
	methods: {
		changeSelected () {
			this.$refs.searchGroup.searchContent = ''
			this.$EventBus.$emit('changeType', this.selected)
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
