import { IsDateFormat } from "../validation/is-date-format.validation"

export class InteractionStatisticsCreateDto{
    @IsDateFormat("MM/dd/yyyy")
    startDate: string

    @IsDateFormat("MM/dd/yyyy")
    endDate: string
}