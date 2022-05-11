<div id="top"></div>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/anthrax63/moleculer-typed-proxy">
    <img src="images/moleculer_logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Moleculer Typed Proxy</h3>

  <p align="center">
    Decorators and typed calls of moleculer services without any extra code.
    <br />
    <br />
    <a href="https://github.com/anthrax63/moleculer-typed-proxy/issues">Report Bug</a>
    ·
    <a href="https://github.com/anthrax63/moleculer-typed-proxy/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/anthrax63/moleculer-typed-proxy)

The <a href="https://github.com/moleculerjs/moleculer">Moleculer</a> is a great framework. However, out of the box it is not very typescript friendly. The description of actions and then their subsequent call through a broker are not strongly typed, which can complicate maintenance and refactoring. This library combines the ability to declaratively describe services using decorators, as well as call methods or events using strong typing.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Moleculer](https://moleculer.services//)
* [moleculer-service-decorators](https://github.com/anthrax63/moleculer-service-decorators)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how to use this library. Library provides decorators for simple service definition and ServiceProxyFactory that is used for creating proxies for typed accessing services.
Decorators are based on <a href="https://github.com/anthrax63/moleculer-service-decorators">moleculer-service-decorators</a>, so you can find decorator's documentation there.

ServiceProxyFactory has simple interface with ony one method `create`. The method takes one argument - class definition. See example:

```typescript
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
```

Method `create` **does not create** the instance of derived service! It's just using class interface for know hot to call methods or fire events via broker. 

### Installation

* npm
  ```sh
  npm install moleculer-typed-proxy
  ```
* yarn
  ```sh
  yarn add moleculer-typed-proxy
  ```

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Write e2e tests
- [ ] Write more complex tests

See the [open issues](https://github.com/anthrax63/moleculer-typed-proxy/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Denis Bezrukov - [@DenisBezrukov](https://twitter.com/DenisBezrukov)

Project Link: [https://github.com/anthrax63/moleculer-typed-proxy](https://github.com/anthrax63/moleculer-typed-proxy)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/anthrax63/moleculer-typed-proxy.svg?style=for-the-badge
[contributors-url]: https://github.com/anthrax63/moleculer-typed-proxy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/anthrax63/moleculer-typed-proxy.svg?style=for-the-badge
[forks-url]: https://github.com/anthrax63/moleculer-typed-proxy/network/members
[stars-shield]: https://img.shields.io/github/stars/anthrax63/moleculer-typed-proxy.svg?style=for-the-badge
[stars-url]: https://github.com/anthrax63/moleculer-typed-proxy/stargazers
[issues-shield]: https://img.shields.io/github/issues/anthrax63/moleculer-typed-proxy.svg?style=for-the-badge
[issues-url]: https://github.com/anthrax63/moleculer-typed-proxy/issues
[license-shield]: https://img.shields.io/github/license/anthrax63/moleculer-typed-proxy.svg?style=for-the-badge
[license-url]: https://github.com/anthrax63/moleculer-typed-proxy/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/denis-v-bezrukov
[product-screenshot]: images/screenshot.png
