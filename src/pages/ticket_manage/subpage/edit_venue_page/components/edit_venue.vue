<template>
	<div class="editor-wrap" v-if="editVenue" @click.stop>
		<div class="title">设置场馆的关联规则</div>
		<div class="form-container">
			<div class="form-item">
				<div class="form-label">场馆名称</div>
				<div class="form-content">
					{{editVenue.text}}
				</div>
			</div>
			<div class="form-item" style="margin-top: 10px;">
				<div class="form-label">特惠价格<span class="redStar">*</span></div>
				<div class="form-content">
					<input type="text" class="form-input" v-model.trim="editPrice" @input="inputPrice($event)">
					<span>元</span>
				</div>
			</div>
		</div>
		<t-button @clickBtn="saveRules" class="save-btn">保存</t-button>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
export default {
	name: 'editorWrapper',
	data () {
		return {
			showLoading       : false,
			editVenue         : null,
			editPrice         : '',
			pageIndex         : 1,
			pageSize          : 10,
			total             : 0,
			selectedArr       : [], // 弹窗里选中的场馆
			confirmVenueArr   : [], // 确认选中后的场馆
			tempVenueArr      : [], //  几选几时删除的场馆，临时存放，以便在列表内可以选到该场馆
			confirmVenueArrBak: [] // 备份，以便删除了相关场馆的时候能够及时通知被删除的场馆更改状态
		}
	},
	components: {
		tButton
	},
	props: {
		venueObj: {
			type   : Object,
			default: null
		},
		venueArr: {
			type: Array,
			default () {
				return []
			}
		}
	},
	created () {
		this.initEditObj()
	},
	methods: {
		initEditObj () {
			this.$nextTick(() => {
				this.editVenue = JSON.parse(JSON.stringify(this.venueObj))
				if (this.editVenue.editPrice || this.editVenue.editPrice === 0) {
					this.editPrice = this.editVenue.editPrice || 0
				}
			})
		},
		saveRules () {
			this.editVenue.editPrice = this.editPrice
			this.$EventBus.$emit('editFinished', this.editVenue)
		},
		inputPrice (e) {
			let tempNum = e.target.value

			this.editPrice = tempNum.replace(/[^\d.]/g, '').replace(/^\./g, '')
				.replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
				.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
		}
	}
}
</script>

<style lang="less" scoped>
.editor-wrap {
    font-size: 14px;
    color: rgba(53,53,53,1);
    padding: 0 20px 20px;
    width: 355px;
    box-sizing: border-box;
    position: absolute;
    left: 100%;
    top: 0;
    min-height: 190px;
    background: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    &:after,
    &:before {
        right: 100%;
        top: 20px;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    &:before {
        border-color: transparent;
        border-right-color: #e5e5e5;
        border-width: 7px;
        margin-top: -7px;
    }
    &:after {
        border-color: transparent;
        border-right-color: #f8f8f8;
        border-width: 6px;
        margin-top: -6px;
    }
    .title {
        height: 50px;
        line-height: 50px;
        font-weight: 800;
	}
}
.related-venue {
    display: flex;
    flex-flow: wrap;
    margin-top: 10px;
    .venue-item {
        font-size: 12px;
        line-height: 18px;
        position: relative;
        border: 1px solid #2A75ED;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 10px;
        border-radius: 4px;
        margin-top: 10px;
        span {
            display: inline-block;
            max-width: 220px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: keep-all;
        }
    }
    .item-close-icon {
        position: absolute;
        top: -8px;
        right: -8px;
    }
}
.add-related-venue-btn {
    background: none;
    outline: none;
    border: 1px dashed #2A75ED;
    display: block;
    height: 30px;
    width: 100%;
    color: #2A75ED;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
}
.form-container {
    color: #353535;
    text-align: initial;
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
}
input {
    width:85px;
    height:36px;
    padding-left: 10px;
    font-size: 14px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(238,238,238,1);
    box-sizing: border-box;
    margin-right:7px;
}
.save-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
.select-input {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 20px;
    padding: 4px;
    text-align: center;
    box-sizing: border-box;
    vertical-align: middle;
}
.forbid {
    background: #eee;
    cursor: not-allowed;
}
.cycle-type .el-radio {
    display: block;
    margin-bottom: 10px;
}
</style>
