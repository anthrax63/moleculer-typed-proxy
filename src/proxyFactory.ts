import 'reflect-metadata';

import {
    METADATA_KEY_ACTIONS,
    METADATA_KEY_EVENTS,
    METADATA_KEY_NAME,
} from './consts';
import moleculer from 'moleculer';

type ServiceOptionsToExclude =
    | 'parseServiceSchema'
    | 'name'
    | 'fullName'
    | 'version?'
    | 'settings'
    | 'metadata'
    | 'dependencies'
    | 'schema'
    | 'originalSchema'
    | 'broker'
    | 'logger'
    | 'actions'
    | 'Promise'
    | '_init'
    | '_start'
    | '_stop'
    | 'waitForServices'
    | 'version';

type RemoveIndex<T> = {
    [K in keyof T as string extends K
        ? never
        : number extends K
        ? never
        : K]: T[K];
};

type ServiceProxyActions<T> = Pick<
    {
        [P in keyof T]: T[P] extends (
            a: moleculer.Context<infer M>,
        ) => Promise<infer R>
            ? (params: M) => Promise<R>
            : T[P] extends (a: moleculer.Context<infer M>) => infer R
            ? (params: M) => Promise<R>
            : T[P] extends (...a: infer M) => Promise<infer R>
            ? (...a: M) => Promise<R>
            : T[P] extends (...a: infer M) => infer R
            ? (...a: M) => Promise<R>
            : never;
    },
    keyof Omit<RemoveIndex<T>, ServiceOptionsToExclude>
>;

export type ServiceProxy<T> = ServiceProxyActions<T>;

export interface ServiceBrokerLike {
    call<T, P>(actionName: string, params: P): Promise<T>;
    emit<D>(eventName: string, data: D): Promise<void>;
}

export class ServiceProxyFactory {
    constructor(private readonly broker: ServiceBrokerLike) {}

    create<T extends object>(t: new (...args: never[]) => T): ServiceProxy<T> {
        const serviceName = Reflect.getMetadata(METADATA_KEY_NAME, t.prototype);
        const actionsMetadata = Reflect.getMetadata(
            METADATA_KEY_ACTIONS,
            t.prototype,
        );
        const eventsMetadata = Reflect.getMetadata(
            METADATA_KEY_EVENTS,
            t.prototype,
        );
        if (!serviceName) {
            throw new Error(
                'Provided class is not decorated as "proxyableService"',
            );
        }
        const handler = {
            get: (target: any, prop: any): any => {
                const action = actionsMetadata && actionsMetadata[prop];
                const event = eventsMetadata && eventsMetadata[prop];
                if (!action && !event) {
                    throw new Error(`Can't find action ${prop}`);
                }
                const paramsNames: string[] = Reflect.getMetadata(
                    `${METADATA_KEY_ACTIONS}:${prop}:params`,
                    t.prototype,
                );
                return (...params: any) => {
                    let param: any;
                    if (!paramsNames) {
                        param = params[0];
                    } else {
                        param = {};
                        paramsNames.forEach(
                            (name, i) => (param[name] = params[i]),
                        );
                    }
                    if (action) {
                        return this.broker.call(
                            `${serviceName}.${action.name}`,
                            param,
                        );
                    } else {
                        return this.broker.emit(
                            `${serviceName}.${event.name}`,
                            param,
                        );
                    }
                };
            },
        };
        return new Proxy({}, handler as any) as any;
    }
}
