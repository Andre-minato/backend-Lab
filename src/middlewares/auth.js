import  jwt  from "jsonwebtoken";

export const SECRET_KEY = "K365L&59812354$%235BNg147"


export function validateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        const mensagem = "Realizar o login para acessar a página";
        return res.status(401).json({ mensagem });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        SECRET_KEY,
        (err, decoded) => {
            if(err) return res.status(403).json({mensagem: "Não autorizado!"});
            req.id = decoded.id;
            console.log(decoded.id)
            next();
        }
    );
}

export const validateTokenAndRole = (roles) => async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        const mensagem = "Deve realizar o login!";
        return res.status(401).json({ mensagem });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        SECRET_KEY,
        (err, decoded) => {
            if(err) return res.status(403).json({mensagem: "Não autorizado!"});
            req.id = decoded.id;
            console.log(decoded.role);
            if (roles.includes(decoded.role)) next()
            else res.status(401).json({mensagem: "Não autorizado!"})
        }
    );
}

