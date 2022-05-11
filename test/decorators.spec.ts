import 'reflect-metadata';
import { service, action, event } from '../src/decorators';
import moleculer, { ServiceBroker } from 'moleculer';
import { METADATA_KEY_ACTIONS, METADATA_KEY_NAME } from '../src/consts';

describe('Decorators', () => {
    describe('proxyableService', () => {
        test('should define metadata', () => {
            @service()
            class TestService extends moleculer.Service {
                @action()
                action() {
                    return 'test';
                }
            }

            @service({ name: 'custom-name' })
            class TestServiceWithCustomName extends moleculer.Service {}
            expect(
                Reflect.getMetadata(METADATA_KEY_NAME, TestService.prototype),
            ).toBe('TestService');

            const actionsMetadata = Reflect.getMetadata(
                METADATA_KEY_ACTIONS,
                TestService.prototype,
            );

            expect(actionsMetadata).toBeDefined();
            expect(actionsMetadata.action).toBeDefined();
            expect(actionsMetadata.action.handler).toBeDefined();
            expect(actionsMetadata.action.name).toBe('action');

            expect(
                Reflect.getMetadata(
                    METADATA_KEY_NAME,
                    TestServiceWithCustomName.prototype,
                ),
            ).toBe('custom-name');
        });

        test("shouldn't mess up the original decorator", () => {
            @service({ name: 'my-service' })
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
