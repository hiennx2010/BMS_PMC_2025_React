export class UpdateVideoDto {
    /**
     * loại video: youtube, tiktok...
     */
    type?: string;

    /**
     * phân loại nhãn video: favorite, lastest...
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