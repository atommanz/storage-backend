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
        const body = req.body
        body.status = 'A'
        const prodcutId = await productService.create(body)
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

//  total price
router.post('/price', async (req, res, next) => {
    try {
        const body = req.body
        const totalPrice = await productService.getPrice(body)
        return res.status(200).send({ success: true, data: totalPrice })
    }
    catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

export default router

