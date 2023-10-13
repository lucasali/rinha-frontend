<template>
	<div>
		<div
			v-if="isObject() || isArray()"
			@click="toggle"
		>
			{{ expanded ? '-' : '+' }} {{ itemName }}
		</div>
		<div v-else>{{ itemName }}: {{ itemValue }}</div>
		<div v-if="expanded">
			<TreeItem
				v-for="(child, index) in itemChildren"
				:key="index"
				:item="child"
				:itemName="index"
				:itemValue="getChildValue(child)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { transformJsonData } from '../utils'

	interface Item {
		name: string
		value: any
		children?: Item[]
	}

	interface Props {
		item: Item
		itemName: string
		itemValue: string | number | boolean | any[]
	}

	const props = defineProps<Props>()

	const expanded = ref(false)

	function toggle() {
		expanded.value = !expanded.value
	}

	function isObject() {
		return typeof props.item.value === 'object' && props.item.value !== null
	}

	function isArray() {
		return Array.isArray(props.itemValue)
	}

	function itemChildren() {
		if (Array.isArray(props.itemValue)) {
      return props.itemValue.map((value: any, index: number) => ({
        name: index.toString(),
        value
      }));
    }

		if (typeof props.itemValue !== 'object' || props.itemValue === null) {
			return []
		}

		return Object.entries(props.itemValue).map(([key, value]) => {
			const child: Item = { name: key, value }

			if (typeof value === 'object' && value !== null) {
				child.children = [transformJsonData(value)]
			}

			return child
		})
	}
  
  function getChildValue(child: any): string {
    if (typeof child === 'object' && child !== null && 'value' in child) {
      return child.value;
    } else {
      return '';
    }
  }
</script>
