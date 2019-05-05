import express from 'express'
import fetch from 'node-fetch'
import User from '../../services/user'

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('coming a')
    return res.send({ success: true, data: 'users' });

})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const data = await fetch('https://api.indexlivingmall.com/authenticator/authenticate', {
            method: 'POST',
            body: `username=${username}&password=${password}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        const dataJson = await data.json()
        if (!dataJson.success) { return res.status(401).send({ success: false, data: dataJson.message }) }
        return res.send({ success: true, data: dataJson.user })
    } catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

router.post('/verify', async (req, res, next) => {
    try {
      const outUser = await User.getUser(req.body.username)
      // const dataSend = ''
      if (!outUser[0]) {
        return res.send({ success: false, data: outUser[0] })
      }
      return res.send({ success: true, data: outUser[0] })
    } catch (e) {
      console.log(e)
      return res.stataus(500).send({ success: false })
    }
  })

export default router
