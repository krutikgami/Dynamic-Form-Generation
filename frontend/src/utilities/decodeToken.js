import * as jwt from 'jwt-decode'
export function decodeToken(token){
    try {
        const decodedToken = jwt.jwtDecode(token);
        console.log(decodedToken)
        return decodedToken;
    } catch (error) {
        console.error('Error in Decoding Token',error)
        return null;
    }
}