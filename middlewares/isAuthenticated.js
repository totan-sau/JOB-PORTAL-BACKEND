import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const decodeToken = await jwt.verify(token, process.env.SECRET_KEY);

        if(!decodeToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.id = decodeToken.userId;
        next();
    } catch(error) {
        console.log(error);
    }
}

export default isAuthenticated;