<template>
	<div class="edit-ticket">
		<edit-info-page v-show="page === 1" ref="infoObj"></edit-info-page>
		<edit-venue-page v-show="page === 2" ref="venObj"></edit-venue-page>
		<div class="footer-btns">
			<div class="btn-group">
				<t-button button-type="gray" @clickBtn="changeStep(2)">{{page === 1 ? '取消' : '上一步'}}</t-button>
				<t-button @clickBtn="preChangeStep">{{page === 1 ? '下一步' : '保存'}}</t-button>
			</div>
		</div>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
import editInfoPage from './subpage/edit_info_page/edit_info_page.vue'
import editVenuePage from './subpage/edit_venue_page/edit_venue_page.vue'
export default {
	data () {
		return {
			editId      : '',
			infoObj     : null,
			venObj      : null,
			postVenueAll: null
		}
	},
	components: {
		tButton,
		editInfoPage,
		editVenuePage
	},
	computed: {
		page () {
			return this.$route.query.page ? Number(this.$route.query.page) : 1
		}
	},
	created () {
		this.editId = this.$route.query.editId ? this.$route.query.editId : ''
		this.$router.replace({
			path : this.$route.path,
			query: {page: 1, editId: this.editId}
		})
		this.$EventBus.$on('saveAllVenueBack', this.processVenueData)
	},
	destroyed () {
		this.$EventBus.$off('saveAllVenueBack')
	},
	methods: {
		preChangeStep () {
			if (this.page === 1) {
				let temp = this.$refs.infoObj
				let obj = JSON.parse(JSON.stringify(temp.saveTicket()))

				if (!obj) return
				this.infoObj = obj
			}
			if (this.page === 2) {
				this.$EventBus.$emit('saveAllVenue')
				return
			}
			this.changeStep(1)
		},
		changeStep (val) {
			if (this.page === val) {
				let tempUrl = this.$route.path
				let query = {
					page: val === 1 ? 2 : 1
				}

				if (this.editId) query.editId = this.editId
				this.$router.replace({
					path: tempUrl,
					query
				})
			} else {
				this.$router.replace({path: '/ticketManage'})
			}
		},
		processVenueData (arr) {
			let postArr = arr.map((item) => {
				let tempObj = {
					price   : item.editPrice * 100,
					venue_id: item.venue_id,
					id      : item.id
				}

				return tempObj
			})

			this.postVenueAll = postArr
			this.saveTicket()
		},
		saveTicket () {
			let params = {
				...this.infoObj,
				venue_arr: this.postVenueAll,
				id       : this.editId
			}

			this.$http.post(this.$api.saveTicket, params).then(({data:{code, data, msg}}) => {
				if (code === 0) {
					this.$message.success('保存成功')
					this.changeStep(1)
				} else {
					this.$message.error(msg)
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
	.footer-btns {
        position: fixed;
        display: flex;
        align-items: center;
        width: calc(100vw - 160px);
        height: 60px;
        bottom: 0;
        left: 160px;
        background: #fff;
        border-top: 1px solid #eee;
        z-index: 999;
        .btn-group {
            margin: 0 auto;
            .t-button {
                margin-right: 20px;
            }
        }
    }
</style>
