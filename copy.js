const prms = require('./utils/prms')
const readFile = require('./utils/readFile')
const writeFile = require('./utils/writeFile')

const glob = prms(require('glob'))
const { parse: parsePath } = require('path')
const minifyJSON = require('node-json-minify')


const processFiles = (files) => {

	// Pass through the array of files
	files.forEach(file => {
		const { dir, base, ext } = parsePath(file)

		readFile(file)
			.then(buffer => {
				if (ext === '.json') {
					buffer = minifyJSON(buffer.toString())
				}
				writeFile(`./${dir.replace('data', 'build')}/${base}`, buffer)
					.then(console.log)
					.catch(console.error)

			})
			.catch(console.error)
	})
}

glob('data/{videos,.}/*.{mp4,json}')
	.then(processFiles)
	.catch(console.error)
