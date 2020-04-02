<template>
	<div class="search-group">
		<img src="@/assets/images/icon_search.svg">
		<input
			type="text"
			class="search-input"
			:placeholder="placeholder"
			v-model.trim="searchContent"
			@keyup.enter="search">
		<t-button button-type="gray" @clickBtn="search">搜索</t-button>
	</div>
</template>

<script>
import tButton from '@/components/common/t_button.vue'
export default {
	props: {
		placeholder: {
			type    : String,
			required: true
		}
	},
	data () {
		return {
			searchContent: ''
		}
	},
	components: {
		tButton
	},
	methods: {
		search () {
			this.$EventBus.$emit('search', this.searchContent)
		}
	}
}
</script>

<style lang="less" scoped>
.search-group {
    position: relative;
    display: flex;
    align-items: center;
    img {
        width: 16px;
        height: 16px;
        position: absolute;
        left: 10px;
    }
    .search-input {
        width:240px;
        height:36px;
        font-size: 14px;
        padding-left: 36px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        margin-right:10px;
    }
}
</style>
