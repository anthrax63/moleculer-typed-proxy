import moleculer, { ServiceBroker } from 'moleculer';
import {
    ServiceProxyFactory,
    service,
    event,
    string,
    number,
} from 'moleculer-typed-proxy';

@service({
    name: 'logging-service',
})
export class LoggingService extends moleculer.Service {
    @event({
        name: 'user-registered',
    })
    userRegistered(
        @string() login: string,
        @string() name: string,
        @number() age: number,
    ) {
        console.log('User registered', login, name, age);
    }
}

const broker = new ServiceBroker();
const factory = new ServiceProxyFactory(broker);

const serviceProxy = factory.create(LoggingService);

serviceProxy.userRegistered('login', 'name', 25);
