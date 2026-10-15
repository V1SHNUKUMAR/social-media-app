import jwt from "jsonwebtoken"
import { db } from "../connect.js";

export const getUser = (req, res) => {
    const userId = req.params.userId;
    // const token = req.cookies.token;

    // if(!token) return res.status(401).json('Not logged in!')

    // jwt.verify(token, "secretkey", (err, userInfo) => {
    //     if(err) return res.status(403).json("Token is not valid!")

        const q = "SELECT * FROM users WHERE id = ?"

        db.query(q, [userId], (err, data) => {
            if(err) return res.status(500).json(err)

            const {password, ...userData} = data[0]
            
            return res.status(200).json(userData)
        })
    // })

}



export const updateUser = (req, res) => {
    const userId = req.params.userId;
    const token = req.cookies.token;

    if(!token) return res.status(401).json('Not logged in!')

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id = ?"

        const values = [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id
        ]

        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err)
            if(data.affectedRows > 0) return res.status(200).json("Profile updated successfully!")
                return res.status(403).json('You can update only your profile!')
            
        })
    })

}