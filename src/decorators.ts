import 'reflect-metadata';
import {
    service,
    ServiceConstructor,
    ServiceDecorator,
    ServiceOptions,
} from '@redpills/moleculer-decorators';

export function proxyableService<T extends ServiceOptions>(
    options: T = {} as T,
): ServiceDecorator {
    const svc = service(options);
    return function <T extends ServiceConstructor>(constructor: T) {
        const name = options.name || constructor.name;
        Reflect.defineMetadata('proxyableService:name', name, constructor);
        return svc(constructor);
    };
}
