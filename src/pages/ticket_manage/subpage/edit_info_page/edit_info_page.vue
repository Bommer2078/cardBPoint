<template>
	<div class="edit-ticket">
		<div class="form-container">
			<div class="form-title">权益卡基础信息设置</div>
			<div class="form-item">
				<div class="form-label">权益卡名称<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" placeholder="请输入权益卡名称" v-model.trim="ticketName">
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">封面图<span class="redStar">*</span></div>
				<div class="form-content cover-img-wrap">
					<div class="cover-img-box">
						<img
							v-if="!img_url"
							class="cover-img-defalut"
							src="../../../../assets/images/icon_addpic.svg" >
						<img
							v-if="img_url"
							:src="img_url"
							class="cover-img" >
					</div>
					<div class="cover-img-option">
						<button class="img-btn">选择图片</button>
						<p class="img-explain">小于3M，支持jpg、png、jpeg格式</p>
						<input
							v-if="!imgLoading"
							class="file-img"
							type="file"
							accept="image/png, image/jpeg, image/jpg"
							@change="changeCover($event)">
					</div>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">关联城市<span class="redStar">*</span></div>
				<div class="form-content">
					<el-select v-model="locationSelected" placeholder="请选择城市">
						<el-option
							v-for="item in locationSelectArr"
							:key="item.id"
							:value="item.id"
							:label="item.name"></el-option>
					</el-select>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">付费方式<span class="redStar">*</span></div>
				<div class="form-content align-top">
					<el-radio v-model="sellType" :label="0">免费</el-radio>
					<el-radio v-model="sellType" :label="1">付费</el-radio>
				</div>
			</div>
			<div class="form-item" v-if="sellType === 1">
				<div class="form-label align-top">规格设置<span class="redStar">*</span></div>
				<div class="form-content">
					<div class="sku-header">
						<span class="sku-name">名称</span>
						<span class="sku-price">价格</span>
						<span class="sku-time">时间</span>
					</div>
					<div class="form-item sku-item" v-for="(item,index) in skuArr" :key="index">
						<input
							type="text"
							class="form-input"
							placeholder="请输入规格名称,建议不要超过4个字"
							v-model.trim="item.name"
							maxlength="4">
						<input
							type="text"
							class="form-input"
							placeholder="请输入价格"
							v-model.trim="item.price"
							@input="inputPrice($event,index)"><span>元</span>
						<input
							type="number"
							class="form-input-mini"
							placeholder="天数"
							v-model.trim="item.day_num"><span>天</span>
					</div>
					<t-button @clickBtn="addSku">增加规格</t-button>
				</div>
			</div>
			<div class="form-item" v-if="sellType === 1">
				<div class="form-label align-top">优惠政策</div>
				<div class="form-content">
					<textarea
						type="text"
						class="form-textarea"
						placeholder="请输入优惠政策提示"
						v-model.trim="prompt"
					></textarea>
				</div>
			</div>
			<div class="form-item">
				<div class="form-label align-top">权益卡描述<span class="redStar">*</span></div>
				<div class="form-content">
					<vue-ueditor-wrap v-model="rich_content" @ready="ready" :config="ueConfig" @blur="getPlainTxt"></vue-ueditor-wrap>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button'
import * as config from '../../../../libs/ue_config'
export default {
	data () {
		return {
			ticketName       : '',
			imgLoading       : false,
			rich_content     : '',
			content          : '',
			locationSelected : '',
			locationSelectArr: [],
			forbidClick      : false,
			img_url          : '',
			editId           : '',
			ueConfig         : config.litteConfig,
			sellType         : 0, // 付费方式0，免费1，付费，
			prompt           : '', // 优惠政策
			skuArr           : [ {
				price  : 0,
				name   : '1天',
				day_num: 1
			} ] // 规格数组
		}
	},
	components: {
		tButton
	},
	watch: {
		rich_content (nval) {
			this.getPlainTxt()
		}
	},
	created () {
		this.getSelectArr()
		this.getTicketInfo()
	},
	methods: {
		addSku () {
			let boolean = this.skuArr.some((i) => {
				return !String(i.price) || !String(i.name) || !String(i.day_num)
			})
			const obj = {
				price  : '',
				name   : '',
				day_num: ''
			}

			if (boolean) {
				this.$message.error('请完善规格')
				return
			}
			this.skuArr.push(obj)
		},
		changeCover (e) {
			this.uploadImg(e).then((res) => {
				this.img_url = res
				this.$message('上传成功')
			})
		},
		ready (editorInstance) {
			this.UEdit = editorInstance
		},
		getPlainTxt () {
			if (this.UEdit) {
				this.$nextTick(() => {
					this.content = this.UEdit.getPlainTxt()
				})
			}
		},
		getSelectArr () {
			let params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.post(this.$api.getLocationList, {params})
				.then(({data:{code, data, message}}) => {
					if (code === 0) {
						this.locationSelectArr = data.data
					}
				})
		},
		getTicketInfo () {
			this.editId = this.$route.query.editId
			if (!this.editId) return
			let params = {
				id: this.editId
			}

			this.$http.get(this.$api.getCardDetails, {params}).then((res) => {
				if (res.data.code === 0) {
					this.initTicketInforData(res.data.data)
					this.$EventBus.$emit('getVenueArr', res.data.data.venue_arr)
				}
			})
		},
		initTicketInforData (obj) {
			this.rich_content = obj.remark
			this.ticketName = obj.name
			this.img_url = JSON.parse(obj.banner)[0]
			this.locationSelected = obj.city_id
			this.price = obj.price / 100
			this.prompt = obj.prompt
			this.sellType = obj.sell_type
			if (obj.sell_type === 1) {
				let skuArr = obj.sku_arr.map((i) => {
					let temp = {...i}

					temp.price = temp.price / 100
					return temp
				})

				this.skuArr = skuArr
			}
		},
		saveTicket () {
			if (!this.checkForm()) {
				return null
			}
			// let placeName = this.locationSelectArr.find((i) => {
			// 	return i.id === this.locationSelected
			// }).name
			let skuArr = this.skuArr.map((i) => {
				let temp = {...i}

				temp.price = temp.price * 100
				return temp
			})
			let tempObj = {
				remark   : this.rich_content,
				name     : this.ticketName,
				banner   : [ this.img_url ],
				city_id  : this.locationSelected,
				sell_type: this.sellType,
				prompt   : this.prompt,
				sku_arr  : skuArr
			}

			return tempObj
		},
		handleInputNum (e, val) {
			let tempNum = parseInt(e.target.value)

			if (isNaN(tempNum)) {
				tempNum = ''
			}
			this[val] = tempNum <= 0 ? '' : tempNum
		},
		inputPrice (e, index) {
			let tempNum = e.target.value

			this.skuArr[index].price = tempNum.replace(/[^\d.]/g, '').replace(/^\./g, '')
				.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
				.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
		},
		checkForm () {
			if (!this.ticketName) {
				this.$message.error('权益卡名称不能为空')
				return false
			}
			if (!this.img_url) {
				this.$message.error('权益卡图片不能为空')
				return false
			}
			if (!this.locationSelected) {
				this.$message.error('请选择城市')
				return false
			}
			if (!this.rich_content) {
				this.$message.error('权益卡描述不能为空')
				return false
			}
			if (this.sellType === 1) {
				let boolean = this.skuArr.some((i) => {
					return !String(i.price) || !String(i.name) || !String(i.day_num)
				})

				if (boolean) {
					this.$message.error('请完善规格')
					return false
				}
			}
			return true
		}
	}
}
</script>

<style scoped lang="less">
.edit-ticket {
    padding: 20px;
	box-sizing: border-box;
	min-height: calc(100vh - 160px) !important;
	margin-bottom: 60px;
    .form-container {
        color: #353535;
        .form-title {
            position: relative;
            font-size: 16px;
            font-weight: 700;
            padding-left: 10px;
            margin-bottom: 20px;
            &::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 0px;
                width: 2px;
                height: 14px;
                background: #2A75ED;
            }
        }
        .form-item {
            margin-left: 10px;
            margin-bottom: 30px;
            .form-label {
                display: inline-block;
                width: 110px;
                font-size: 14px;
			}
			.redStar {
				margin-left: 4px;
				width: 7px;
				height: 20px;
				position: relative;
				color: #e64340;
			}
            .form-content {
                display: inline-block;
            }
            .align-top {
                vertical-align: top;
                margin-top: 12px;
            }
		}
		.item-label {
			margin-bottom: 20px;
		}
    }
    input {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
    }
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

.cover-img-box,
.cover-img-option {
  display: inline-block;
  vertical-align: top;
  position: relative;
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

.img-explain {
  width:230px;
  height:44px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(136,136,136,1);
  line-height:22px;
}

.cover-img-defalut {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 24px !important;
  height: 24px !important;
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

    .form-input, .form-input-mini {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
	}
	.form-item .form-input-mini {
        width:60px;
		height:36px;
		margin-left: 10px;
	}
	.form-item .form-item {
		margin-left: 0 !important;
	}
	.form-textarea {
		display: block;
		width: 300px;
		height: 200px;
		padding: 10px;
	}
	.sku-header {font-size:0;}
	.sku-header span {
		font-size: 14px;
		font-weight: 700;
		padding-bottom: 10px;
		display: inline-block;
		border-bottom: 1px solid #eee;
	}
	.sku-header .sku-name{
		width: 255px;
	}
	.sku-header .sku-price{
		width: 280px;
	}
	.sku-header .sku-time{
		width: 100px;
	}
	.sku-item {
		padding-top: 10px;
		padding-bottom: 10px;
		margin-bottom:0 !important;
	}
</style>
