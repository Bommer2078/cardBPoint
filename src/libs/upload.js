/* eslint-disable */
import BMF from 'browser-md5-file';
const
	ajax = require('vue-resource'),
	CosCloud = require('cos-js-sdk-v4'),
	base64 = require('js-base64').Base64,
	bmf = new BMF(),
	// bmf.md5 = require('./browser-md5-file.min.js'),
	appid = '1257248340',
	bucket = 'vcard',
	region = 'gz'
let cos = new CosCloud({
	appid     : appid, // APPID 必填参数
	bucket    : bucket, // bucketName 必填参数
	region    : region, // 地域信息 必填参数深圳金融
	getAppSign: function (callback) { // 获取签名 必填参数
		// 1.搭建一个鉴权服务器，自己构造请求参数获取签名，推荐实际线上业务使用，优点是安全性好，不会暴露自己的私钥
		// 拿到签名之后记得调用callback
		ajax.Http({
			url         : '/cos/get_cos_token',
			responseType: 'json'
		}).then(
			function (res) {
				var sig = res.body.data.credentials.sessionToken

				callback(encodeURIComponent(sig))
			},
			function (err) {
				// alert('获取签名失败')
			}
		)
	},
	getAppSignOnce: function (callback) { // 单次签名，必填参数，参考上面的注释即可
		//    //填上获取单次签名的逻辑
		ajax.Http({
			url: '/cos/get_cos_token'
		}).then(
			function (res) {
				var sig = res.body.data.credentials.sessionToken

				callback(encodeURIComponent(sig))
			},
			function (err) {
				alert('获取签名失败')
			}
		)
	}
})

export function getSuffix (name) {
	let suffixIndex = name.lastIndexOf('.')

	if (suffixIndex === -1) {
		return ''
	}
	return name.substring(++suffixIndex)
}

export function isImg (file) {
	let suffix = getSuffix(file.name)

	return [ 'jpg', 'png', 'jpeg', 'gif', 'JPG', 'PNG', 'JPEG', 'GIF' ].indexOf(suffix) !== -1
}

export function isAudio (file) {
	let suffix = getSuffix(file.name)

	return [ 'mp3', 'm4a', 'MP3', 'M4A' ].indexOf(suffix) !== -1
}
export function getObjectURL (file) {
	let url = null

	if (window.createObjectURL !== undefined) { // basic
		url = window.createObjectURL(file)
	} else if (window.URL !== undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file)
	} else if (window.webkitURL !== undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file)
	}
	return url
}

export function removeObjectURL (url) { // 释放资源URL
	if (window.revokeObjectURL !== undefined) {
		window.revokeObjectURL(url)
	} else if (window.URL !== undefined) {
		window.URL.revokeObjectURL(url)
	} else if (window.webkitURL !== undefined) {
		window.webkitURL.revokeObjectURL(url)
	}
}

export function uploadImg (successCallBack, errorCallBack, progressCallBack, file, fileName = '') {
	bmf.md5(file, function (err, md5) {
		// 获取文件后缀
		let filePostfix = getSuffix(file.name)

		if (!fileName) {
			fileName = md5
		} else {
			let encodeStr = base64.encodeURI(fileName)

			fileName = getStrLen(encodeStr) <= 150 ? encodeStr : md5
		}
		// 上传路径
		let remotePath = `/image/${fileName}.${filePostfix}`

		cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, remotePath, file, 0)
	})
}

// 获取字符串字符长度
export function getStrLen (str) {
	let len = 0

	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i)

		if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
			len += 1
		} else {
			len += 2
		}
	}
	return len
}
/**
 * 上传音频文件 分片上传直接调用，内部会判断是否需要分片
 * @param successCallBack 成功回调
 * @param errorCallBack 失败回调
 * @param progressCallBack  进度回调
 * @param file 文件
 * @param app_id
 */
export function uploadAudio (successCallBack, errorCallBack, progressCallBack, file, fileName = '') {
	bmf.md5(file, function (err, md5) {
		// 文件后缀
		let filePostfix = getSuffix(file.name)

		if (!fileName) {
			fileName = md5
		} else {
			let encodeStr = base64.encodeURI(fileName)

			fileName = getStrLen(encodeStr) <= 150 ? encodeStr : md5
		}
		// 上传路径
		let remotePath = `/audio/${fileName}.${filePostfix}`

		console.log('path2audio:', remotePath)
		cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, remotePath, file, 0)
	})
}

export function uploadCsv (successCallBack, errorCallBack, progressCallBack, file, fileName = '') {
	bmf.md5(file, function (err, md5) {
		// 文件后缀
		let filePostfix = getSuffix(file.name)

		if (!fileName) {
			fileName = md5
		} else {
			let encodeStr = base64.encodeURI(fileName)

			fileName = getStrLen(encodeStr) <= 150 ? encodeStr : md5
		}
		// 上传路径
		let remotePath = `/file/${fileName}.${filePostfix}`

		console.log('path2csv:', remotePath)
		cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, remotePath, file, 0)
	})
}

export function uploadFiles (successCallBack, errorCallBack, progressCallBack, file, fileType, fileName = '', md5CallBack) {
	bmf.md5(file, function (err, md5) {
		// 文件后缀
		let filePostfix = getSuffix(file.name)

		if (!fileName) {
			fileName = md5
		} else {
			let encodeStr = base64.encodeURI(fileName)

			fileName = getStrLen(encodeStr) <= 150 ? encodeStr : md5
		}
		// 获取md5
		if (md5CallBack) {
			md5CallBack(md5)
		}
		// 上传路径
		let remotePath = `/${fileType}/${fileName}.${filePostfix}`

		console.log('path2file:', remotePath)
		cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, remotePath, file, 0)
	})
}
