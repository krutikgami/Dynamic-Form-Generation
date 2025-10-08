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
            return await prisma.user.findFirst({
                where: {
                    OR: [
                        email ? { email } : undefined,
                        id ? { id } : undefined
                    ].filter(Boolean),
                    deleted_at : null
                }
            })
        } catch (error) {
            console.error('DB error for User Repository.findUSerExists',error)
            throw new Error('Database error while finding user exists');
        }
    }

    async findEmailByUser(q,role){
        try {
            const where = {
                deleted_at: null,
            };

            if (q) {
                where.email = {
                    contains: q,
                    mode: 'insensitive',
                };
            }

            if (role) {
                where.role = role;
            }
            return await prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                },
            });
        } catch (error) {
            console.error('DB error for User Repository.findEmailByUser',error)
            throw new Error('Database error while finding EmailByUser');
        }
    }
}