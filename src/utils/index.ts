interface TreeData {
	name: string
	value: any
	children?: TreeData[]
}

interface JsonData {
	[key: string]: any
}

function readJsonFile(file: File, callback: (data: any) => void) {
	const chunkSize = 1024 * 1024
	let offset = 0

	const reader = new FileReader()

	reader.onload = event => {
		const result = event.target?.result

		if (typeof result === 'string') {
			const data = JSON.parse(result)
			callback(data)
			offset += result.length

			if (offset < file.size) {
				readChunk()
			}
		}
	}

	function readChunk() {
		const blob = file.slice(offset, offset + chunkSize)
		reader.readAsText(blob)
	}

	readChunk()
}

function transformJsonData(data: JsonData): TreeData {
	const keys = Object.keys(data)

	const children: TreeData[] = []

	for (const key of keys) {
		const value = data[key]
		const child: TreeData = { name: key, value }

		if (Array.isArray(value)) {
			child.children = value.map((item: any) => {
				if (typeof item === 'object' && item !== null) {
					return transformJsonData(item)
				} else {
					return { name: '', value: item }
				}
			})
		} else if (typeof value === 'object' && value !== null) {
			if (value.hasOwnProperty(key)) {
				child.children = [transformJsonData(value[key])]
			}
		}

		children.push(child)
	}

	return { name: '', value: '', children }
}

export { readJsonFile, transformJsonData }
