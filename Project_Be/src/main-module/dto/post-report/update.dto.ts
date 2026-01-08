import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { PostReportStatus } from "src/main-module/enum/post/post-report-status.enum"

export class PostReportUpdateDto {
    @IsOptional()
    @IsEnum(PostReportStatus)
    status: number

    @IsOptional()
    @IsString()
    violation: string

    @IsOptional()
    @IsString()
    note: string
}