import express from 'express'
import fetch from 'node-fetch'
import StaffData from '../../services/staffData'

const router = express.Router()

router.get('/', async (req, res, next) => {
    const staffList = await StaffData.getStaff(req.query.store, req.query.username)
    return res.send({ success: true, data: staffList });

})

router.post('/reset-password', async (req, res, next) => {
    try {
        await StaffData.resetPassword(req.body.store, req.body.username, req.body.createdBy)
        return res.send({ success: true })

    }
    catch (e) {
        return res.stataus(500).send({ success: false })
    }
})

router.post('/unlock', async (req, res, next) => {
    try {
        console.log('unlock')
        // await StaffData.logUnlockfn('at', 'Operator', 'success', '5c667f57501e9ad1749f7ed9')
        await StaffData.Unlock(req.body.store, req.body.username, req.body.createdBy)
        return res.send({ success: true })

    }
    catch (e) {
        return res.stataus(500).send({ success: false })
    }
})


export default router

