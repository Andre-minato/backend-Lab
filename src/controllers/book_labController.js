import BookLabRepository from "../models/book_labs.js";
import { funcao } from "../funcoes/funcao.js";



class BookLabController{

    async findAll(req, res){
        try {
            const labs = await BookLabRepository.findAll();
        
            res.status(200).json(labs);
        } catch (err){
            res.status(400).json({mensagem: "Não existe usuário"});
        }
    }

    codigoBoleto(req, res){
        const boleto = funcao.gerarCodigoBoleto()
        return res.status(200).json(boleto)
    }

    async preReservation(req, res){
        let boleto = null
        const {user_id} = req.params
        const cod = req.body
        const cod_barras = cod['cod_barras'];
        boleto = await funcao.pagarBoleto(cod_barras, user_id)
        if(boleto.status !== 'approved'){
            return res.status(401).json({menssagem: "Verificar o pagamento do boleto"})
        }
        console.log(boleto)
        return res.status(200).json(boleto)
    }

    async create(req, res){
        const authHeader = req.headers['authorization'];
        const {user_id} = req.params
        const lab_id = req.body.lab_id
        const dados = {...req.body, user_id: Number(user_id)}
        //const user_type = await funcao.tipoUsuario(user_id)
        const userVerifyLogin = funcao.getUserIdLogado(authHeader)
        //let boleto = null;
        const labIsReserved = await funcao.labIsReserved(lab_id)

        if(userVerifyLogin != user_id){
            return res.status(401).json({mensagem: "Não autorizado!"})
        }
        if(labIsReserved === true) {
            return res.status(400).json({mensagem: "Lab está ocupado"})
        }
        // if(user_type === '1'){
        //     const cod_barras = funcao.gerarCodigoBoleto();
        //     boleto = await funcao.pagarBoleto(cod_barras, user_id)
        //     console.log(boleto)
        //     if(boleto.status !== 'approved'){
        //         return res.status(401).json({menssagem: "Verificar o pagamento do boleto"})
        //     }
        // }
        const existLab = await funcao.verifyLab(dados.lab_id)
        if(!existLab ){
            return res.status(400).json({mensagem: "Lab não está cadastrado"})
        }
        // if(boleto != null){
        //     dados.status = boleto.status
        // }
        try {
            const reserva_lab = await BookLabRepository.create(dados)
            console.log(reserva_lab.createdAt)
            return res.status(200).json(reserva_lab)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}
export default new BookLabController();