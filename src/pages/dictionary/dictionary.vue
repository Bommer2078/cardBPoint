<template>
	<div class="dictionary-manage">
		<table-header></table-header>
		<div class="line"></div>
		<div class="dictionary-container">
			<div v-for="item in dictionaryArr" :key="item.id" @click="changeDictionary(item)">
				<dictionary-card :dictionary-obj="item" :current-id="currentId" ></dictionary-card>
			</div>
		</div>
		<div class="list-container">
			<dictionary-item></dictionary-item>
		</div>
	</div>
</template>

<script>
import tableHeader from './components/table_header.vue'
import dictionaryCard from './components/dictionaryCard.vue'
import dictionaryItem from './dictionaryItem/dictionaryItem.vue'
export default {
	components: {
		tableHeader,
		dictionaryItem,
		dictionaryCard
	},
	data () {
		return {
			dictionaryArr: [],
			currentId    : ''
		}
	},
	created () {
		this.getDictionaryArr()
	},
	methods: {
		changeDictionary (item) {
			if (this.currentId === item.id) {
				return
			}
			let path = this.$route.path

			this.currentId = item.id

			this.$router.replace({
				path,
				query: {
					dictionaryId  : item.id,
					dictionaryName: item.name
				}
			})
		},
		getDictionaryArr () {
			this.$http.get(this.$api.getDictionary)
				.then((res) => {
					if (res.data.code === '0') {
						this.dictionaryArr = res.data.data
						this.changeDictionary(this.dictionaryArr[0])
					}
				})
		}
	}
}
</script>

<style lang="less" scoped>
.dictionary-container {
    display: inline-block;
    width: 235px;
    height: 600px;
    border: 1px solid #eee;
    flex-direction: column;
    padding: 10px;
    margin-left: 20px;
    .dictionary-card {
        margin-bottom: 20px;
    }
}
.line {
    border: 1px solid #eee;
    height: 0;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.list-container {
    display: inline-block;
    width: calc(100% - 305px);
    vertical-align: top;
}
</style>
