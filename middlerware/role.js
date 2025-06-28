exports.roleCheck =(role)=>{
    return (req,res,next)=>{
        if(!req.user || req.user.role != role) 
            return res.status(401).json({message:`Unauthorize role Access. You must be an ${role} to access this resource`})
        next()
    }
}