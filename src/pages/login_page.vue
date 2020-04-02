<template>
	<div class="login-page">
		<div class="title">
			<h3>管理台登录</h3>
		</div>
		<div class="tip">权益卡小程序后台管理系统</div>
		<div class="login-box">
			<div class="box-title">立即登录</div>
			<input type="text" v-model.trim="accountNum" placeholder="账号">
			<input type="password" v-model.trim="password" @keydown.enter="handleLogin" placeholder="密码">
			<button class="login-btn" @click="handleLogin">登录</button>
		</div>
		<footer class="footer-tip">—— 权益卡系统 ——</footer>
	</div>
</template>

<script>
export default {
	data () {
		return {
			accountNum : '',
			password   : '',
			forbidClick: false
		}
	},
	methods: {
		handleLogin () {
			if (this.forbidClick) {
				return
			}
			if (!this.checkInput()) {
				return
			}
			this.forbidClick = true
			const params = {
				name    : this.accountNum,
				password: this.password
			}

			this.$http.post(this.$api.loginTo, params).then(
				(res) => {
					if (res.data.code === 0) {
						let now = new Date().getTime()

						localStorage.setItem('Authorization', res.data.data.token)
						localStorage.setItem('loginTime', now)
						sessionStorage.setItem('currentTreeKey', '')
						this.$message('登录成功')
						this.$router.push('/')
					} else {
						this.$message.error(res.data.message)
					}
				}
			).finally(() => {
				setTimeout(() => {
					this.forbidClick = false
				}, 3000)
			})
		},
		checkInput () {
			if (this.accountNum === '') {
				this.$message.error('账号不能为空')
				return false
			}
			if (this.password === '') {
				this.$message.error('密码不能为空')
				return false
			}
			return true
		}
	}
}
</script>

<style lang="less" scoped>
.login-page{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: calc(100vh - 56px);
	color: #353535;
	padding-top: 56px;
	background: #F5F7FA;
	.title {
		display: flex;
		flex-direction: row;
		margin-bottom: 15px;
		h3 {
			font-size: 24px;
			font-weight: 700;
			margin: 0;
		}
	}
	.tip {
		font-size: 16px;
		color: #666666;
		margin-bottom: 40px;
	}
	.login-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width:400px;
		height:300px;
		padding-top: 30px;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 4px 0px rgba(0,0,0,0.05),0px 6px 12px 0px rgba(0,0,0,0.06);
		.box-title {
			font-size: 16px;
			margin-bottom: 30px;
		}
		input {
			width: 260px;
			border: none;
            font-size: 14px;
			line-height: 30px;
			padding-left: 20px;
			padding-right: 20px;
			margin-bottom: 20px;
			border-bottom: 1px solid #eee;
		}
		.login-btn {
			width: 300px;
			height: 56px;
			line-height: 56px;
			font-size: 16px;
			text-align: center;
			border-radius: 4px;
			cursor: pointer;
			color: #fff;
			margin-top: 20px;
			background-color: #105cfb;
			outline: none;
			transition: all 100ms ease;
			&:hover {
				background-color: #136ffe;
			}
		}
	}
	.footer-tip {
		position: fixed;
		bottom: 10px;
		font-size: 14px;
		color: #B2B2B2;
	}
}
</style>
