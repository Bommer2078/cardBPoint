<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="itemName"
				label="名称"
				min-width="15%">
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
		this.$EventBus.$on('reflashDictionaryItem', this.getDictionaryItemArr)
	},
	mounted () {
		this.getDictionaryItemArr()
	},
	destroyed () {
		this.$EventBus.$off('reflashDictionaryItem')
	},
	computed: {
		dictionaryId () {
			return this.$route.query.dictionaryId
		}
	},
	watch: {
		dictionaryId (newVal) {
			if (newVal) {
				this.getDictionaryItemArr()
			}
		}
	},
	methods: {
		changePage (val) {
			this.pageIndex = val
			this.getDictionaryItemArr()
		},
		handleDictionaryChange (val) {
			this.dictionaryId = val
			this.pageIndex = 1
			this.getDictionaryItemArr()
		},
		getDictionaryItemArr () {
			const params = {
				dictionaryId: this.dictionaryId
			}

			this.$http.get(this.$api.getDictionaryItem, {params}).then(({data}) => {
				if (data.code === '0') {
					this.tableDateArr = data.data
				} else {
					this.$message.error(data.message)
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
}
</style>
