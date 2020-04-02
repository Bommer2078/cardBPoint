const sideClomunDate = {
	data () {
		return {
			clomunArr: [
				{
					label     : '普通用户',
					nodeKey   : 'userManage',
					routerLink: '/userManage/userList'
				},
				{
					label     : '所属地管理',
					nodeKey   : 'locationManage',
					routerLink: '/locationManage'
				},
				{
					label     : '权益卡管理',
					nodeKey   : 'ticketManage',
					routerLink: '/ticketManage'
				},
				{
					label     : '场馆管理',
					nodeKey   : 'venueManage',
					routerLink: '/venueManage/venueList'
				},
				{
					label     : '订单管理',
					nodeKey   : 'orderManage',
					routerLink: '/orderManage'
				},
				{
					label     : '关于',
					nodeKey   : 'aboutManage',
					routerLink: '/aboutManage'
				}
			],
			defaultProps: {
				children: 'children',
				label   : 'label'
			}
		}
	}
}

export default sideClomunDate
