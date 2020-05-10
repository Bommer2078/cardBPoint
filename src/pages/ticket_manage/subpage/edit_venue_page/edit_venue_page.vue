<template>
	<div class="edit-ticket">
		<select-venue :init-data="venueArr" />
		<preview :init-data="venueArr"/>
	</div>
</template>

<script>
import selectVenue from './components/select_venue.vue'
import preview from './components/preview.vue'
export default {
	data () {
		return {
			venueArr: []
		}
	},
	created () {
		this.$EventBus.$on('getVenueArr', this.getVenueArr)
	},
	destroyed () {
		this.$EventBus.$off('getVenueArr')
	},
	components: {
		selectVenue,
		preview
	},
	methods: {
		getVenueArr (val) {
			if (val) {
				val.forEach((item) => {
					this.venueArr.push({
						editPrice: item.price / 100,
						venue_id : item.venue_id,
						text     : item.name
					})
				})
			}
		}
	}
}
</script>

<style scoped lang="less">
.edit-ticket {
    padding: 20px;
	box-sizing: border-box;
	min-height: calc(100vh - 160px) !important;
	margin-bottom: 60px;
    .form-container {
        color: #353535;
        .form-title {
            position: relative;
            font-size: 16px;
            font-weight: 700;
            padding-left: 10px;
            margin-bottom: 20px;
            &::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 0px;
                width: 2px;
                height: 14px;
                background: #2A75ED;
            }
        }
        .form-item {
            margin-left: 10px;
            margin-bottom: 30px;
            .form-label {
                display: inline-block;
                width: 110px;
                font-size: 14px;
			}
			.redStar {
				margin-left: 4px;
				width: 7px;
				height: 20px;
				position: relative;
				color: #e64340;
			}
            .form-content {
                display: inline-block;
            }
            .align-top {
                vertical-align: top;
                margin-top: 12px;
            }
        }
    }
    input {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
    }
}
.cover-img-box {
  width:200px;
  height:112px;
  background:rgba(247,248,249,1);
  margin-right: 20px;
  img {
    width:200px;
    height:112px;
  }
}

.cover-img-box,
.cover-img-option {
  display: inline-block;
  vertical-align: top;
  position: relative;
}

.img-btn {
  width:100px;
  height:36px;
  background:rgba(250,251,252,1);
  border-radius:2px;
  border:1px solid rgba(229,231,235,1);
}

.img-btn:focus {
  outline: none;
}

.img-explain {
  width:230px;
  height:44px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(136,136,136,1);
  line-height:22px;
}

.cover-img-defalut {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 24px !important;
  height: 24px !important;
}
.file-img {
  display: block;
  width: 100px;
  height: 36px;
  font-size: 0;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  opacity: 0;
}

    .form-input, .form-input-mini {
        width:240px;
        height:36px;
        padding-left: 10px;
        font-size: 14px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
	}
	.form-input-mini {
        width:60px;
        height:36px;
	}
</style>
