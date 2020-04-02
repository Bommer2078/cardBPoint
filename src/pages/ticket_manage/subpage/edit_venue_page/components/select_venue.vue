
<template>
	<div class="select-component">
		<div class="title-part">
			<div class="text">所有可选的场馆</div>
		</div>
		<div class="component-list">
			<div class="component-item"
				v-for="(item,index) in venueArr" :key="item.venue_id"
				:class="{'disabled': item.disabled}"
				@click="onClick(item,index)"
			>
				{{ item.text }}
			</div>
		</div>
		<div v-if="venueArr.length === 0" class="empty-tip">暂无可选场馆</div>
	</div>
</template>

<script>

export default {
	name: 'selectComponent',
	data () {
		return {
			venueArrBak: [],
			venueArr   : []
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
	watch: {
		initData (newVal) {
			this.getVenueArr()
		}
	},
	created () {
		this.getVenueArr()
		this.$EventBus.$on('cancelVenue', this.cancelVenue)
	},
	destroyed () {
		this.$EventBus.$off('cancelVenue')
	},
	methods: {
		onClick (item, index) {
			this.venueArr.splice(index, 1)

			this.$EventBus.$emit('addVenue', item)
		},
		cancelVenue (val) {
			let tempId = val.venue_id
			let tempObj = this.venueArrBak.find((item) => {
				return tempId === item.venue_id
			})

			if (tempObj) {
				this.venueArr.push(tempObj)
			}
		},
		getVenueArr () {
			const params = {
				pageNum : 1,
				pageSize: 100
			}

			this.$http.get(this.$api.getVenueList, {params}).then(({data:{code, data, message}}) => {
				if (code === 0) {
					let tampArr = []

					data.data.forEach((item) => {
						tampArr.push({
							venue_id: item.id,
							text    : item.name,
							price   : item.price
						})
					})
					this.venueArrBak = JSON.parse(JSON.stringify(tampArr))
					this.processShowDate(tampArr)
				} else {
					this.$message.error(message)
				}
			})
		},
		processShowDate (arr) {
			this.venueArr = arr.filter((item) => !this.initData.some((ele) => ele.venue_id === item.venue_id))
		}
	}
}

</script>

<style scoped lang="less">
    .select-component {
        display: inline-block;
        width:270px;
        height:667px;
        background:rgba(249,249,249,1);
        border-radius:2px;
        border:1px solid rgba(229,229,229,1);
        margin-right: 20px;
        padding: 10px 0 0;
        font-size: 14px;
        color: #353535;
        position: relative;
        vertical-align: top;
        .border-line {
            width: 377px;
            height: 667px;
            position: absolute;
            top: -2px;
            left: 100%;
            z-index: 200;
            margin-left: 20px;
            border: 1px solid #eee;
        }
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
		padding: 0 0 0 20px;
		overflow-y: auto;
		height: 580px;
        .component-item {
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
        .disabled {
            background: #FFFFFF !important;
            border:1px dashed #EEEEEE !important;
            color: #B2B2B2 !important;
            cursor: not-allowed !important;
        }
    }
    .empty-tip {
        position: absolute;
        top: 300px;
        left: 90px;
        color: #888;
    }
::-webkit-scrollbar {
    display: none;
}
</style>
