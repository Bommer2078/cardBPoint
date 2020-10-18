
<template>
	<div class="table-header">
		<el-dialog
			width="530px"
			:title="`${currentSetVenue && currentSetVenue.name}分销设置`"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showBox">
			<div class="left-part">
				<input type="text" placeholder="请输入扩展值" v-model.trim="expandVal">
				<input type="text" placeholder="请输入关联的权益卡id" v-model.trim="vCardId">
				<t-button @clickBtn="addDistribute">新增</t-button>
			</div>
			<el-table
				:data="tableDateArr"
				style="width: 100%">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column
					prop="expand_value"
					label="扩展值"
					min-width="33%">
				</el-table-column>
				<el-table-column
					align="center"
					prop="card_name"
					label="联票名称"
					min-width="33%">
				</el-table-column>
				<el-table-column
					align="center"
					prop="state"
					label="二维码"
					min-width="33%">
					<template slot-scope="scope">
						<img class="avatar-img" :src="scope.row.avatar" @click="getQrUrl(scope.row)">
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer">
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
	props: {
		showDistributeBox: {
			type   : Boolean,
			default: false
		},
		currentSetVenue: {
			type: Object,
			default () {
				return null
			}
		}
	},
	data () {
		return {
			tableDateArr: [],
			expandVal   : '',
			vCardId     : ''
		}
	},
	computed: {
		showBox: {
			get: function () {
				return this.showDistributeBox
			},
			set: function (newVal) {
				this.$emit('update:showDistributeBox', newVal)
			}
		},
		venueId () {
			return this.currentSetVenue && this.currentSetVenue.id
		}
	},
	watch: {
		showBox (newVal) {
			if (!newVal) {
				this.expandVal = ''
				this.vCardId = ''
			} else {
				this.getDistributeList()
			}
		}
	},
	methods: {
		addDistribute () {
			const params = {
				venue_id    : this.venueId,
				card_id     : this.vCardId,
				expand_value: this.expandVal,
				path        : 'pages/confirmPage/confirmPage'
			}

			this.$http.post(this.$api.saveQrcode, params).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.$message('新增成功')
					this.getDistributeList()
				} else {
					this.$message.error(msg)
				}
			})
		},
		getDistributeList () {
			const params = {
				page    : 1,
				pageSize: 100,
				venue_id: this.venueId
			}

			this.$http.get(this.$api.getQrcodeList, {params}).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.tableDateArr = data.data
				} else {
					this.$message.error(msg)
				}
			})
		},
		getQrUrl (obj) {
			let url = `${obj.path}?venueId=${obj.venue_id}&expandValue=${obj.expand_value}&vCardId=${obj.card_id}`
			const params = {
				path: url
			}

			this.$http.get(this.$api.getQrcode, {params}).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.tableDateArr = data.data
				} else {
					this.$message.error(msg)
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
		justify-content: space-around;
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
