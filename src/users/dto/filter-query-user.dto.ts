import { IsIn, IsOptional } from "class-validator";

export class FilterQueryUserDto {
    @IsOptional()
    @IsIn(['active', 'inactive'])
    status?: 'active' | 'inactive';

    @IsOptional()
    @IsIn(['user', 'staff', 'admin'])
    role?: 'user' | 'staff' | 'admin';
}
