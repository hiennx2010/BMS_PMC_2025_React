import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { parse, isValid } from 'date-fns';

export function IsDateFormat(dateFormat: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsDateFormat',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [dateFormat],
            options: validationOptions,
            validator: IsDateFormatRule,

        });
    };
}

@ValidatorConstraint({ name: 'IsDateFormat' })
@Injectable()
export class IsDateFormatRule implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const [dateFormat] = validationArguments.constraints;
        return isValid(parse(value, dateFormat, new Date()))
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} must be valid in format ${validationArguments.constraints[0]}`;
        ;
    }

}