import express from 'express'
import user from './user'
import upload from './upload'
import staffData from './staffData'

const router = express.Router()

router.use('/user', user)
router.use('/upload', upload)
router.use('/staffData', staffData)

export default router
