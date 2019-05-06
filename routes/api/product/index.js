import express from 'express'
import fetch from 'node-fetch'
import firebase from 'firebase'
import User from '../../services/user'

const router = express.Router()

// GET list prodcut
router.get('/', async (req, res, next) => {
    try {
        const db = firebase.firestore()
        const collection = await db.collection('storage').get()
        collection.docs.map(doc => { console.log(doc.id, " => ", doc.data()) })
        const listProduct = collection.docs.map(val => val.data())
        await Promise.all(listProduct)
        return res.status(200).send({ success: true, data: listProduct })
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

// GET product by doc
router.get('/', function (req, res, next) {
    console.log('coming a')
    var db = firebase.firestore()
    var docRef = db.collection("storage").doc("test")

    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
    return res.status(200).send({ success: true, data: 'users' });

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

