const config  = {
    // baseUrl: "http://localhost:5000/api",
    baseUrl: "https://blacklineapi.bothook.com/api"
}


const baseApi = axios.create({
    baseURL: config.baseUrl
})

let rootCanvas

const updateArtData = async () => {
    const activeArt = await baseApi.get('/art/active')
    const artData = activeArt.data.data
    rootCanvas.updateArtData(artData)
}

const onNewLine = async (line) => {
    await baseApi.post('/art/line', { artId: rootCanvas.artData._id, line: line})
    await updateArtData()
}

const initialize = async () => {    
    rootCanvas = new CanvasElement()
    rootCanvas.onNewLine = onNewLine
    await updateArtData()
    rootCanvas.initialize()
}
window.onload = () => {
    initialize()
}