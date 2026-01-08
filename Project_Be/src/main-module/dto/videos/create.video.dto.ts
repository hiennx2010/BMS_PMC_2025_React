import { FormField } from "src/common-module/dto/form/form-field.dto";

export class CreateVideoDto {
    static readonly CONSTRAINTS: FormField[] = [
        { code: "type", type: 'text', required: true },
        { code: "subtype", type: 'text', required: true },
        { code: "active", type: 'number', required: false },
        { code: "order", type: 'number', required: false },
        { code: "title", type: 'text', required: true },
        { code: "videoId", type: 'text', required: true },
    ]

    /**
     * video id
     */
    guid?: string;

    /**
     * Loại video: youtube, tiktok, instagram... 
     */
    type?: string;

    /**
     * Phân loại kiểu video: favorite: yêu thích, lastest: mới nhất...
     */
    subtype?: string;

    /**
     * Trạng thái hiển thị: 0: Ẩn, 1: Hiển thị
     */
    active?: 0 | 1;

    /**
     * Display priority của video
     */
    order?: number;

    /**
     * Tiêu đề video
     */
    title?: string;

    /**
     * id trên nền tảng của video
     */
    videoId?: string;

    /**
     * mô tả video
     */
    description?: string;

}
