import { UserRepository } from "../repositories/user.repository.js";
import {hashPassword} from '../utilities/bcryptPass.js'

const userRepo = new UserRepository();
export class UserService{
    async createUserService(userData){
        try {
            const {email,name,password} = userData;
            if(!email || !name || !password){
                throw new Error('All Fields are required')
            }
            const isExists = await userRepo.findUSerExists({email});
            if(isExists){
                throw new Error('User is already registered')
            }
            const hashedPassword = await hashPassword(password);
            const data =  await userRepo.createUser({email,name,password : hashedPassword,role : 'ADMIN'});
            return data;
        } catch (error) {
          console.error('Error in User Service.createUser',error)
          throw error;
        }

    }
}