import { Controller, Injectable } from "@nestjs/common";
import { UserAuth } from "./user.service";



@Controller('users')
export class UserAuthController{
    constructor(private readonly userService:UserAuth){}




    

}