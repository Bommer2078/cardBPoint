const val = process.env.API_ROOT
const api = {
	loginTo : `${val}/hugo_login`,
	loginOut: `${val}/logout`,

	// 城市
	saveLocation   : `${val}/city/save`,
	getLocationList: `${val}/city/list`,
	delCity        : `${val}/city/del`,

	// 场馆
	getVenueList    : `${val}/venue/list`,
	saveVenue       : `${val}/venue/save`,
	venueDetails    : `${val}/venue/details`,
	delVenue        : `${val}/venue/del`,
	editVenueType   : `${val}/venue/type/save`, // 场馆类型
	getVenueTypeList: `${val}/venue/type/list`, // 场馆列表
	delVenueType    : `${val}/venue/type/del`, // 场馆删除
	delVenueUser    : `${val}/venue/user/del`, // 场馆删除商户
	venueUserList   : `${val}/venue/user/list`, // 场馆商户
	venueSaveUser   : `${val}/venue/user/save`, // 新增商户
	getVenueOrder   : `${val}/order/admin_list`, // 商户统计

	// 普通用户
	getCommenUserList: `${val}/user/list`,
	changeUserState  : `${val}/user/change_state`,
	getwriteOffList  : `${val}/verify/listByVerifyUsername`,
	getRecodeList    : `${val}/`,

	// 权益卡
	saveTicket        : `${val}/card/save`,
	getTicketList     : `${val}/card/list`,
	delTicket         : `${val}/card/del`,
	getCardDetails    : `${val}/card/details`,
	cardTicketList    : `${val}/card/ticket/list`,
	batchProductTicket: `${val}/card/ticket/batch`, // 批量生产票
	excelExport       : `${val}/card/ticket/excel_export`, // 导出excel
	batchUpdateStatus : `${val}/card/ticket/change_state`, // 批量改状态

	// 字典
	saveDictionary    : `${val}/dictionary`,
	getDictionary     : `${val}/dictionary/list`,
	saveDictionaryItem: `${val}/dictionaryItem`,
	getDictionaryItem : `${val}/dictionaryItem/listByDictionaryId`,

	// 订单
	getOrderList   : `${val}/order/list`,	// 根据条件分页查找订单
	deleRecode     : `${val}/verify`,	// 根据条件分页查找订单
	ship           : `${val}/order/ship`,
	notice         : `${val}/notice/list`,
	noticeDetail   : `${val}/config/save`,
	bindTicket     : `${val}/ticket/bandingNameAndPhoto`,
	getBookList    : `${val}/booking/listByVenueId`,
	excelBookExport: `${val}/booking/excelExport`,
	cancelBooking  : `${val}/booking/cancelBooking`
}

export default api
