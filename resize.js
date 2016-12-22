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

const sizes = {
	fullhd: [1920],
	desktop: [1600],
	laptop: [1280],
	tablet_l: [1024],
	tablet_p: [768, 1280],
	phone: [480, 800],
	phone_s: [320, 568]
}
const dpis = [1, 2]

const processFiles = (files) => {

	// Pass through the array of files
	files.forEach(file => {
		const { name, ext } = parsePath(file)

		readFile(file)
			.then(buffer => {

				// Pass through the array of sizes
				for (let key in sizes) {
					const [width, height] = sizes[key]

					// Pass through the array of dpis
					dpis.forEach(dpi => {


						// Resize images
						sharp(buffer)
							.resize(width * dpi, height ? height * dpi : null, {
								centreSampling: true
							})
							.toBuffer()
							.then(resized => {

								// Minify images
								imagemin(resized, imageminOptions)
									.then(minifed => {
										writeFile(`./build/images/${name}--${key}@${dpi}${ext}`, minifed)
											.then(console.log)
											.catch(console.error)
									})
									.catch(console.error)

								// Create webp
								imagemin(resized, imageminOptionsWebp)
									.then(minifed => {
										writeFile(`./build/images/${name}--${key}@${dpi}.webp`, minifed)
											.then(console.log)
											.catch(console.error)
									})
									.catch(console.error)
							})
							.catch(console.error)

					})

				}
			})
			.catch(console.error)

	})
}

glob('data/images/**/*.jpg')
	.then(processFiles)
	.catch(console.error)
