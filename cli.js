
if (process.argv.length !== 3) {
  throw new Error('not enough args')
}

let pdf2zip = require('./')

;(async () => {
  let stream = await pdf2zip(process.argv[2])
  stream.pipe(process.stdout)
})()
