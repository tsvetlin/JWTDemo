import jwt from 'jsonwebtoken'
import Boom from 'boom'
import { config } from "../../config/config"

export async function authenticateAdmin(adminData) {
    if(!adminData || !adminData.adminName || !adminData.password){
        throw Boom.badRequest('Missing credentials')
    }
    const { adminName, password} = adminData
    if(adminName === config.username && password === config.password){
        const token = jwt.sign({
            adminName,
            password
        }, config.secret, { expiresIn: 86400})

        console.log('token', token)
        return {
            adminName,
            password,
            token,
        }
    }

}
