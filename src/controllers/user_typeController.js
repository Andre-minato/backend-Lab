import UserTypeRepository from "../models/user_types.js";

class UserTypeController{
    async create(req, res){
        const dados = req.body
        const userType = await UserTypeRepository.create(dados)
        res.status(200).json(userType)
       
    }
    async findAll(req, res){
        try {
            const users = await UserTypeRepository.findAll();
            res.status(200).json(users);
        } catch (err){
            res.status(400).json({mensagem: "Não existe usuário"});
        }
    }
}
export default new UserTypeController();