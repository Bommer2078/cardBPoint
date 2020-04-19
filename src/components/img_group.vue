<template>
	<div class="img-group">
		<div class="img-cover" v-for="(item,index) in imgListCopy" :key="index">
			<img :src="item" class="img-item" >
			<img src="/static/img/close.svg" class="del-img" @click="delImg(index)">
		</div>
		<div class="img-cover"  v-show="imgListCopy.length < limitNum"  v-loading="loadingImg">
			<img src="/static/img/plus_icon.png" class="img-item">
			<input
				v-if="!loadingImg"
				class="file-img"
				type="file"
				accept="image/png, image/jpeg, image/jpg"
				@change="changeCover($event)">
		</div>

	</div>
</template>

<script>
export default {
	props: {
		limitNum: {
			type   : Number,
			default: 9
		},
		imgList: {
			type: Array,
			default () {
				return []
			}
		}
	},
	computed: {
		imgListCopy: {
			get () {
				return this.imgList
			},
			set (val) {
				console.log(val)
				this.$emit('update:imgList', val)
			}
		}
	},
	methods: {
		changeCover (e) {
			this.uploadImg(e).then((res) => {
				this.imgListCopy.push(res)
				this.$message('上传成功')
			})
		},
		delImg (index) {
			this.imgListCopy.splice(index, 1)
		}
	}
}
</script>

<style lang="less">
	.img-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		width: 510px;
		.img-cover {
			margin-bottom: 20px;
			margin-right: 20px;
			position: relative;
		}
		.img-item {
			width: 150px;
			height: 100px;
			background: #ccc;
		}
		.del-img {
			position: absolute;
			top: -10%;
			right: -8%;
			cursor: pointer;
		}
		.file-img {
			display: block;
			width: 150px;
			height: 100px;
			font-size: 0;
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			opacity: 0;
		}
	}
</style>
