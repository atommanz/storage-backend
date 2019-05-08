import express from 'express'
import fetch from 'node-fetch'
import firebase from 'firebase'
import moment from 'moment'
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

// GET product detail by id
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

// create product
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

// checkout product
router.put('/checkout', async (req, res, next) => {
    try {
        const dataCheckout = await productService.checkout(
            req.body._id,
            req.body.endDate,
            req.body.totalPrice
        )
        return res.send({ success: true, data: dataCheckout })
    } catch (e) {
        console.log(e)
        return res.status(500).send({ success: false })
    }
})

// get total price
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

