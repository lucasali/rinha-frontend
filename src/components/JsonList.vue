<template>
	<input
		type="file"
		accept="application/json"
		@change="onChange"
	/>

	<TreeItem
		:item="treeData"
		:itemName="treeData.name"
		:itemValue="treeData.value"
	/>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import TreeItem from './TreeItem.vue'
	import { readJsonFile, transformJsonData } from '../utils'

	interface TreeData {
		name: string
		value: any
		children?: TreeData[]
	}

	const treeData = ref<TreeData>({ name: '', value: '', children: [] })

	function onChange(event: Event) {
		const inputElement = event.target as HTMLInputElement
		const file = inputElement.files?.[0]

		if (!file) {
			return
		}

		readJsonFile(file, data => {
			const transformedData = transformJsonData(data)

			treeData.value = transformedData
		})
	}
</script>

<style scoped>
	.json-list strong {
		color: green;
	}
</style>
