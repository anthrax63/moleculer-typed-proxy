import moleculer, { ServiceBroker } from 'moleculer';
import {
    ServiceProxyFactory,
    service,
    event,
    string,
    number,
    action,
} from 'moleculer-typed-proxy';
import { Container, inject } from 'inversify';

export class BaseService extends moleculer.Service {
    constructor(
        @inject('ServiceBroker')
            broker: ServiceBroker,
        @inject('ServiceProxyFactory')
        protected readonly proxyFactory: ServiceProxyFactory,
    ) {
        super(broker);
    }
}

@service({
    name: 'user-service',
})
export class UserService extends BaseService {
    @action({
        name: 'register-user',
    })
    registerUser(
        @string() login: string,
        @string() name: string,
        @number() age: number,
    ) {
        // Add user to db
        // ...
        // Emit event of another service
        this.proxyFactory
            .create(LoggingService)
            .userRegistered(login, name, age);
    }
}

@service({
    name: 'logging-service',
})
export class LoggingService extends BaseService {
    @event({
        name: 'user-registered',
    })
    async userRegistered(
        @string() login: string,
        @string() name: string,
        @number() age: number,
    ) {
        console.log('User registered', login, name, age);
    }
}

const container = new Container();
container.bind('ServiceBroker').to(moleculer.ServiceBroker).inSingletonScope();
container
    .bind('ServiceProxyFactory')
    .to(ServiceProxyFactory)
    .inSingletonScope();

// Get proxy
const userServiceProxy = container
    .get<ServiceProxyFactory>(`ServiceProxyFactory`)
    .create(UserService);

// Call action
userServiceProxy.registerUser('login', 'name', 25).then(() => {
    console.log('User created successfully');
});
