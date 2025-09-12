import { prisma } from "../utilities/prisma.constants.js";


export class UserRepository{
    async createUser(user){
        try {
            return await prisma.user.create({data : user});
        } catch (error) {
            console.error('DB error for User Repository.createUser',error)
            throw new Error('Database error while creating user');
        }
    }
    async findUSerExists({email,id}){
        try {
            console.log(id);
            
            return await prisma.user.findFirst({
                where: {
                    OR: [
                        email ? { email } : undefined,
                        id ? { id } : undefined
                    ].filter(Boolean)
                }
            })
        } catch (error) {
            console.error('DB error for User Repository.findUSerExists',error)
            throw new Error('Database error while finding user exists');
        }
    }
}