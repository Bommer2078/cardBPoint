<template>
	<div class="business-card">
		<img src="@/assets/images/BusinessMan.svg">
		<div class="card-info">
			<span class="name">账号：{{businessObj.nickname}}</span>
			<i @click="delBusiness">X</i>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		businessObj: {
			type    : Object,
			required: true
		}
	},
	methods: {
		delBusiness () {
			let params = {
				id: this.businessObj.id
			}

			this.$http.post(this.$api.delVenueUser, params)
				.then((res) => {
					if (res.data.code === 0) {
						this.$message('删除成功！')
						this.$EventBus.$emit('reflash')
					}
				})
		}
	}
}
</script>

<style lang="less" scoped>
* {
    box-sizing: border-box;
}
    .business-card {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 235px;
        height: 80px;
        box-sizing: border-box;
        background-color: #f9f9f9;
        transition: .2s all ease;
        cursor: pointer;
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
            i {
                position: absolute;
                top: -5px;
                right: 0;
                font-size: 24px;
                color: red;
                cursor: pointer;
                font-style: normal;
            }
        }
    }
</style>
