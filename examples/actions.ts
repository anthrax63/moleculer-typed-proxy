import moleculer, { ServiceBroker } from 'moleculer';
import {
    ServiceProxyFactory,
    service,
    action,
    string,
} from 'moleculer-typed-proxy';

@service({
    name: 'example-service',
})
export class ExampleService extends moleculer.Service {
    @action({
        name: 'say.hello',
    })
    async sayHello(@string() name: string) {
        return `Hello, ${name}!`;
    }
}

const broker = new ServiceBroker();
const factory = new ServiceProxyFactory(broker);

const serviceProxy = factory.create(ExampleService);

serviceProxy.sayHello('Johny').then((result) => {
    // Result has returned via broker, not direct call
    console.log(result);
});
