import { uploadImg, isImg } from '@/libs/upload.js'
const upload = {
	data () {
		return {
			loadingImg: false
		}
	},
	methods: {
		uploadImg (ev) {
			return new Promise((resolve, reject) => {
				if (this.loadingImg) {
					this.$message.warning('请等待图片上传完成')
					return resolve(false)
				}
				const imgFile = ev.target.files[0]
				let size = imgFile.size / 1024 / 1024

				if (size > this.size) { // 判断图片上传大小 5M
					this.loadingImg = false
					this.$message.warning(`上传资源限制在${this.size}MB内！`)
					ev.target.value = ''// 清空上传的图片
					return resolve(false)
				}
				if (!isImg(imgFile)) {
					this.loadingImg = false
					this.$message.warning('请上传图片类型的文件哦~')
					ev.target.value = ''// 清空上传的图片
					return resolve(false)
				}
				this.loadingImg = true
				const repeatStr = (str, times) => {
					if (times <= 0) return ''
					let temp = ''

					if (times > 1) {
						let t = times - 1

						temp = str + repeatStr(str, t)
					} else {
						temp = str
					}
					return temp
				}
				const randomStr = Math.floor(Math.random() * 100000000).toString()
				const fileName = `${repeatStr('0', 8 - randomStr.length) + randomStr}`

				uploadImg(
					(result) => {
						this.loadingImg = false
						ev.target.value = ''// 清空上传的图片
						resolve(result.data.source_url)
					},
					(result) => {
						this.loadingImg = false
						ev.target.value = ''// 清空上传的图片
						reject(new Error('errorMsg'))
					},
					(progress) => {
						console.log(progress)
					},
					imgFile,
					fileName
				)
			})
		}
	}
}

export default upload
