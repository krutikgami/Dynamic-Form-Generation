import Cookies  from 'js-cookie'

export function getCookie(){
    try {
        const token = Cookies.get('authTokenClient');
        return token;
    } catch (error) {
        return null;
    }
}