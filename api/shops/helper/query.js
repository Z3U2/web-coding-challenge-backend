exports.checkQuery = async (req,res,next) => {
    // latitude verification
    if (!req.query.lat) return res.status(400).json({
        status: 400,
        message: 'Missing lat'
    })
    else {
        let lat = req.query.lat
        let parsedLat = parseFloat(lat)
        if (lat != parsedLat || parsedLat > 90 || parsedLat <-90) return res
            .status(400)
            .json({
                status: 400,
                message: 'lat should be a number between -90 and 90'
            })
        else req.query.lat = parsedLat          
    }
    // longitude verification
    if (!req.query.lng) return res.status(400).json({
        status: 400,
        message: 'Missing lng'
    })
    else {
        let lng = req.query.lng
        let parsedlng = parseFloat(lng)
        if (lng != parsedlng || parsedlng > 180 || parsedlng < -180) return res
            .status(400)
            .json({
                status: 400,
                message: 'lng should be a number between -180 and 180'
            })
        else req.query.lng = parsedlng
    }
    // Unknown key ?
    let keys = Object.keys(req.query)
    keys = keys.filter(key => (key!='lat' && key!='lng'))
    if(keys[0]) return res.status(400).json({
        status: 400,
        message: `Unknown query parameter : ${keys[0]}`
    })
    next()
}