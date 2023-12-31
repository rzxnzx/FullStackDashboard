import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { IUser } from './interfaces/user.interfaces';

@Injectable()
export class UserService implements IUser {
    constructor(private prisma: PrismaService) { }

    public async create(dto: CreateUserDto) {
        const user = await this.prisma.admins.findUnique({
            where: {
                email: dto.email
            }
        })

        if (user) {
            throw new ConflictException("Email is already registered.")
        } else {
            const newUser = await this.prisma.admins.create({
                data: {
                    ...dto,
                    password: await hash(dto.password, 10)
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = newUser;
            return result;
        }
    }

    public async findByEmail(email: string) {
        return await this.prisma.admins.findUnique({ where: { email: email } })
    }

    public async findById(id: number) {
        return await this.prisma.admins.findUnique({ where: { id: id } })
    }
}
