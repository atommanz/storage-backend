import express from 'express'
import fetch from 'node-fetch'
import firebase from 'firebase'
import productService from '../../services/product'

const router = express.Router()

// GET list prodcut
router.get('/', async (req, res, next) => {
    try {
        const listProduct = await productService.findAll(req.query.category,req.query.status)
        return res.status(200).send({ success: true, data: listProduct })
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

// GET product by id
router.get('/:productId', async (req, res, next) => {
    try {
        const product = await productService.findOne(req.params.productId)
        return res.status(200).send({ success: true, data: product })
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

router.post('/', async (req, res, next) => {
    try {
        const prodcutId = await productService.create(req.body)
        return res.send({ success: true, data: prodcutId })
    } catch (e) {
        console.log(e)
        return res.status(500).send({ success: false })
    }
})

router.put('/checkout', async (req, res, next) => {
    try {
        const ddd = await productService.checkout('dH3RxhGOJwh4Jvu5SBMw')
        return res.send({ success: true, data: ddd })
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

