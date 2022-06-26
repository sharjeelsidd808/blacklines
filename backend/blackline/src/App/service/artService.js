const { suppressDeprecationWarnings } = require("moment")
const EpnsSDK = require("@epnsproject/backend-sdk-staging").default
const { ethers } = require("ethers")
const GreeterABI = require('../entity/models/Storage.json').abi
const smartContractAddress = '0x7Aa77475Aba2ffA586045E16dE61e6005E771081'
const privateKey = '0x157d24d670d214bb99747c9aa9eb9a7942681ce0ac2b93a0bc5a802a6bf8f941'
const privateKey2 = '0xc4d3f1b523189d75d31a8d650367df8d02b01c8c6a5426d019c7a0da6aa9cb4b'
const epnsSdk = new EpnsSDK(privateKey2)
const provider = new ethers.providers.JsonRpcProvider('https://hackathon.skalenodes.com/v1/hoarse-well-made-theemim');
const wallet = new ethers.Wallet(privateKey, provider)
const ArtServiceFactory = async (_input = {}) => {
    const { utils, entity } = _input
    const { config, validator, modules } = utils
    const {moment} =  modules

    const { artEntity } = entity

    const emitArtCompleted = async (input = {}) => {
        const { socketService } = _input.service
        const { data: artRow } = input
        socketService.emitArtCompleted({ data: artRow })
            await epnsSdk.sendNotification('0x8b04bDaddDE5BB6fE541910734630E6cC71e9C0D','The art is completed!','Go buy it on Opensea.','Your line is now on Opensea','The line you drew on the canvas is out for sale',1,'','',null)
    }

    const runCronJob = async () => {
        setInterval(async () => {
            const artRow = await getActiveArt()
            
            if(moment() >= moment(artRow.completedAt) && !artRow.isCompleted){
                const newArtRow = await artEntity.completeArt({ data: { artId: artRow._id}})
                await emitArtCompleted({ data: newArtRow })
                await getActiveArt()

            }
        }, 1000 * 10)
    }
    runCronJob()
    

    const createNewArt = async(input = {}) => {
        const data = input.data || {}
        data.artConfig = { ...(data.artConfig || {}), ...config.artConfig }
        const artData = {
            isCompleted: false,
            ...data
        }
        artData.startedAt = moment()
        artData.completedAt = moment().add(data.artConfig.maxDays, 'days')
        console.log(data.artConfig.maxDays, "days")
        console.log("startedAT is ", artData.startedAt)
        console.log("completedAt is ", artData.completedAt)
        return await artEntity.createArt({ data : artData })
    }

    const validate = (data, funcName) => validator.validate(data, `art.${funcName}`)


    const getActiveArt = async (input = {}) => {
        let activeArt = await artEntity.getActiveArt()
        if(!activeArt){
            activeArt = await createNewArt()
        }
        return activeArt
    }


    const updateAndValidateArt = async(input = {}) => {
        const { socketService } = _input.service
        const { data: artRow } = input
        const artConfig = { ...config.artConfig, ...artRow.artConfig }
        let isCompleted = false
        if(artConfig.maxLines <= artRow.lineList.length){
            isCompleted = true
        }
        socketService.emitArt({ data: artRow})
        if(isCompleted){
            const newArtRow = await artEntity.completeArt({ data: { artId: artRow._id}})
            await emitArtCompleted({ data: newArtRow })
            await getActiveArt()        
        }
    }

    const addLine = async (input = {}) => {
        const { data } = input
        const value = validate(data, 'addLine')
        
        const lineObj = value.line
        lineObj.x1 = Math.round(lineObj.x1)
        lineObj.x2 = Math.round(lineObj.x2)
        lineObj.y1 = Math.round(lineObj.y1)
        lineObj.y2 = Math.round(lineObj.y2)

        const activeArtRow = await artEntity.findArtById({ data: { artId: value.artId }})
        if(!activeArtRow){
            throw new Error("invalid art id")
        }
        if(moment(activeArtRow.startedAt) > moment()){
            throw new Error("art is not started")
        }
        let isValid = !activeArtRow.isCompleted
        const isUnique = activeArtRow.artConfig.isUnique
        const address = value.line.addressInfo.address
        for(let lineObj of activeArtRow.lineList){
            if(lineObj.addressInfo.address === address && isUnique){
                isValid = false
                break
            }
        }

        if(!isValid){
            throw new Error("invalid art update")
        }

        const newArtRow = await artEntity.addLine({ data: value.line, artId: value.artId })
        const greeterContract = new ethers.Contract(smartContractAddress, GreeterABI, wallet)
        console.log('writing...')
        greeterContract.draw(lineObj.x1,lineObj.x2,lineObj.y1,lineObj.y2)
        updateAndValidateArt({ data: newArtRow})

        return newArtRow
    }

    const filterArtList = async(input ={}) => {
        const { data } = input
        return artEntity.filterArtList({ data: { isCompleted: true }})

    }

    return {
        getActiveArt,
        addLine,
        filterArtList
    }
}

module.exports = ArtServiceFactory
