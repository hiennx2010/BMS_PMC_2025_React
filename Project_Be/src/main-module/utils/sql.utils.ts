import { Filter } from "src/common-module/dto/data-table-filter.dto";
import { DateTimeConvert } from "src/common-module/utils/convert/datetime-convert.utils";
import moment from 'moment';
import * as _ from 'lodash'

export class SqlUtils {
    public static getWhereSqlAndParams(filters: Record<string, any>) {
        let whereClauses: string[] = [];
        let params: Record<string, string | number> = {}
        Object.keys(filters).forEach((key: string) => {
            let __filter = filters[key]
            let __value: any = __filter.value
            let column = key.split('.').pop()
            switch (filters[key].matchMode) {
                case 'equals':
                    whereClauses.push(`${key} = :param_${column}`);
                    params[`param_${column}`] = __value
                    break;
                case 'not':
                case 'isNull':
                    whereClauses.push(`${key} is NULL`);
                    break;
                case 'contains':
                    whereClauses.push(`${key} like :param_${column}`);
                    params[`param_${column}`] = `%${__value}%`
                    break
                case 'startsWith':
                case 'endsWith':
                case 'inList':
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__value)) {
                        __value = JSON.parse(__value);
                    }
                    whereClauses.push(`${key} in (${__value.map((value, i) => `:param_${column}_${i}`).join(',')})`);
                    __value.forEach((value, i) => {
                        params[`param_${column}_${i}`] = value
                    })
                    break
                case 'notInList':
                case 'greaterThan':
                case 'greaterThanOrEquals':
                case 'lowersThan':
                case 'lowersThanOrEquals':
                case 'between':
                    switch (__filter.dataType) {
                        case 'string':
                        case 'number':
                        case 'datetime':
                            let convertUtils = new DateTimeConvert()
                            __filter.value = [
                                convertUtils.parse(__filter.value[0]),
                                convertUtils.parse(__filter.value[1])
                            ]
                            whereClauses.push(`${key} between :param_${column}_0 AND :param_${column}_1`);
                            __value.forEach((value, i) => {
                                params[`param_${column}_${i}`] = this.formatSqlDateTime(value)
                            })
                            break;
                    }
                    break;
            }
        })
        return {
            whereSql: whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '',
            params: params
        }
    }

    private static formatSqlDateTime(isoString: string): string {
        const formattedDateTime = moment(isoString).format('YYYY-MM-DD HH:mm:ss');
        return formattedDateTime;
    }
}