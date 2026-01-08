import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import * as _ from "lodash";
import { JDBCTemplate } from "src/common-module/utils/jdbc-template/jdbc-template";
import { DataSource } from "typeorm";

@Injectable()
export class EntitiesService {
    constructor(@InjectDataSource('ossn-db') private dataSource: DataSource) { }

    /**
     * Thêm/Cập nhật các trường thông tin cho trong ossn_entities & ossn_entities_metadata
     * @param oeOwnerGuid 
     * @param params 
     */
    async addMoreParams(oeOwnerGuid: string, oeType: string, params: Record<string, any>) {
        let sqlCmd0: string;
        let sqlCmd1: string;
        let sqlCmd2: string;
        let sqlCmd3: string;
        let __params: any;
        let keys: string[] = Object.keys(params);

        let oems: any[] = await this.getMoreParams([oeOwnerGuid], oeType, keys);

        sqlCmd0 = `update ossn_entities set time_updated = :timeUpdated where guid = :oeGuid`;
        sqlCmd1 = `update ossn_entities_metadata set value = :value where guid = :oeGuid`;

        sqlCmd2 = `insert into ossn_entities (owner_guid, type, subtype, time_created, time_updated, permission, active)
                value (:oeOwnerGuid, :oeType, :oeSubType, :timeCreated, 0, 2, 1)`;
        sqlCmd3 = `insert into ossn_entities_metadata (guid, value) value (:guid, :value)`;

        let __currentTime = new Date().getTime() / 1000;
        for (let idx = 0; idx < keys.length; idx++) {
            let key: string = keys.at(idx);
            let val: any = params[key];

            if (val === undefined || val === null) {
                continue;
            }

            let updateItem = oems.find((it: any) => { return it['subtype'] === key; });
            if (updateItem) {
                /**
                 * Cập nhật bản ghi đã có
                 */
                __params = {
                    oeGuid: updateItem['guid'],
                    timeUpdated: __currentTime,
                    value: params[key]
                };

                await JDBCTemplate.query({
                    dataSource: this.dataSource,
                    sqlCommand: sqlCmd0,
                    params: __params
                });
                await JDBCTemplate.query({
                    dataSource: this.dataSource,
                    sqlCommand: sqlCmd1,
                    params: __params
                });

                continue;
            }

            /**
             * Thêm bản ghi mới
             */
            __params = {
                oeOwnerGuid: oeOwnerGuid,
                oeType: oeType,
                oeSubType: key,
                timeCreated: __currentTime
            };

            let rs: any = await JDBCTemplate.query({
                dataSource: this.dataSource,
                sqlCommand: sqlCmd2,
                params: __params
            });
            let __guid: any = rs['insertId'];
            __params = {
                guid: __guid,
                value: params[key]
            }
            await JDBCTemplate.query({
                dataSource: this.dataSource,
                sqlCommand: sqlCmd3,
                params: __params
            })
        }
    }

    /**
     * Lấy giá trị các field mở rộng của object trong ossn_entities & ossn_entities_metadata
     * @param roomIds 
     * @param paramNames 
     * @returns 
     */
    async getMoreParams(oeOwnerGuids: any[], oeType: string, paramNames?: string[]): Promise<any[]> {
        let sqlCmd: string = `select oe.guid, oe.owner_guid, oe.subtype, oem.value
                            from ossn_entities oe, ossn_entities_metadata oem
                            where oe.type = :oeType
                            and oe.owner_guid in (:oeOwnerGuids)
                            and oe.guid = oem.guid`;
        if (!_.isEmpty(paramNames)) {
            sqlCmd = `${sqlCmd} and oe.subtype in (:paramNames)`
        }
        let __params: any = {
            oeType: oeType,
            oeOwnerGuids: oeOwnerGuids,
            paramNames: paramNames
        }
        let rs: any[] = await JDBCTemplate.query({
            dataSource: this.dataSource,
            sqlCommand: sqlCmd,
            params: __params
        });
        return rs;
    }

    /**
     * Xóa giá trị các field mở rộng của object trong ossn_entities & ossn_entities_metadata
     */
    async removeParams(oeOwnerGuids: any[], oeType: string, paramNames?: string[]): Promise<void> {
        let sqlParams = ''
        if (!_.isEmpty(paramNames)) {
            sqlParams = ` and oe.subtype in (:paramNames)`
        }

        let cmdDeleteMetadata: string = `
            DELETE FROM ossn_entities_metadata
            WHERE id IN (
                SELECT id
                FROM (
                    SELECT oem.id
                    FROM ossn_entities_metadata oem
                    INNER JOIN ossn_entities oe ON oe.guid = oem.guid
                    WHERE oe.type = :oeType
                        AND oe.owner_guid IN (:oeOwnerGuids)
                        ${sqlParams}
                ) AS subquery
            );
        `
        let cmdDeleteEntity = `
            DELETE FROM ossn_entities oe
            WHERE oe.type = :oeType
                AND oe.owner_guid IN (:oeOwnerGuids)
                ${sqlParams}
        `

        let __params: any = {
            oeType: oeType,
            oeOwnerGuids: oeOwnerGuids,
            paramNames: paramNames
        }

        await JDBCTemplate.query({
            dataSource: this.dataSource,
            sqlCommand: cmdDeleteMetadata,
            params: __params
        });
        await JDBCTemplate.query({
            dataSource: this.dataSource,
            sqlCommand: cmdDeleteEntity,
            params: __params
        });
    }
}