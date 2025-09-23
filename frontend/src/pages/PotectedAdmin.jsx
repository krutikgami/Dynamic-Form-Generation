import { decodeToken } from '../utilities/decodeToken.js'
import Cookie from 'js-cookie'

export default function ProtectedAdmin({ children }) {
  const token = Cookie.get('authToken');
  let decodedToken;

  if (token) {
    decodedToken = decodeToken(token);
  }

  if (decodedToken && decodedToken?.role === 'ADMIN') {
    return <>{children}</>;
  }

  return <h1 className='text-2xl text-center font-bold'>Unauthorized access!!</h1>;
}
