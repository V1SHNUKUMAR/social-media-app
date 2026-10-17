import express from 'express'
import {} from '../controllers/user.js'
import { getPosts, addPost, deletePost } from '../controllers/post.js';

const router = express.Router()

router.get('/', getPosts)
router.post('/', addPost)
router.delete('/:id', deletePost)

export default router;