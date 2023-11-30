import UserRepository from "../models/users.js";
import bcrypt from "bcrypt";
import UserTypeRepository from "../models/user_types.js";
import jwt, { decode } from "jsonwebtoken"
import { SECRET_KEY } from "../middlewares/auth.js";
import { funcao } from "../funcoes/funcao.js";

class UserController{
    async create(req, res){
        const dados = req.body;
        const verifyUsers = await UserRepository.findAll();
        const verifyEmail = verifyUsers.find((verifyEmail) => verifyEmail.email === dados.email);
        if(verifyEmail){
            return res.status(404).json({mensagem: "Já existe cadastro para email informado!"})
        }
        const verifyCpfCnpj = verifyUsers.find((verifyCpfCnpj) => verifyCpfCnpj.cpf_cnpj === dados.cpf_cnpj);
        if(verifyCpfCnpj){
            return res.status(404).json({mensagem: "Já existe cadastro para cpf/cnpj informado!"})
        } 
        const userTypeId = dados['user_type_id'];
        const userType = await type(userTypeId);
        const passwordEcript = await bcrypt.hash(dados.password, 10);
        dados.password = passwordEcript;
        dados.user_type_id = Number(userType);
        try {
            const addUser = await UserRepository.create(dados);
            res.status(201).json(addUser);
        } catch (err){
            res.status(400).json({mensagem: "Não foi possivel cadastrar usuário"}, err);
        }
        
    }

    async findAll(req, res){
        try {
            const users = await UserRepository.findAll({paranoid: false});
            if(users.length === 0){
                return res.json({mensagem: "Não tem usuário cadastrado"});
            } else {
                return res.status(200).json(users);
            }  
        } catch (err){
            return res.status(400).json({mensagem: "Não existe usuário"});
        }
    }

    async findById(req, res){
        const {id} = req.params;
        const verifyUserId = await getUserId(id)
        if(verifyUserId === false){
            return res.status(400).json({mensagem: "Não existe usuário!"})
        }
        const authHeader = req.headers['authorization'];
        const tokenId = await getUserIdLogado(authHeader);
        const tokenRole = await getRole(authHeader)
        if(tokenId === (Number(id)) || tokenRole === "admin"){
            try {
                const user = await UserRepository.findByPk(id);
                if(user == null){
                    res.status(200).json({mensagem: "Usuário não encontrado ou pode estar desativado"});
                    return;
                } else {
                    res.json(user);
                    return;
                }
            } catch (err) {
                res.status(400).json({mensagem: "Usuário não encontrado!"});
                return;
            }
        } 
    }

    async update(req, res){
        const { id } = req.params;
        const verifyUserId = await UserRepository.findByPk(id)
        if(!verifyUserId){
            return res.status(400).json({mensagem: "Não existe usuário!"})
        }
        const authHeader = req.headers['authorization'];
        const tokenId = await getUserIdLogado(authHeader);
        const tokenRole = await getRole(authHeader)
        console.log(tokenId)
        const dados = req.body;
        if(tokenId === (Number(id)) || tokenRole === "admin"){
            try {
                await UserRepository.update(dados, {where: { id }});
                return res.status(200).json({ mensagem: "Usuário editado com sucesso!"});
            } catch (err) {
                return res.status(400).json({mensagem: "Usuário não encontrado!"});
            }
        } 
        return res.json({mensagem: "Não autorizado"})
    }


    async disable(req, res){
        const { id } = req.params; 
        const verifyUserId = await getUserId(id)
        if(verifyUserId === false){
            return res.status(400).json({mensagem: "Não existe usuário!"})
        }
        const authHeader = req.headers['authorization'];
        const tokenId = await getUserIdLogado(authHeader);
        const tokenRole = await getRole(authHeader)
        const response = await UserRepository.findByPk(id, {
           where: {
            is_disabled: null 
           }
        })
        if(!response){
            return res.status(400).json({mensagem: "Usuário já está desativado!"})
        }
        if(tokenId === (Number(id)) || tokenRole === "admin"){
            try{
                await UserRepository.destroy({where: { id }});
                return res.status(200).json({mensagem: "Usuário desativado com sucesso com sucesso!"});
            } catch (err) {
                return res.status(400).json({mensagem: "Usuário não pode ser excluido"});
            }    
        } 
        return res.status(401).json({mensagem: "Não autorizado"})   
    }

    async activate(req, res){
        const {id} = req.params;
        const verifyUserId = await getUserId(id)
        if(verifyUserId === false){
            return res.status(400).json({mensagem: "Não existe usuário!"})
        }
        const response = await UserRepository.findByPk(id, {
            where: {
             is_disabled: null 
            }
        })
        if(response){
            return res.status(400).json({mensagem: "Usuário já está ativado!"}) 
        }
        try{
            await UserRepository.restore({ where: {id}});
            return res.status(200).json({mensagem: "Usuário ativado com sucesso!"});
        } catch (err) {
            return res.status(400).json({mensagem: "Não foi possível ativar usuário!"});
        }
    }

    async login(req, res){
        let cod_barras = null;
        const user = await UserRepository.findOne({
            attributes: ['id', 'role', 'name', 'email', 'user_type_id', 'password'],
            where: {
                email: req.body.email
            }
        });
        if(user === null){
            return res.status(400).json({
                mensagem: "Usuário ou senha inválida"
            });
        }
        if(!(await bcrypt.compare(req.body.password, user.password))){
            return res.status(400).json({
                mensagem: "Usuário ou senha inválida"
            });
        }
        var token = jwt.sign(
            {
                id: user.id,
                role: user.role
            }, SECRET_KEY, {
            expiresIn: 3600
        });

        console.log(user.id)
        res.status(200).json({
            "cod": cod_barras,
            mensagem: "Login realizado com sucesso!",
            "id": user.id,
            "role": user.role,
            "name": user.name,
            "email": user.email,
            "user_type_id": user.user_type_id,
            "data": {token}
        });
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


async function getUserIdLogado(param){
    const token = param.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.id;
}

async function getRole(param){
    const token = param.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const role = decoded.role;
    console.log(role)
    return decoded.role;
}

async function getUserId(param){
    const response = await UserRepository.findByPk(param, {paranoid: false})
    if(response === null){
        return false
    }
    return true
}