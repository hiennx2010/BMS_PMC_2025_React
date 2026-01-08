export class FileDetailDto {
    fileUuid?: string;
    base64Content?: string;
    fileContentUrl?: string;
    fileExtension?: string;
    fileName?: string;

    /**
     * Đường dẫn file
     * 
     * Trường hợp là URL thì sẽ redirect sang URL
     */
    filePath?: string;

    /**
     * Chỉ định để file lưu vào folder này
     */
    folderPath?: string;

    /**
     * Đối tượng sở hữu file
     */
    ownerUuid?: string;
}