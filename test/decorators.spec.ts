import 'reflect-metadata';
import { proxyableService } from '../src/decorators';
import moleculer, { ServiceBroker } from 'moleculer';
import { action, event } from '@redpills/moleculer-decorators';

describe('Decorators', () => {
    describe('proxyableService', () => {
        test('should define metadata', () => {
            @proxyableService()
            class TestService extends moleculer.Service {}

            @proxyableService({ name: 'custom-name' })
            class TestServiceWithCustomName extends moleculer.Service {}
            expect(
                Reflect.getMetadata('proxyableService:name', TestService),
            ).toBe('TestService');

            expect(
                Reflect.getMetadata(
                    'proxyableService:name',
                    TestServiceWithCustomName,
                ),
            ).toBe('custom-name');
        });

        test("shouldn't mess up the original decorator", () => {
            @proxyableService({ name: 'my-service' })
            class TestService extends moleculer.Service {
                @action()
                testAction(param1: string, param2: string) {
                    return param1 + param2;
                }

                @event()
                testEvent(param1: string, param2: string) {
                    return param1 + param2;
                }
            }

            const broker = new ServiceBroker({ logLevel: 'fatal' });

            const serviceInstance = new TestService(broker) as any;

            expect(serviceInstance.actions).toBeDefined();
            expect(serviceInstance.actions.testAction).toBeDefined();

            expect(serviceInstance.events).toBeDefined();
            expect(serviceInstance.events.testEvent).toBeDefined();
        });
    });
});
