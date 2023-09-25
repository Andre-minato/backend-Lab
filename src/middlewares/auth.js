import jwt from "jsonwebtoken";


export const SECRET_KEY = "K365L&59812354$%235BNg147"


export function tokenValited(req, res, next){
    const authHeader = req.headers['authorization'];
    if(!authHeader){return res.status(401).json({
        mensagem: "Realizar o login para acessar a página"
    });
    }   
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        SECRET_KEY,
        (err, decoded) => {
            if(err) return res.status(403).json({mensagem: "Não autorizado!"});
            req.id = decoded.id;
            next();
        }
    );
}
