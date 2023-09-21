import { where } from "sequelize";
import LabRepository from "../models/labs.js";

class LabController{

    async create(req, res){
        const dados = req.body
        try {
            const userType = await LabRepository.create(dados);
            res.status(200).json(userType);
        } catch (err) {
            res.status(400).json({mensagem: "Não foi possível cadastrar Lab!"})
        }
        
    }

    async findAll(req, res){
        try {
            const users = await LabRepository.findAll();
            res.status(200).json(users);
        } catch (err){
            res.status(400).json({mensagem: "Não existe lab cadastrado"});
        }
    }

    async findById(req, res){
        const {id} = req.params;
        try {
            const user = await LabRepository.findByPk(id);
            res.status(200).json(user);
        } catch {
            res.status(400).json({mensagem: "Lab não encontrado"})
        }
        
    }

    async deactivate(req, res){
        const id = req.params; 
        try{
            await LabRepository.destroy({ where: id });
            res.status(200).json({mensagem: "Lab desativado com sucesso com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Não foi possível excluir lab!"});
        }
    }

    async activate(req, res){
        const id = req.params;
        try{
            await LabRepository.restore({ where: id});
            res.status(200).json({mensagem: "Lab ativado com sucesso!"})
        } catch (err) {
            res.status(400).json({mensagem: "Não foi possível ativar lab!"})
        }
    }

    async update(req, res){
        const dados = req.body;
        const id = req.params;
        try {
            await LabRepository.update(dados, {where: id});
            res.status(200).json({ mensagem: "Lab editado com sucesso!"});
        } catch (err) {
            res.status(400).json({mensagem: "Lab não encontrado!"});
        }
    }
}
export default new LabController();