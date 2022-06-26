const RouteFactory = async (input = { }) => {
    const { app, utils } = input
    const { logger, modules } = utils
    const { express } = modules
    const { service } = app

    const { statusService, artService } = service
    const privateApiRouteList = []


    const serviceWrapper = (method) => async (req, res) => {
        try {
            const result = await method({
                data  : { ...req.body, ...req.params },
                locals: res.locals
            })
            res.json({ status: true, data: result })
        } catch (error) {
            logger.error('apiError', error)
            res.status(400).json({
                status: false,
                error : {
                    message: error.message,
                    code   : error.code
                }
            })
        }
    }

    const privateApiAuthWrapper = async (req, res, next) => {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                throw new Error('Authorization header is missing')
            }
            // const authList = authorizationHeader.split(' ')
            // if (authList.length !== 2 || authList[0] !== 'Bearer') {
            //     throw new Error('invalid auth token')
            // }
            // const authResult = await app.useCase.auth.validateAccessToken({
            //     accessToken: authList[1]
            // })
            // res.locals = authResult
        } catch (error) {
            res.status(401).json({
                status: false,
                error : {
                    message: error.message,
                    code   : error.code
                }
            })
            return
        }
        next()
    }

    const publicRoute = {
        routes: [{
            path  : '/status',
            type  : 'get',
            method: statusService.getStatus
        }]
    }

    const artRoute = {
        path: "/api/art",
        routes: [{
            path: '/active',
            type: 'get',
            method: artService.getActiveArt
        },
        {
            path: '/line/:artId',
            type: 'post',
            method: artService.addLine
        },
        {
            path: '/line',
            type: 'post',
            method: artService.addLine
        },
        {
            path:'/list',
            type: 'post',
            method: artService.filterArtList
        }
    ]
    }

    const privateApiRoute = {
        path  : '/api',
        routes: privateApiRouteList,
        method: privateApiAuthWrapper
    }

    const rootRoutes = [publicRoute, privateApiRoute, artRoute]


    const api = express()
    for (const rootRoute of rootRoutes) {
        const basePath = rootRoute.path || ''
        const baseMethod = rootRoute.method
        for (const route of rootRoute.routes) {
            const path = `${basePath}${route.path}`
            if (baseMethod) {
                api[route.type](path, baseMethod, serviceWrapper(route.method))
            } else {
                api[route.type](path, serviceWrapper(route.method))
            }
        }
    }
    return api
}

module.exports = RouteFactory
