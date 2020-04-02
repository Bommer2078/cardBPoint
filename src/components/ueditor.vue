
<template>
	<div>
		<script :id="id" type="text/plain"></script>
	</div>
</template>
<script>
/**
 * defaultMsg: 编辑时传入的默认信息
 * config： 头部配置项 - 自己配
 * id：id
 * @getUEContent 获取内容函数
 */
export default {
	name: 'UE',
	data () {
		return {
			editor : null,
			emitNum: 0,
			flag   : false
		}
	},
	props: {
		defaultMsg: {
			type: String
		},
		config: {
			type: Object
		},
		id: {
			type: String
		},
		get_ueditor: {
			type: Function
		},
		indexUe: {
			type: Number
		}
	},
	mounted () {
		const _this = this

		this.editor = window.UE.getEditor(this.id, this.config) // 初始化 UE

		this.editor.addListener('ready', function () {
			_this.editor.setContent(_this.defaultMsg) // 确保 UE加载完成后，放入内容。
		})

		this.get_ueditor(this.editor, this.indexUe)
		if (this.falg) {
			this.editor.addListener('contentChange', () => {
				let content

				content = this.getUEContent()
				let describe = this.editor.getPlainTxt()

				console.log(this.myTrim(describe))
				this.emitNum += 1
				this.$emit('getUEContent', content, this.emitNum, describe, this.indexUe)
			})
		}

		this.editor.addListener('blur', () => {
			let content

			content = this.getUEContent()
			let describe = this.editor.getPlainTxt()

			console.log(this.myTrim(describe))
			this.emitNum += 1
			this.$emit('getUEContent', content, this.emitNum, describe, this.indexUe)
		})
	},
	methods: {
		getUEContent () { // 获取内容方法
			return this.editor.getContent()
		},
		myTrim (text) {
			let temp = text.replace(/^\s+|\s+$/gm, '')

			return temp.replace(/[\r\n]/g, '')
		}
	},
	watch: {
		defaultMsg: function () {
			if (this.defaultMsg) {
				this.editor.setContent(this.defaultMsg)
				this.falg = true
				setTimeout(() => {
					this.falg = false
				}, 0)
			}
		}
	},
	destroyed () {
		this.editor.destroy()
	}
}
</script>
