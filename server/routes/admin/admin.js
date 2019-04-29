import Router from 'express-promise-router'

import { authenticateAdmin } from '../../services/admin/adminService'

const router = Router()

router.get('/', async (req, res, next) => {
    res.render('admin/index', {})
})

router.get('/login', async (req, res, next) => {
    res.render('admin/index', {})
})

router.post('/login', async (req, res, next) => {
    const data = req.body

    console.log('asd', req.body)
    let viewParams = {}
    if (!data.username || !data.password) {
        viewParams.error = true
        res.render('admin/index', viewParams)
    } else {
        const adminData = {
            adminName: data.username.trim(),
            password: data.password.trim()
        }
        const authData = await authenticateAdmin(adminData)
        console.log(authData)
        if (authData) {
            req.session.token = authData.token
            res.redirect('/home')
        } else {
            viewParams.error = true
            res.render('admin/index', viewParams)
        }
    }
})

router.use((req, res, next) => {
    if (req.session.token) {
        next()
    } else {
        res.redirect('/login')
    }
})

router.get('/logout', async (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
})

router.get('/home', async (req, res, next) => {
    res.render('admin/home', {})
})

export default router
