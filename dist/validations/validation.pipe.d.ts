import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ValidationPipe implements PipeTransform<any> {
    transform(value: unknown, { metatype }: ArgumentMetadata): Promise<any>;
    private toValidate;
}
