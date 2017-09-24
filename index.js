const gm = require('gm')
const fs = require('fs')
const archiver = require('archiver')
const { promisify } = require('util')
const tmp = require('tmp')
const _writeFile = promisify(fs.writeFile)

const writeFile = async input => {
  if (!Buffer.isBuffer(input)) throw new Error('Only buffers are supported')
  let f = tmp.fileSync({postfix: '.png'})
  await _writeFile(f, input)
  return f
}

const identify = async f => promisify(cb => gm(f).identify(cb))()

module.exports = async input => {
  let f
  if (typeof input === 'string') {
    f = input
  } else {
    f = await writeFile(input)
  }
  let info = await identify(f)
  let geometries = info.Geometry
  let i = 0

  let archive = archiver('zip', {
    zlib: { level: 9 }
  })

  console.error(info)

  while (i < geometries.length) {
    archive.append(
      gm(`${f}[${i}]`).stream('png'),
      { name: `${i}.png`.padStart(10, '0')
      })
    i++
  }
  archive.finalize()

  return archive
}
