export interface DomainMappingJoinDto {
    firstDomain: string;
    firstId: string;
    secondDomain: string;
    secondId: string;
}

export interface DomainMappingJoinMultiDto {
    firstDomain: string;
    firstId: string;
    secondDomain: string;
    secondIds: string[];
}