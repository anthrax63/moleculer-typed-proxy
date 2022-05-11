import moleculer, { Context, ServiceBroker } from 'moleculer';
import { ServiceProxyFactory } from '../src/proxyFactory';
import { action, event, service, param, string } from '../src/decorators';

describe('ProxyFactory', () => {
    let serviceBroker: ServiceBroker;

    beforeAll(() => {
        serviceBroker = new ServiceBroker({ logLevel: 'fatal' });
    });

    test('should allow call own methods via proxy', async () => {
        @service()
        class SelfCallingService extends moleculer.Service {
            constructor(
                broker: ServiceBroker,
                private readonly factory: ServiceProxyFactory,
            ) {
                super(broker);
            }

            @action()
            async calc(@param({ type: 'number' }) param: number) {
                const s = this.factory.create(SelfCallingService);
                return await s.sqrt(param);
            }

            @action()
            sqrt(@param({ type: 'number' }) param: number) {
                return param * param;
            }
        }

        const serviceBroker = new ServiceBroker({ logLevel: 'fatal' });
        const proxyFactory = new ServiceProxyFactory(serviceBroker);
        serviceBroker.createService(
            new SelfCallingService(serviceBroker, proxyFactory),
        );
        await serviceBroker.start();
        const proxyService = proxyFactory.create(SelfCallingService);
        const result = await proxyService.calc(2);
        expect(result).toBe(4);
    });

    test('should throw when pass not decorated class', () => {
        class NotDecoratedService extends moleculer.Service {}
        const proxyFactory = new ServiceProxyFactory(serviceBroker);
        expect(() => proxyFactory.create(NotDecoratedService)).toThrow(
            'Provided class is not decorated as "proxyableService"',
        );
    });

    test('should call broker', async () => {
        const helloFunc = (name: string) => {
            return `Hello ${name}!`;
        };

        @service({
            name: 'test-service',
        })
        class TestService extends moleculer.Service {
            @action({
                name: 'say-hello',
            })
            sayHello(ctx: Context<string>) {
                return helloFunc(ctx.params);
            }

            @action({
                name: 'promise-test',
            })
            promiseTest(ctx: Context<string>): Promise<string> {
                return Promise.resolve(ctx.params);
            }

            @action()
            restParametersTest(
                @string() param1: string,
                @param({ type: 'number', optional: true }) param2?: number,
            ) {
                return Promise.resolve({ param1, param2 });
            }

            @action()
            restParametersTest2(@string() param1: string) {
                return Promise.resolve({ param1 });
            }

            @event()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
            testEvent(_payload: { param1: string }) {}
        }
        const callMock = jest
            .spyOn(ServiceBroker.prototype, 'call')
            .mockImplementation((actionName: string, params: any) => {
                return Promise.resolve({ params });
            });
        const emitMock = jest
            .spyOn(ServiceBroker.prototype, 'emit')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .mockImplementation((_eventName: string) => {
                return Promise.resolve();
            });
        const serviceBroker = new ServiceBroker({ logLevel: 'fatal' });
        const proxyFactory = new ServiceProxyFactory(serviceBroker);
        const proxyService = proxyFactory.create(TestService);
        await proxyService.sayHello('Johny');
        expect(callMock).toBeCalledTimes(1);
        expect(callMock).toBeCalledWith('test-service.say-hello', 'Johny');
        await proxyService.promiseTest('123');
        expect(callMock).toBeCalledTimes(2);
        expect(callMock).toBeCalledWith('test-service.promise-test', '123');
        await proxyService.restParametersTest('123', -1);
        expect(callMock).toBeCalledWith('test-service.restParametersTest', {
            param1: '123',
            param2: -1,
        });
        await proxyService.restParametersTest2('123');
        expect(callMock).toBeCalledWith('test-service.restParametersTest2', {
            param1: '123',
        });
        await proxyService.testEvent({ param1: 'test' });
        expect(emitMock).toBeCalledWith('test-service.testEvent', {
            param1: 'test',
        });
    });
});
