import { FormField } from "src/common-module/dto/form/form-field.dto";

export class VideoListDto {
    static readonly CONSTRAINTS: FormField[] = [
        { code: "type", type: 'text', required: true }
    ]

    offset?: number;
    limit?: number;
    type?: string;
}