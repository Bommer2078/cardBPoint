<template>
	<div class="location-card">
		<img :src="locationObj.logo" v-if="locationObj.logo">
		<img src="@/assets/images/location.svg" v-else>
		<div class="card-info">
			<span class="name">{{locationObj.name}}</span>
			<span class="info">场馆数：{{locationObj.venue_num || 0}} </span>
			<span class="info">权益卡名称：{{locationObj.card_name || '未关联'}}</span>
		</div>
		<div class="edit-img">
			<img src="@/assets/images/commen/edit.svg" @click="handleEdit">
			<img src="@/assets/images/commen/delet.svg" @click="checkDel">
		</div>
	</div>
</template>

<script>
export default {
	props: {
		locationObj: {
			type    : Object,
			required: true
		}
	},
	data () {
		return {
			forbidClick: false
		}
	},
	methods: {
		handleEdit () {
			this.$EventBus.$emit('editLocation', this.locationObj)
		},
		checkDel () {
			this.$alert('删除后无法恢复，确认删除该商品？', '删除商品', {
				confirmButtonText: '确定'}).then(() => {
				this.handleDele()
			})
		},
		handleDele () {
			if (this.forbidClick) {
				return
			}
			this.forbidClick = true
			const params = {
				id: this.locationObj.id
			}

			this.$http.post(this.$api.delCity, params).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.$EventBus.$emit('reflash')
					this.showSettingBox = false
					this.$message.success('删除成功')
				} else {
					this.$message.error(msg)
				}
			}).finally(() => {
				setTimeout(() => {
					this.forbidClick = false
				}, 3000)
			})
		}
	}
}
</script>

<style lang="less" scoped>
* {
    box-sizing: border-box;
}
    .location-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 235px;
        height: 80px;
        margin-top: 20px;
        box-sizing: border-box;
        background-color: #f9f9f9;
        transition: .2s all ease;
        cursor: pointer;
        margin-right: 20px;
        position: relative;
        padding: 20px;
        margin-left: 0!important;
        &:hover {
            box-shadow: 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12), 0 3px 5px -1px rgba(0,0,0,.11);
        }
        img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
        }
        .card-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .name {
                font-size: 14px;
                color: #353535;
                margin-bottom: 5px;
            }
            .info {
                font-size: 12px;
                color: #888;
            }
        }
        &:hover .edit-img {
            display: inline;
        }
        .edit-img {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            img {
                width: 15px;
                height: 15px;
                cursor: pointer;
                margin-right: 0;
                margin-left: 20px;
            }
        }
    }
</style>
