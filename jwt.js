const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET_KEY;
const jwtAuthMiddleware=(req,res,next)=>{
    const Authorization=req.headers.authorization;
    if(!Authorization)
    {
        return res.status(401).json({err:"Unauthorized"});
    }
    try{
        const token=Authorization.split(' ')[1];
        const decoded= jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        console.log(err);
        return next(err);
    }
   
}
const generateToken=async(payload)=>{
    return  jwt.sign(payload,JWT_SECRET);
}
module.exports={jwtAuthMiddleware,generateToken}