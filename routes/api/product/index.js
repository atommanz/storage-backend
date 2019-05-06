import express from 'express'
import fetch from 'node-fetch'
import firebase from 'firebase'

const router = express.Router()

// GET list prodcut
router.get('/', async (req, res, next) => {
    try {
        const db = firebase.firestore()
        let collection;
        const listOut = []
        if (req.query.category) { collection = await db.collection('storage').where("category", "==", req.query.category).get() }
        else { collection = await db.collection('storage').get() }
        collection.docs.map(doc => { console.log(doc.id, " => ", doc.data()) })
        const listProduct = collection.docs.map(
            (val) => {
                const objOut = val.data()
                objOut._id = val.id
                listOut.push(objOut)
            }
        )
        await Promise.all(listProduct)
        return res.status(200).send({ success: true, data: listOut })
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

// GET product by id
router.get('/:productId', async (req, res, next) => {
    try {
        var db = firebase.firestore()
        var docRef = db.collection("storage").doc(req.params.productId)

        const doc = await docRef.get()
        if (doc.data()) {
            return res.status(200).send({ success: true, data: doc.data() })
        }
        else {
            return res.status(404).send({ success: true, data: 'data not found' })
        }
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
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
        return res.status(500).send({ success: false })
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
        return res.status(500).send({ success: false })
    }
})

export default router

