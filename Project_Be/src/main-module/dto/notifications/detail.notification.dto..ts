export class NotificationDetailDto {
    /**
     * Đối tượng tạo thông báo
     */
    posterUuid: string;

    /**
     * Đối tượng nhận thông báo
     */
    ownerUuid: string;

    /**
     * Đối tượng được tác động
     */
    subjectUuid: string;

    /**
     * Đối tượng con được tác động
     */
    itemUuid?: string;

    /**
     * Loại hành động
     */
    type: string;

    createdAt?: Date;

    viewed?: boolean;
}