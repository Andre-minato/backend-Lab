import LabRepository from "../models/labs.js";

class LabController{

    async create(req, res){
        const dados = req.body
        try {
            const userType = await LabRepository.create(dados);
            return res.status(200).json(userType);
        } catch (err) {
            return res.status(400).json({mensagem: "Não foi possível cadastrar Lab!"})
        }
        
    }

    async findAll(req, res){
        try {
            const users = await LabRepository.findAll({paranoid: false});
            return res.status(200).json(users);
        } catch (err){
            return res.status(400).json({mensagem: "Não existe lab cadastrado"});
        }
    }

    async findById(req, res){
        const { id } = req.params;
        const verifyId = await getLabId(id)
        if(verifyId === false){
            return res.status(400).json({mensagem: "Não existe cadastro para id informado"})
        }
        try {
            const user = await LabRepository.findByPk(id);
            return res.status(200).json(user);
        } catch {
            return res.status(400).json({mensagem: "Lab não encontrado"})
        }
        
    }

    async disable(req, res){
        const { id } = req.params; 
        const verifyId = await getLabId(id)
        if(verifyId === false){
            return res.status(400).json({mensagem: "Não existe cadastro para id informado"})
        }
        try{
            await LabRepository.destroy({ where: { id } });
            res.status(200).json({mensagem: "Lab desativado com sucesso com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Não foi possível excluir lab!"});
        }
    }

    async activate(req, res){
        const { id } = req.params;
        const verifyId = await getLabId(id)
        if(verifyId === false){
            return res.status(400).json({mensagem: "Não existe cadastro"})
        }
        try{
            await LabRepository.restore({ where: { id }});
            return res.status(200).json({mensagem: "Lab ativado com sucesso!"})
        } catch (err) {
            return res.status(400).json({mensagem: "Não foi possível ativar lab!"})
        }
    }

    async update(req, res){
        const dados = req.body;
        const { id } = req.params;
        const verifyId = await getLabId(id)
        if(verifyId === false){
            return res.status(400).json({mensagem: "Não existe cadastro"})
        }
        try {
            await LabRepository.update(dados, {where: { id }});
            return res.status(200).json({ mensagem: "Lab editado com sucesso!"});
        } catch (err) {
            return res.status(400).json({mensagem: "Lab não encontrado!"});
        }
    }
}
export default new LabController();

async function getLabId(param){
    const response = await LabRepository.findByPk(param, {paranoid: false})
    if(response === null){
        return false
    }
    return true
}