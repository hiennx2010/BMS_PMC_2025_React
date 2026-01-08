import { MakeDirectoryOptions, Mode, PathLike, PathOrFileDescriptor, RmDirOptions, RmOptions, WriteFileOptions, mkdirSync, readFileSync, rmSync, rmdirSync } from "fs";
import { Logger } from "@nestjs/common";
import { AFsAdapter } from "src/common-module/utils/file/a-fs.adapter";
import { DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ICacheAdapter } from "src/common-module/utils/cache/i-cache-adapter";
import { CacheUtils } from "src/common-module/utils/cache/cache.utils";
import { MD5 } from "crypto-js";

export class S3FsExcelAdapter extends AFsAdapter {
    private static readonly log: Logger = new Logger(S3FsExcelAdapter.name);

    client: S3Client;
    private get cacheAdapter(): ICacheAdapter {
        return CacheUtils.getCacheAdapter();
    }

    constructor(adapterName: string) {
        super(adapterName);
    }

    override async getFileUrl(path: PathLike): Promise<any> {
        let expiresTime: number = 3600;
        let key: string = this.getFileUrlCacheKey(path);
        let signedUrl: any = await this.cacheAdapter.wrap(key, async () => {
            this.log.log(`calc ${key}...`);

            let __key: string = path.toString();
            if (__key.startsWith('/')) {
                __key = __key.substring(1);
            }

            const params: GetObjectCommandInput = {
                Bucket: process.env['s3.bucket.name'],
                Key: __key,
            };

            return await getSignedUrl(this.client, new GetObjectCommand(params), { expiresIn: expiresTime });
        }, expiresTime * 1000);

        return signedUrl;
    }

    override async readFileSync(path: PathOrFileDescriptor, options?: { encoding?: null; flag?: string; }): Promise<any> {
        return readFileSync(path, options);
    }

    override async writeFileSync(file: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView | Buffer, options?: WriteFileOptions): Promise<any> {
        let key: string = file.toString();
        if (key.startsWith('/')) {
            key = key.substring(1);
        }
        let dto: PutObjectCommandInput = {
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Bucket: process.env['s3.bucket.name'],
            Key: key,
            Body: data as Buffer
        };
        return await this.client.send(new PutObjectCommand(dto));
    }

    override async mkdirSync(path: PathLike, options?: Mode | MakeDirectoryOptions): Promise<any> {
        return mkdirSync(path, options);
    }

    override async appendFileSync(path: PathOrFileDescriptor, data: string | Uint8Array, options?: WriteFileOptions): Promise<any> {

    }

    override async existsSync(path: PathLike): Promise<boolean> {
        return false;
    }

    override async rmdirSync(path: PathLike, options?: RmDirOptions): Promise<any> {
        return rmdirSync(path, options);
    }

    override async rmSync(path: PathLike, options?: RmOptions): Promise<any> {
        let key: string = path.toString();
        if (key.startsWith('/')) {
            key = key.substring(1);
        }
        let doci: DeleteObjectCommandInput = {
            Bucket: process.env['s3.bucket.name'],
            Key: key,
        };
        let res = await this.client.send(new DeleteObjectCommand(doci));

        return res;
    }

    getFileUrlCacheKey(path: PathLike) {
        let key: string = `s3-fs-excel-adapter:get-file-url:${MD5(path.toString())}`;
        return key;
    }
}