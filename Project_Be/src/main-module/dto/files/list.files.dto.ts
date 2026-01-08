export class FileListReqDto {
    offset?: number;
    limit?: number;

    ownerUuids?: string[];
    subTypes?: string[];
}