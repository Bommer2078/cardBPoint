<template>
	<div class="table-header">
		<t-button @clickBtn="createdVenue">创建场馆</t-button>
		<t-button @clickBtn="createdVenueType">创建类型</t-button>
		<div class="left-part">
			<el-select v-model="locationSelected" placeholder="选择城市" @change="changeLocation">
				<el-option :value="-1" label="全部城市"></el-option>
				<template v-for="item in locationSelectArr" >
					<el-option
						:key="item.id"
						:label="item.name"
						:value="item.id"></el-option>
				</template>
			</el-select>
			<search-group ref="searchGroup" placeholder="请输入场馆名称"></search-group>
		</div>
		<el-dialog
			width="530px"
			title="类型设置"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showTypeManage">
			<div class="add-btn" @click="handleAddType">添加类型</div>
			<el-table
				:data="typeArr"
				style="width: 100%">
				<el-table-column
					prop="name"
					label="类型名称"
					min-width="15%">
					<template slot-scope="scope">
						<input type="text" class="type-input"  v-if="scope.row.editActive" v-model.trim="scope.row.name">
						<span v-else>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column
					class="option"
					align="right"
					label="操作"
					width="300">
					<template slot-scope="scope">
						<span type="text" class="setting-btn" @click="handleSaveType(scope.row)"  v-if="scope.row.editActive">保存</span>
						<template v-else>
							<span type="text" class="setting-btn" @click="handleTypeEdit(scope.$index)">编辑</span>
							<span class="split">|</span>
							<span type="text" class="setting-btn" @click="checkTypeDel(scope.row)">删除</span>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer">
				<t-button @clickBtn="showTypeManage = false">确定</t-button>
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
	data () {
		return {
			typeArr    : [],
			copyTypeArr: [ {
				name: '111'
			} ],
			forbidClick      : false,
			locationSelectArr: [],
			locationSelected : -1,
			showTypeManage   : false,
			activeAlready    : false
		}
	},
	created () {
		this.getLocationArr()
		this.getVenueTypeList()
		this.$EventBus.$on('editVenue', this.createdVenue)
	},
	destroyed () {
		this.$EventBus.$off('editVenue')
	},
	methods: {
		createdVenueType () {
			this.typeArr = JSON.parse(JSON.stringify(this.copyTypeArr))
			this.activeAlready = false
			this.showTypeManage = true
		},
		handleAddType () {
			if (this.forbidClickFn()) return
			this.activeAlready = true
			this.typeArr.unshift({
				editActive: true,
				name      : '',
				id        : ''
			})
		},
		handleSaveType (obj) {
			this.forbidClick = true
			let params = {
				id  : obj.id,
				name: obj.name
			}

			this.$http.post(this.$api.editVenueType, params)
				.then(({data:{code, data, msg}}) => {
					if (code === 0) {
						this.$message.success('保存成功')
						this.activeAlready = false
						this.getVenueTypeList()
					} else {
						this.$message.error(msg)
					}
				}).finally(() => {
					this.forbidClick = false
				})
		},
		handleTypeEdit (index) {
			if (this.forbidClickFn()) return
			this.activeAlready = TextTrackCue
			const obj = {
				editActive: true,
				...this.typeArr[index]
			}

			this.typeArr.splice(index, 1, obj)
		},
		checkTypeDel (obj) {
			if (this.forbidClickFn()) return
			this.$alert('删除后无法恢复，确认删除该类型？', '删除类型', {
				confirmButtonText: '确定'}).then(() => {
				this.handleDelType(obj)
			})
		},
		forbidClickFn () {
			if (this.forbidClick) return true
			if (this.activeAlready) {
				this.$message.error('请先保存正在编辑的类型')
				return true
			}
			return false
		},
		handleDelType (obj) {
			this.forbidClick = true
			let params = {
				id: obj.id
			}

			this.$http.post(this.$api.delVenueType, params)
				.then(({data:{code, data, msg}}) => {
					if (code === 0) {
						this.$message.success('删除成功')
						this.getVenueTypeList()
					} else {
						this.$message.error(msg)
					}
				}).finally(() => {
					this.forbidClick = false
				})
		},
		getLocationArr () {
			let params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.post(this.$api.getLocationList, params)
				.then(({data:{code, data, message}}) => {
					if (code === 0) {
						this.locationSelectArr = data.data
					}
				})
		},
		getVenueTypeList () {
			let params = {
				page    : 1,
				pageSize: 100
			}

			this.$http.post(this.$api.getVenueTypeList, {params})
				.then(({data:{code, data, message}}) => {
					if (code === 0) {
						this.copyTypeArr = JSON.parse(JSON.stringify(data.data))
						this.typeArr.splice(0, this.typeArr.length)
						this.$nextTick(() => {
							this.typeArr = JSON.parse(JSON.stringify(data.data))
						})
					}
				})
		},
		createdVenue (obj) {
			let url = obj ? `/venueManage/editVenue?editId=${obj.row.id}` : '/venueManage/editVenue'

			this.$router.push(url)
		},
		changeLocation () {
			this.$refs.searchGroup.searchContent = ''
			this.$EventBus.$emit('changeLocation', this.locationSelected === -1 ? '' : this.locationSelected)
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
	.add-btn {
		width: 100%;
		height: 22px;
		line-height: 22px;
		text-align: center;
		color: #2A75ED;
		border-radius: 4px;
		border: 1px dashed #2A75ED;
		cursor: pointer;
	}
	.setting-btn {
		color: #409eff;
		cursor: pointer;
		user-select: none;
	}
	.split {
		color: #409eff;
		margin-left: 10px;
		margin-right: 10px;
		user-select: none;
	}
}
</style>
