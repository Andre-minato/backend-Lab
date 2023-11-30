import UserRepository from "../models/users.js";
import BookLabRepository from "../models/book_labs.js";
import LabRepository from "../models/labs.js";
import jwt, { decode } from "jsonwebtoken"
import { SECRET_KEY } from "../middlewares/auth.js";

async function pagarBoleto(cod_barras, user_id){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Vf9WSyYqnwxXODjiExToZCT9ByWb3FVsjr");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "boleto": cod_barras,
        "user_id": Number(user_id)
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://api-go-wash-efc9c9582687.herokuapp.com/api/pay-boleto", requestOptions)
        const result = await response.json();
        console.log(result.data)
        return result.data
    } catch (error) {
        (error => console.log('error', error));
    }
}

function gerarCodigoBoleto(){
    const lista = [98765432864]
    const multiplicador = Math.floor(Math.random()*(9-1))+1
    let modificador = lista.map(function(element){
        return element*multiplicador
    })
        console.log(modificador)
        const valor = modificador.join()
        const novoValor = valor.toString().substring(0,8)
        console.log(novoValor)
        return novoValor
    
    }

async function tipoUsuario(user_id){
    const user = await UserRepository.findByPk(user_id);
    console.log(user.user_type_id)
    return user.user_type_id           
}

function getUserIdLogado(param){
    const token = param.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.id;
}

async function labIsReserved(lab_id){
    const lab = await BookLabRepository.findAll({
        limit: 1, 
        where:{lab_id},
        order: [['id', 'DESC']]
    })
    if(lab == 0){
        return false
    }
    const reserva = lab[0].createdAt
    console.log(reserva)
    const dataAtual = new Date()

    console.log(dataAtual)
    var milissegundos = dataAtual - reserva
    console.log(milissegundos)
    var tempoTotal = (milissegundos/1000)/60
    if(tempoTotal <= 5){
        return true
    }

    return false
}

async function verifyLab(lab_id){
    const existLab = await LabRepository.findByPk(lab_id)
    if(existLab === null){
        return false
    } else {
        return true
    }
}

export const funcao = {
    pagarBoleto,
    gerarCodigoBoleto, 
    tipoUsuario,
    getUserIdLogado,
    labIsReserved,
    verifyLab
}