const fs = require('fs')
const util = require('util')
const path = require('path')

const readdir = util.promisify(fs.readdir)

const listdir = (folderPath, fileName) => new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            reject(err)
        } else {
            resolve(files.filter((fName) => fName !== fileName))
        }
    })
})

const loadFiles = async (input = {}) => {
    const { folderPath, data, exclude = 'index' } = input
    const files = await readdir(folderPath)
    const moduleList = []
    for (const file of files) {
        const parsedData = path.parse(file)
        if (parsedData.name !== exclude) {
            moduleList.push({ name: parsedData.name, path: path.resolve(folderPath, file) })
        }
    }
    const result = {}
    const promiseArray = moduleList.map((obj) => {
        // eslint-disable-next-line global-require
        const module = require(obj.path)
        return module(data)
    })
    const loadedModules  = await Promise.all(promiseArray)
    for (let index = 0; index < loadedModules.length; index += 1) {
        const loadedModule = loadedModules[index];
        result[moduleList[index].name] = loadedModule
    }
    return result
}

module.exports = {
    listdir,
    loadFiles
}
