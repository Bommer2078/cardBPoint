<template>
	<div class="table-header">
		<t-button @clickBtn="createLocation">新建所属地</t-button>
		<el-dialog
			width="530px"
			:title="boxTitle"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="showSettingBox"
		>
			<div class="form-item">
				<span class="label">城市名称</span>
				<input type="text" class="setting-input" placeholder="请输入所属地名称" v-model.trim="loctionName" />
			</div>
			<div class="form-item">
				<span class="label">城市logo</span>
				<div class="cover-img-box">
					<img
						v-if="!logoImg"
						class="cover-img-defalut"
						src="@/assets/images/icon_addpic.svg" >
					<img
						v-if="logoImg"
						:src="logoImg"
						class="cover-img" >
				</div>
				<div class="cover-img-option">
					<button class="img-btn">选择图片</button>
					<p class="img-explain">小于5M，支持jpg、png、jpeg格式</p>
					<input
						class="file-img"
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						@change="changeCover($event)">
				</div>
			</div>
			<div slot="footer">
				<t-button @clickBtn="saveLocation">保存</t-button>
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
			logoImg       : '',
			forbidClick   : false,
			showSettingBox: false,
			loctionName   : '',
			boxTitle      : '',
			editObj       : null
		}
	},
	created () {
		this.$nextTick(() => {
			this.$EventBus.$on('editLocation', this.createLocation)
		})
	},
	destroyed () {
		this.$EventBus.$off('editLocation')
	},
	methods: {
		changeCover (e) {
			this.uploadImg(e).then((res) => {
				this.logoImg = res
			})
		},
		createLocation (obj) {
			this.editObj = obj || null
			this.logoImg = obj ? obj.logo : ''
			this.loctionName = obj ? obj.name : ''
			this.boxTitle = obj ? '编辑所属地' : '创建所属地'
			this.showSettingBox = true
		},
		saveLocation () {
			if (this.forbidClick) {
				return
			}
			if (!this.checkVal()) {
				return
			}
			this.forbidClick = true
			const params = {
				name: this.loctionName,
				logo: this.logoImg
			}

			if (this.editObj) {
				params.id = this.editObj.id
			}
			this.$http.post(this.$api.saveLocation, params).then(({data:{code, data, message}}) => {
				if (code === 0) {
					this.$EventBus.$emit('reflash')
					this.showSettingBox = false
					this.$message.success('保存成功')
				} else {
					this.$message.error(message)
				}
			}).finally(() => {
				setTimeout(() => {
					this.forbidClick = false
				}, 3000)
			})
		},
		checkVal () {
			if (this.loctionName === '') {
				this.$message.error('城市名称不能为空')
				return false
			}
			return true
		}
	}
}
</script>

<style lang="less" scoped>
.table-header {
	padding: 20px;
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
			word-break: keep-all;
			margin-right: 20px;
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
	}
	.cover-img-box,
	.cover-img-option {
		display: inline-block;
		vertical-align: top;
		position: relative;
	}

.cover-img-box {
  width:200px;
  height:112px;
  background:rgba(247,248,249,1);
  margin-right: 20px;
  img {
    width:200px;
    height:112px;
  }
}
	.cover-img-defalut {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		width: 24px !important;
		height: 24px !important;
	}
	.img-btn {
		width:100px;
		height:36px;
		background:rgba(250,251,252,1);
		border-radius:2px;
		border:1px solid rgba(229,231,235,1);
	}
	.img-btn:focus {
		outline: none;
	}
	.file-img {
		display: block;
		width: 100px;
		height: 36px;
		font-size: 0;
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		opacity: 0;
	}
}
</style>
