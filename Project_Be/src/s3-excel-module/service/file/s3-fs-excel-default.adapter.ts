import { Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { S3FsExcelAdapter } from "./s3-fs-excel.adapter";

@Injectable()
export class S3FsExcelDefaultAdapter extends S3FsExcelAdapter {

    constructor() {
        super('S3FsExcelAdapter');

        const config: any = {
            region: process.env['s3.region'],
            credentials: {
                accessKeyId: process.env['s3.access-key-id'],
                secretAccessKey: process.env['s3.secret-access-key'],
            },
        };

        if (process.env['s3.endpoint']) {
            config.endpoint = process.env['s3.endpoint'];
        }

        this.client = new S3Client(config);
    }
}
