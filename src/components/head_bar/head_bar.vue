<template>
	<div class="head-bar">
		<el-breadcrumb class="crumb" separator="/" >
			<template v-for="(item,index) in currentPath">
				<el-breadcrumb-item :to="item.route ? { path: item.route} : {}" :key="index" :replace="true">{{item.tip}}</el-breadcrumb-item>
			</template>
		</el-breadcrumb>
		<span class="login-out-btn" @click="loginOut">登出</span>
	</div>
</template>

<script>
export default {
	data () {
		return {
			crumbList: [ {
				path     : '/userManage/userList',
				crumbName: [ {
					tip: '普通用户'
				} ]
			}, {
				path     : '/userManage/ticketList',
				crumbName: [ {
					tip  : '普通用户',
					route: '/userManage/userList'
				}, {
					tip: '用户足迹'
				} ]
			}, {
				path     : '/locationManage',
				crumbName: [ { tip: '城市管理' } ]
			}, {
				path     : '/ticketManage/editTicket',
				crumbName: [ {
					tip  : '权益卡列表',
					route: '/ticketManage'
				}, {
					tip: '权益卡设置'
				} ]
			}, {
				path     : '/ticketManage/productTicket',
				crumbName: [ {
					tip  : '权益卡列表',
					route: '/ticketManage'
				}, {
					tip: '生产列表'
				} ]
			}, {
				path     : '/ticketManage',
				crumbName: [ { tip: '权益卡列表' } ]
			}, {
				path     : '/goodsManage/editGoods',
				crumbName: [ {
					tip  : '商品列表',
					route: '/goodsManage/goodsList'
				}, {
					tip: '商品设置'
				} ]
			}, {
				path     : '/goodsManage/goodsList',
				crumbName: [ { tip: '商品列表' } ]
			}, {
				path     : '/venueManage/editVenue',
				crumbName: [ {
					tip  : '场馆列表',
					route: '/venueManage/venueList'
				}, {
					tip: '场馆设置'
				} ]
			}, {
				path     : '/venueManage/businessManage',
				crumbName: [ {
					tip  : '场馆列表',
					route: '/venueManage/venueList'
				}, {
					tip: '商户设置'
				} ]
			}, {
				path     : '/venueManage/appointmentManage',
				crumbName: [ {
					tip  : '场馆列表',
					route: '/venueManage/venueList'
				}, {
					tip: '预约列表'
				} ]
			}, {
				path     : '/venueManage/venueList',
				crumbName: [ { tip: '场馆列表' } ]
			}, {
				path     : '/orderManage',
				crumbName: [ { tip: '订单列表' } ]
			}, {
				path     : '/aboutManage',
				crumbName: [ { tip: '关于设置' } ]
			}, {
				path     : '/dictionary',
				crumbName: [ { tip: '字典设置' } ]
			} ]
		}
	},
	computed: {
		currentPath () {
			let temp = this.crumbList.find((i) => {
				return this.$route.path.search(i.path) !== -1
			})

			return temp ? temp.crumbName : ''
		}
	},
	methods: {
		loginOut () {
			localStorage.removeItem('Authorization')
			setTimeout(() => {
				this.$router.replace('/login')
			}, 500)
			this.$http.get(this.$api.loginOut).then((res) => {
				if (res.data.code === 0) {
					this.$message.info('退出登录')
				}
			})
		}
	}
}
</script>

<style scoped lang="less">
.head-bar {
	user-select: none;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 160px;
    width: calc(100vw - 160px);
    height: 60px;
    background: #fff;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    z-index: 999;
    .crumb {
        line-height: 60px;
        color: #353535;
        font-size: 16px;
    }
    .login-out-btn {
		margin-right: 20px;
        line-height: 60px;
        color: #2A75ED;
        cursor: pointer;
	}
	& /deep/ .route-crumb {
		cursor: pointer;
	}
}
</style>
