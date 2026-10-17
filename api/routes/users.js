import express from 'express'
import { getUser, updateUser, getSuggestions } from '../controllers/user.js'

const router = express.Router()

router.get('/find/:userId', getUser)
router.get('/suggestions', getSuggestions)
router.put('/', updateUser)

export default router;