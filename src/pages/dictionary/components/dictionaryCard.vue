<template>
	<div class="dictionary-card" :class="{'active' : currentId === dictionaryObj.id}">
		{{dictionaryObj.name}}
	</div>
</template>

<script>
export default {
	props: {
		dictionaryObj: {
			type    : Object,
			required: true
		},
		currentId: {
			type    : [ String, Number ],
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
* {
    box-sizing: border-box;
}
.dictionary-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 235px;
    height: 80px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    transition: .2s all ease;
    cursor: pointer;
    position: relative;
    padding: 20px;
    margin-left: 0!important;
    &:hover {
        box-shadow: 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12), 0 3px 5px -1px rgba(0,0,0,.11);
    }
    img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .card-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .name {
            font-size: 14px;
            color: #353535;
            margin-bottom: 5px;
        }
        .info {
            font-size: 12px;
            color: #888;
        }
    }
}
.active {
    background: rgb(107, 159, 202);
    box-shadow: 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12), 0 3px 5px -1px rgba(0,0,0,.11);
}
</style>
