# UPS Status 🔌 for Node JS
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](#)
[![Twitter: hyperlink](https://img.shields.io/twitter/follow/hyperlink.svg?style=social)](https://twitter.com/hyperlink)

Node.Js API to get status of UPS connected to your MacOS

## Install

```sh
npm install @hyperlink/ups-status
```

## Usage

Two different ways to use this module. You can Promise interface or EventEmitter interface.

### Promise interface

```js
import { isOnBattery, isOnAc } from '@hyperlink/ups-status';

// in some async function
if (await isOnBattery()) {
  console.log('Mac is running on Battery');
} else {
  console.log('Mac is on AC');
}

// or

// in some async function
if (await isOnAc()) {
  console.log('Mac is on AC');
  } else {
  console.log('Mac is running on Battery');
}
```

### EventEmitter interface.

`UpsEmitter` will emit `'ac'` event with `true` or `false` value when AC is connected or not.

```js
import { UpsEmitter } from '@hyperlink/ups-status';

const ups = new UpsEmitter();
ups.on('ac', isOnAc => console.log('computer is on ac:', isOnAc));
```


## Author

👤 **Xiaoxin Lu <javascript@yahoo.com>**

* Twitter: [@hyperlink](https://twitter.com/hyperlink)
* Github: [@hyperlink](https://github.com/hyperlink)

## Show your support

Give a ⭐️ if this project helped you!
