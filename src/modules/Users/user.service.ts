import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserAuthService{
    constructor(private prisma:PrismaService){}

    async createUser(data: Prisma.UserCreateInput): Promise<User> {

        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
          throw new ConflictException('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        console.log(data)
        // Create the new user
        return this.prisma.user.create({ data });
      }
      

  async getUserById(email:string,password:string):Promise<User>{
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
  async getUser():Promise<User[]>{
    return this.prisma.user.findMany();
  }
  async updateUser(id:number,data:Prisma.UserUpdateInput):Promise<User>{
    return this.prisma.user.update({where:{id},data});
  }
  async deleteUser(id:number):Promise<User>{
    return this.prisma.user.delete({where:{id}})
  }
}