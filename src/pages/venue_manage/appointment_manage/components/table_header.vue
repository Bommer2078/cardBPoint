<template>
	<div class="table-header">
		<div class="venue-name">{{venueName}}</div>
		<t-button @clickBtn="showDateSeletBox">导出数据</t-button>
		<div class="left-part">
			<search-group ref="searchGroup" placeholder="请输入手机号码"></search-group>
		</div>

		<el-dialog
			width="700px"
			title="选择导出时间"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox">
			<div class="form-item">
				<el-date-picker
					v-model="dateVal"
					type="date"
					placeholder="选择日期">
				</el-date-picker>
				<el-time-select
					placeholder="起始时间"
					v-model="startTime"
					:picker-options="{
						start: '00:00',
						step: '01:00',
						end: '24:00'
				}">
				</el-time-select>
				<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					:picker-options="{
						start: '00:00',
						step: '01:00',
						end: '24:00',
						minTime: startTime
				}">
				</el-time-select>
			</div>
			<div slot="footer">
				<t-button @clickBtn="exportExcel">导出</t-button>
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
			showSettingBox: false,
			startTime     : '00:00',
			endTime       : '24:00',
			dateVal       : ''
		}
	},
	computed: {
		venueName () {
			return this.$route.query.name
		},
		venueId () {
			return this.$route.query.id
		}
	},
	created () {
		this.dateVal = new Date()
	},
	methods: {
		showDateSeletBox () {
			this.showSettingBox = true
		},
		exportExcel () {
			let endTime = this.processTime(this.endTime)
			let startTime = this.processTime(this.startTime)
			let params = {
				endTime,
				startTime,
				venueId: this.venueId
			}

			this.$http.get(this.$api.excelBookExport, {params})
				.then((data) => {
					this.download(data.data)
					this.showSettingBox = false
				})
		},
		processTime (val) {
			let temp = new Date(this.dateVal).toLocaleDateString() + ' ' + val
			let temp2 = new Date(temp).getTime()

			return temp2
		},
		download (data) {
			if (!data) {
				return
			}
			let tempTime = new Date(this.dateVal).getTime() + (1000 * 60 * 60 * 24)

			tempTime = new Date(tempTime).toLocaleDateString()
			let url = window.URL.createObjectURL(new Blob([ data ]))
			let downloadElement = document.createElement('a')

			downloadElement.style.display = 'none'
			downloadElement.href = url
			downloadElement.setAttribute('download', `${tempTime}到店游玩名单.xlsx`)
			document.body.appendChild(downloadElement)
			downloadElement.click()
			document.body.removeChild(downloadElement) // 下载完成移除元素
		}
	}
}
</script>

<style lang="less" scoped>
.table-header {
	padding: 20px;
	font-size: 0;
	.venue-name {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 20px;
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
</style>
