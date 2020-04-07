<template>
	<div class="side-clomun">
		<div class="title-box">权益卡管理</div>
		<template>
			<el-tree
				ref="sideTree"
				:data="clomunArr"
				node-key="nodeKey"
				:default-expanded-keys="[currentTreeKey]"
				:props="defaultProps"
				:highlight-current="true"
				@node-click="handleNodeClick"
				accordion></el-tree>
		</template>
	</div>
</template>
<script>
import sideClomunDate from '../../mixin/side_clomun_arr.js'
export default {
	mixins: [ sideClomunDate ],
	data () {
		return {
			currentTreeKey: ''
		}
	},
	created () {
		this.initCurrentTree()
	},
	methods: {
		/**
         * 单页应用在刷新后仍然保留侧边栏的选中状态
         */
		initCurrentTree () {
			const temp = sessionStorage.getItem('currentTreeKey')

			if (temp) {
				this.$nextTick(() => {
					this.$refs.sideTree.setCurrentKey(temp)
					this.currentTreeKey = temp
				})
			} else {
				this.$nextTick(() => {
					this.$refs.sideTree.setCurrentKey('userManage')
					this.$router.push('/userManage/userList', () => {})
				})
			}
		},
		handleNodeClick (res) {
			sessionStorage.setItem('currentTreeKey', res.nodeKey)
			this.currentTreeKey = res.nodeKey
			if (res.routerLink) {
				this.$router.push(res.routerLink, () => {})
			}
		}
	}
}
</script>

<style lang="less" scoped>
.side-clomun {
	position: fixed;
	left: 0;
	width: 160px;
	height: 100vh;
    background: #38384A;
    z-index: 1000;
	.title-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 73px;
		color: #fff;
		font-size: 16px;
		font-weight: 700;
	}
	.el-tree {
		background: #38384A;
		& /deep/ .el-tree-node__content {
			height: 40px;
			color: #fff;
		}
		& /deep/ .el-tree-node__content:hover {
			background-color: rgb(116, 172, 231);
			color: #eee;
		}
		& /deep/ .el-tree-node:focus>.el-tree-node__content {
			background-color: #2A75ED;
        }
        & /deep/ .is-current>.el-tree-node__content {
            background-color: #2A75ED;
        }
	}
}
</style>
