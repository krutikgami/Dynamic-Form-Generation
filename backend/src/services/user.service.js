import { UserRepository } from "../repositories/user.repository.js";
import {hashPassword,comparePassword} from '../utilities/bcryptPass.js'
import {createUserRole} from '../utilities/constants/codeConstants.js'
const userRepo = new UserRepository();
export class UserService{
    async createUserService(userData){
        try {
            const {email,name,password} = userData;
            
            const isExists = await userRepo.findUSerExists({email});
            if(isExists){
                throw new Error('User is already registered')
            }
            const hashedPassword = await hashPassword(password);
            const data =  await userRepo.createUser({email,name,password : hashedPassword,role : createUserRole});
            return data;
        } catch (error) {
          console.error('Error in User Service.createUser',error)
          throw error;
        }

    }

    async loginUserService(userData){
        try {
            const {email,password} = userData;
            const userExists = await userRepo.findUSerExists({email})
            if(!userExists){
                throw new Error('Invalid Credentials')
            }
            const validPassword = await comparePassword(password,userExists.password)
            if(!validPassword){
                throw new Error('Invalid Password')
            }

            return userExists;
        } catch (error) {
          console.error('Error in User Service.loginUserService',error)
          throw error;
        }
    }

    async getEmailSearchByUSerService(q,role){
        try {
            return userRepo.findEmailByUser(q,role);
        } catch (error) {
          console.error('Error in User Service.getEmailSearchByUSerService',error)
          throw error;
        }
    }
}