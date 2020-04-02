<template>
	<div class="preview">
		<div class="title-part">
			<div class="text">已关联到权益卡的场馆</div>
		</div>
		<div class="component-list">
			<div class="component-item"
				v-for="(item,index) in venueArr" :key="item.venue_id"
				:class="{'edit-down': item.editPrice && !!String(item.editPrice)}"
				@click="showEditBox(item,index)"
			>
				{{ item.text }}
				<img
					v-show="showVenueEdit < 0"
					src="@/assets/images/icon_close.png"
					class="item-close-icon"
					@click.stop="deleteVenue(item,index)">
				<edit-venue v-if="showVenueEdit === index" :venue-obj="editVenueObj" :venue-arr="venueArr"></edit-venue>
			</div>
		</div>
		<div class="tip" v-if="venueArr.length === 0">可从左侧选取场馆加入到此权益卡中</div>
	</div>
</template>

<script>
import editVenue from './edit_venue'
export default {
	name      : 'preview',
	components: {
		editVenue
	},
	data () {
		return {
			venueArr     : [],
			showVenueEdit: -1,
			editVenue    : null
		}
	},
	props: {
		initData: {
			type: Array,
			default () {
				return []
			}
		}
	},
	created () {
		this.$EventBus.$on('addVenue', this.addVenue)
		this.$EventBus.$on('editFinished', this.editFinished)
		this.$EventBus.$on('saveAllVenue', this.saveAllVenue)
	},
	destroyed () {
		this.$EventBus.$off('addVenue')
		this.$EventBus.$off('editFinished')
		this.$EventBus.$off('saveAllVenue')
	},
	watch: {
		initData (newVal) {
			this.venueArr = JSON.parse(JSON.stringify(newVal))
		}
	},
	methods: {
		saveAllVenue () {
			// 首先验证是否所有关联的场馆都有了规则
			for (let i = 0; i < this.venueArr.length; i += 1) {
				if (!String(this.venueArr[i].editPrice)) {
					this.$message.error('请保证所有的场馆都有了自己的优惠价格')
					return
				}
			}
			this.$EventBus.$emit('saveAllVenueBack', this.venueArr)
		},
		addVenue (val) {
			this.venueArr.push(val)
		},
		deleteVenue (val, index) {
			this.venueArr.splice(index, 1)
			this.$EventBus.$emit('cancelVenue', val)
		},
		showEditBox (val, index) {
			this.showVenueEdit = index
			this.editVenueObj = val
		},
		editFinished (val) {
			let tempIndex = this.venueArr.findIndex((item) => {
				return item.venue_id === val.venue_id
			})

			this.showVenueEdit = -1
			this.venueArr.splice(tempIndex, 1, val)
		},
		clearRules (val) {
			let temp = {
				text    : val.text,
				venue_id: val.venue_id
			}
			let index = this.venueArr.findIndex((i) => {
				return val.venue_id === i.venue_id
			})

			this.venueArr.splice(index, 1, temp)
		}
	}
}
</script>

<style scoped lang="less">
.preview {
    border-radius:2px;
    padding: 10px 0 0;
    font-size: 14px;
    color: #353535;
    display: inline-block;
    width: 270px;
    height: 667px;
    position: relative;
    border: 1px solid #eee;
    .tip {
        width: 270px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        top: 330px;
        left: 0;
        text-align: center;
        color: #b2b2b2;
        font-size: 14px;
    }
    .title-part {
        height: 30px;
        margin: 10px 0 20px;
        padding: 0 20px;
        .text {
            line-height: 20px;
            height: 30px;
            border-bottom: 1px solid #EEEEEE;
        }
    }
     .component-list {
        width: 620px;
        max-height: 605px;
        min-height: 605px;
        overflow-y: auto;
        padding: 0 0 0 20px;
        .component-item {
            position: relative;
            width:210px;
            height:36px;
            line-height: 36px;
            text-align: center;
            margin: 0 10px 10px 0;
            background:rgba(255,255,255,1);
            border:1px dashed rgba(238,238,238,1);
            &:hover {
                background:rgba(42,117,237,0.1);
                border:1px dashed rgba(137,180,250,1);
                color: #2A75ED;
                cursor: pointer;
            }
            .item-close-icon {
                display: none;
                position: absolute;
                top: 10px;
                right: 10px;
            }
            &:hover .item-close-icon {
                display: inline-block;
            }
            i {
                width: 16px;
                height: 16px;
                float: left;
                font-size: unset;
            }
            span {
                float: left;
                margin-left: 6px;
                user-select: none;
            }
        }
        .edit-down {
            background: #888 !important;
        }
    }
}
::-webkit-scrollbar {
    display: none;
}
</style>
