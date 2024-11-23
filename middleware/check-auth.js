import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const isAuthorized=(req,res,next)=>{
    try{
        
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                
                return res.status(401).json({message:"Unauthorized",success:false});
            }else{
                req.body.userId=decoded.id;
                next();
            }
        });
    }
    catch(err){
        console.log(err);

        return res.status(401).json({message:"Unauthorized",success:false});
    }
}