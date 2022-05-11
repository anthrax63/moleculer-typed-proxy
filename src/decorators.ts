import 'reflect-metadata';
import {
    action as decoratorsAction,
    META_PREFIX,
    service as decoratorsService,
    ServiceConstructor,
    ServiceDecorator,
    ServiceOptions,
} from '@anthrax63/moleculer-service-decorators';
import {
    METADATA_KEY_ACTIONS,
    METADATA_KEY_EVENTS,
    METADATA_KEY_NAME,
} from './consts';
import { getParamNames } from '@anthrax63/moleculer-service-decorators/dist/utils/parameters';
import { ActionOptions } from '@anthrax63/moleculer-service-decorators/dist/action';

export function service<T extends ServiceOptions>(
    options: T = {} as T,
): ServiceDecorator {
    const svc = decoratorsService(options);
    return function <T extends ServiceConstructor>(constructor: T) {
        const name = options.name || constructor.name;
        Reflect.defineMetadata(
            METADATA_KEY_ACTIONS,
            Reflect.getMetadata(`${META_PREFIX}actions`, constructor.prototype),
            constructor.prototype,
        );
        Reflect.defineMetadata(
            METADATA_KEY_EVENTS,
            Reflect.getMetadata(`${META_PREFIX}events`, constructor.prototype),
            constructor.prototype,
        );
        Reflect.defineMetadata(METADATA_KEY_NAME, name, constructor.prototype);
        return svc(constructor);
    };
}

export function action(options?: ActionOptions): MethodDecorator {
    const act = decoratorsAction(options);
    return <T>(
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>,
    ) => {
        const func: any = descriptor.value;
        if (
            func &&
            typeof func === 'function' &&
            Reflect.getMetadataKeys(target).indexOf(
                `${META_PREFIX}${propertyKey.toString()}Params`,
            ) !== -1
        ) {
            const paramNames = getParamNames(func);
            const keyName: string = propertyKey.toString();
            Reflect.defineMetadata(
                `${METADATA_KEY_ACTIONS}:${keyName}:params`,
                paramNames,
                target,
            );
        }
        return act(target, propertyKey, descriptor);
    };
}

export * from '@anthrax63/moleculer-service-decorators/dist/constants';
export * from '@anthrax63/moleculer-service-decorators/dist/event';
export * from '@anthrax63/moleculer-service-decorators/dist/param';
