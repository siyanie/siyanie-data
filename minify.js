const prms = require('./utils/prms')
const readFile = require('./utils/readFile')
const writeFile = require('./utils/writeFile')

const sharp = require('sharp')
const glob = prms(require('glob'))
const { parse: parsePath } = require('path')
const { buffer: imagemin } = require('imagemin')
const mozjpeg	= require('imagemin-mozjpeg')
const pngquant	= require('imagemin-pngquant')
const webp		= require('imagemin-webp')
const imageminOptions = {
	plugins:
	[
		mozjpeg(),
		pngquant()
	]
}
const imageminOptionsWebp = {
	plugins:
	[
		webp({
			quality: 50
		})
	]
}

const processFiles = (files) => {

	// Pass through the array of files
	files.forEach(file => {
		const { base, name } = parsePath(file)

		readFile(file)
			.then(buffer => {

				// Minify images
				imagemin(buffer, imageminOptions)
					.then(minifed => {
						writeFile(`./build/images/${base}`, minifed)
							.then(console.log)
							.catch(console.error)
					})
					.catch(console.error)

				// Create webp		
				imagemin(buffer, imageminOptionsWebp)
					.then(minifed => {
						writeFile(`./build/images/${name}.webp`, minifed)
							.then(console.log)
							.catch(console.error)
					})
					.catch(console.error)

			})
			.catch(console.error)

	})
}

glob('data/images/presscenter/*.jpg')
	.then(processFiles)
	.catch(console.error)
