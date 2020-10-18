<template>
	<div class="table-container">
		<el-table
			:data="tableDateArr"
			style="width: 100%">
			<el-table-column
				prop="name"
				label="场馆名称"
				min-width="15%">
			</el-table-column>
			<el-table-column
				align="center"
				prop="banner"
				label="缩略图"
				min-width="25%">
				<template slot-scope="scope">
					<img class="img-compressed" :src="JSON.parse(scope.row.banner)[0]">
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="price"
				label="门店价格"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.price / 100}}元</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="status"
				label="状态"
				min-width="25%">
				<template slot-scope="scope">
					<span>{{scope.row.status | statusText }}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="city_name"
				label="所属地"
				min-width="25%">
			</el-table-column>
			<el-table-column
				class="option"
				align="right"
				label="操作"
				width="300">
				<template slot-scope="scope">
					<span type="text" class="setting-btn" @click="intoAppointmentList(scope)" v-if="scope.row.booking">预约列表</span>
					<span class="split" v-if="scope.row.booking">|</span>
					<span type="text" class="setting-btn" @click="intoBusinessList(scope)">商户列表</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="handleDistribute(scope.row)">配置分销</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="handleEdit(scope)">编辑</span>
					<span class="split">|</span>
					<span type="text" class="setting-btn" @click="checkDel(scope)">删除</span>
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
		<distribute-box :showDistributeBox.sync="showDistributeBox" :currentSetVenue="currentSetVenue"></distribute-box>
	</div>
</template>

<script>
import distributeBox from '../../../components/distributeBox'
export default {
	components: {
		distributeBox
	},
	data () {
		return {
			tableDateArr     : [],
			total            : 0,
			pageIndex        : 1,
			pageSize         : 10,
			forbidClick      : false,
			searchContent    : '',
			location         : '',
			showDistributeBox: false,
			currentSetVenue  : null
		}
	},
	created () {
		this.getVenueList()
		this.$EventBus.$on('changeLocation', this.handleLocationChange)
		this.$EventBus.$on('search', this.handleSearch)
	},
	destroyed () {
		this.$EventBus.$off('changeLocation')
		this.$EventBus.$off('search')
	},
	filters: {
		statusText (val) {
			let text = ''

			switch (val) {
				case 0:
					text = '上架'
					break
				case 1:
					text = '下架'
					break
				case 2:
					text = '过期'
					break
				default:
					text = '上架'
					break
			}
			return text
		}
	},
	methods: {
		onShelves () {

		},
		changeState () {

		},
		intoBusinessList (val) {
			let url = `/venueManage/businessManage?id=${val.row.id}`

			this.$router.push(url)
		},
		intoAppointmentList (val) {
			let url = `/venueManage/appointmentManage?id=${val.row.id}&name=${val.row.name}`

			this.$router.push(url)
		},
		handleEdit (obj) {
			this.$EventBus.$emit('editVenue', obj)
		},
		handleDistribute (obj) {
			this.currentSetVenue = null
			this.$nextTick(() => {
				this.currentSetVenue = obj
				this.showDistributeBox = true
			})
		},
		checkDel (obj) {
			this.$alert('删除后无法恢复，确认删除该场馆？', '删除场馆', {
				confirmButtonText: '确定'}).then(() => {
				this.handleChangeState(obj)
			})
		},
		handleChangeState (obj) {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			let params = {
				id: obj.row.id
			}

			this.$http.post(this.$api.delVenue, params).then((res) => {
				if (res.data.code === 0) {
					// 删除为空时，向前跳页
					if (this.tableDateArr.length === 1 && this.pageIndex > 1) {
						this.pageIndex -= 1
					}
					this.getVenueList()
					this.$message.success('删除成功')
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
			this.getVenueList()
		},
		changePage (val) {
			this.pageIndex = val
			this.getVenueList()
		},
		handleLocationChange (val) {
			this.location = val
			this.searchContent = ''
			this.pageIndex = 1
			this.getVenueList()
		},
		getVenueList () {
			const params = {
				city_id : this.location,
				page    : this.pageIndex,
				pageSize: this.pageSize,
				search  : String(this.searchContent)
			}

			this.$http.get(this.$api.getVenueList, {params}).then(({data:{code, data, message}}) => {
				if (code === 0) {
					this.tableDateArr = data.data
					this.total = data.total
				} else {
					this.$message.error(message)
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
		max-width: 240px;
		width: 100%;
		height: 130px;
	}
}
</style>
