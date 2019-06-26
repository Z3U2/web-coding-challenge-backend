function extractCookies(res) {
    return res.header['set-cookie'].map(cookieString => {
        return cookieString.split('; ').map(cookie => {
            let [key, value] = cookie.split('=')
            return {
                key,
                value
            }
        })
    })
}

module.exports.extractCookies = extractCookies