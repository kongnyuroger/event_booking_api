import { userService } from "./user.service.js";

export const userController = {
  async create(req, res) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(user);
    } catch (err) {
        if(err.message.includes('User already') ||
            err.message.includes('Require') ||
            err.message.includes('Password')
    ){
        return res.status(400).json({ error: err.message });
    }
     return res.status(500).json({ error: err.message });
  }},

  async login(req, res) {
    try {
      const user = await userService.login(req.body);
      return res.status(201).json({ message: "login succesfull", user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
