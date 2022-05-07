import 'reflect-metadata';
import moleculer, { ServiceBroker } from 'moleculer';

type ServiceProxy<T> = {
    [Property in keyof T]: T[Property] extends (
        a: moleculer.Context<infer M>,
    ) => infer R
        ? (a: M) => Promise<R>
        : never;
};

export class ServiceProxyFactory {
    constructor(private readonly broker: ServiceBroker) {}

    create<T extends moleculer.Service>(
        t: new (...args: never[]) => T,
    ): ServiceProxy<T> {
        const serviceName = t.prototype.serviceName;
        const handler = {
            get: (target: any, prop: any): any => {
                const action = t.prototype.actions[prop];
                if (!action) {
                    return undefined;
                }
                return (params: any) => {
                    return this.broker.call(
                        `${serviceName}.${action.name}`,
                        params,
                    );
                };
            },
        };
        return new Proxy({}, handler as any) as any;
    }
}
