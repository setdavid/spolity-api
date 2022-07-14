const express = require('express')
const axios = require('axios')
const querystring = require("node:querystring")
const router = express.Router()
const { HOST_URL, CLIENT_ID, CLIENT_CREDENTIALS_ENCODED, REDIRECT_URI, SCOPE } = require("../constants")

router.get("/", (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPE,
            redirect_uri: REDIRECT_URI,
        }))
})

router.get("/access", (req, res) => {
    const path = `${HOST_URL}/login/access`

    if (req.query.code) {
        res.redirect(`${path}/authorized?code=${req.query.code}`)
    } else {
        res.redirect(`${path}/denied?error=${req.query.error}`)
    }
})

router.get("/access/authorized", (req, res) => {
    let requestOptions = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
            "Authorization": `Basic ${CLIENT_CREDENTIALS_ENCODED}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        params: {
            "grant_type": "authorization_code",
            "code": req.query.code,
            "redirect_uri": REDIRECT_URI
        }
    }

    axios(requestOptions)
        .then(response => {
            let data = response.data
            res.json(data)
        })
        .catch(err => res.json(err))
})

router.get("/access/denied", (req, res) => {
    res.json({
        "code": req.query.code
    })
})

module.exports = router