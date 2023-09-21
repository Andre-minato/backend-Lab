import UserRepository from "../models/users.js";
import bcrypt from "bcrypt"
import UserTypeRepository from "../models/user_types.js";


class UserController{

    async create(req, res){
        const dados = req.body;
        const userTypeId = dados['user_type_id'];
        const userType = await type(userTypeId);
        const passwordEcript = await bcrypt.hash(dados.password, 10);
        dados.password = passwordEcript;
        dados.user_type_id = Number(userType);
        try {
            const addUser = await UserRepository.create(dados);
            res.status(200).json(addUser);
        } catch (err){
            res.status(400).json({mensagem: "Não foi possivel cadastrar usuário"}, err);
        }
        
    }

    async findAll(req, res){
        try {
            const users = await UserRepository.findAll();
            if(users.length === 0){
                res.json({mensagem: "Não tem usuário cadastrado"});
            } else {
                res.status(200).json(users);
            }  
        } catch (err){
            res.status(400).json({mensagem: "Não existe usuário"});
        }
    }

    async findById(req, res){
        const {id} = req.params;
        try {
            const user = await UserRepository.findByPk(id);
            if(user == null){
                res.status(200).json({mensagem: "Usuário não encontrado ou pode estar desativado"});
            } else {
                res.json(user);
            }
        } catch (err) {
            res.status(400).json({mensagem: "Usuário não encontrado!"});
        }
        
    }

    async update(req, res){
        const dados = req.body;
        const id = req.params;
        try {
            await UserRepository.update(dados, {where: id});
            res.status(200).json({ mensagem: "Usuário editado com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Usuário não encontrado!"});
        }
    }


    async deactivate(req, res){
        const { id } = req.params; 
        try{
            await UserRepository.destroy({where: { id }});
            res.status(200).json({mensagem: "Usuário desativado com sucesso com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Usuário não pode ser excluido"});
        }
        
    }

    async activate(req, res){
        const id = req.params;
        try{
            await UserRepository.restore({ where: id});
            res.status(200).json({mensagem: "Usuário ativado com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Não foi possível ativar usuário!"});
        }
    }
}

export default new UserController();

async function type(param) {
    const response = await UserTypeRepository.findAll();
    const user = response.find((user) => user.user_name === param);
    const tipos = user.user_type;
    console.log(tipos);
    return tipos;
}

