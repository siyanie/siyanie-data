const prms = require('./utils/prms')
const glob = prms(require('glob'))
const fs = require('fs')
const rename = prms(fs.rename)
const PATH = require('path')

glob('./data/images/newprojects/*')
	.then(dirs => {
		dirs.forEach(dir => {
			glob(`${dir}/*.{jpg,JPG}`)
				.then(paths => {
					paths
						.filter(path => !/_(big|mid|sm)\.jpg$/.test(path))
						.forEach((path, index) => {
							const pathO = PATH.parse(path)
							const id = pathO.dir.match(/\w+$/)[0]
							rename(
								path,
								`${pathO.dir}/project_${id}_big_${index + 2}.jpg`,
								console.log
							)
						})
					paths
						.filter(path => /_(big|mid|sm)\.jpg$/.test(path))
						.forEach((path, index) => {
							const pathO = PATH.parse(path)
							rename(
								path,
								`${pathO.dir}/project_${pathO.name}.jpg`,
								console.log
							)
						})
				})
		})
	})

glob(`./data/images/newpresscenter/*.jpg`)
	.then(paths => {
		paths
			.forEach((path, index) => {
				const pathO = PATH.parse(path)
				rename(
					path,
					`${pathO.dir}/doc_${pathO.name}.jpg`,
					console.log
				)
			})
	})

glob(`./data/images/media/*.ai`)
	.then(paths => {
		paths = paths
			.map((path, index) => {
				const pathO = PATH.parse(path)
				return pathO.name
			})
		console.log(
			JSON.stringify(paths, '', '  ')
		)
	})
