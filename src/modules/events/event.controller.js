import { userService } from "./user.service.js";

export const userController = {
    async create(req, res){
        try{
            const user = await userService.createUser(req.body)
            return res.status(201).json(user)
        }catch(err){
            return res.status(500).json({error: err.message})
        }
    },

    async login(req, res){
        try{
            const user = await userService.loginUser(req.body)
            return res.status(201).json({message: "login succesfull" ,user})
        }catch(err){
            return res.status(500).json({error: err.message})
        }
    },

    
}

