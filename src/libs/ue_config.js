// 默认编辑器
export const defaultConfig = {
	toolbars: [
		[
			'undo', 'redo', '|',
			'fontsize', 'forecolor', 'bold', 'italic', 'underline', '|',
			'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'lineheight', '|',
			'directionalityltr', 'directionalityrtl', 'indent', '|',
			'simpleupload', 'insertframe', 'emotion', '|',
			'backcolor', 'autotypeset',
			'link', 'spechars', 'source', '|',
			'searchreplace', '|',
			'fullscreen' // 全屏
		]
	],
	initialFrameWidth : 700,
	initialFrameHeight: 320,
	autoHeightEnabled : false
}

// 小型编辑器
export const litteConfig = {
	toolbars: [
		[
			'undo', 'redo', '|',
			'fontsize', 'forecolor', 'bold', 'italic', 'underline', '|',
			'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'lineheight', '|',
			'directionalityltr', 'directionalityrtl', 'indent', '|',
			'simpleupload', 'insertframe', 'emotion', '|',
			'backcolor', 'autotypeset',
			'link', 'spechars', 'source', '|',
			'searchreplace', '|',
			'fullscreen'
		]
	],
	initialFrameWidth : 640,
	initialFrameHeight: 320,
	autoHeightEnabled : false,
	serverUrl         : 'http://hugo.lingqi100.cn/upload',
	UEDITOR_HOME_URL  : '/static/UEditor/'
}
/*  */
