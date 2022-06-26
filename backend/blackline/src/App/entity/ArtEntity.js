const BotEntityFactory = async (_input = {}) => {
    const { models } = _input
    const { ArtModel } = models
    return {
        getActiveArt: async(input = {}) => {
            return ArtModel.findOne({ isCompleted: false }).lean()
        },
        createArt: async(input = {}) => {
            const { data } = input
            const artRow = new ArtModel(data)
            return artRow.save()
        },
        addLine: async(input ={}) => {
            const { data, artId } = input
            const setQuery = {
                $push: { lineList: data }
            }
            return ArtModel.findOneAndUpdate({ _id: artId }, setQuery, { new: true}).lean()
        },
        findArtById: async(input = {}) => {
            const { data } = input
            const { artId } = data
            return ArtModel.findOne({ _id: artId }).lean()
        },
        completeArt: async(input = {}) => {
            const { data } = input
            const { artId } = data
            return ArtModel.findOneAndUpdate({  _id: artId }, { $set: { isCompleted: true, completedAt: new Date()}} , { new : true})
        },
        filterArtList: async(input = {}) => {
            const { data } = input
            const query = {}
            if(typeof data.isCompleted === "boolean")
                query.isCompleted = data.isCompleted

            return ArtModel.find(query).sort({ _id: -1}).lean()
        }
    }
}

module.exports = BotEntityFactory
