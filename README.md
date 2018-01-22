## validation-operator
[![Build Status](https://travis-ci.org/rafaelkallis/validation-operator.svg?branch=master)](https://travis-ci.org/rafaelkallis/validation-operator)
[![npm version](https://badge.fury.io/js/validation-operator.svg)](https://badge.fury.io/js/validation-operator)
[![GitHub version](https://badge.fury.io/gh/rafaelkallis%2Fvalidation-operator.svg)](https://badge.fury.io/gh/rafaelkallis%2Fvalidation-operator)

Higher-Order runtime validation for parameter and return values.

- Parameter validation enhancer
- Result validation enhancer
- Joi and ajv json schema supported
- Use with `compose` for better readability
- Typescript definitions included

### Usage

#### Installation

```bash
npm install --save validation-operator
# or
yarn add validation-operator
```

#### Example 1 (parameter validation with json schema)

```js
const { validateParams } = require("validation-operator/ajv");
const db = require("./db");

const userRepository = {
    create: validateParams({ 
            type: "object",
            properties: {
                username: { type: "string" },
                password: { type: "string" },
            },
            required: ["username", "password"],
        })(({ username, password }) => {
                /* username and password validated */
                return db.create({ username, password });
            }),
};

const user = userRepository.create({ username: "foo", password: "bar" });
```

#### Example 2 (parameter validation with Joi)

```js
const { validateParams } = require("validation-operator/joi");
const db = require("./db");

const userRepository = {
    create: validateParams(Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }))(({ username, password }) => {
                /* username and password validated */
                return db.create({ username, password });
            }),
};

const user = userRepository.create({ username: "foo", password: "bar" });
```

#### Example 3 (multiple parameter validation with Joi or json schema)

```js
const { validateParams } = require("validation-operator/joi");
const db = require("./db");

const userRepository = {
    create: validateParams(
            Joi.string().required(),
            Joi.string().required(),
        )((username, password) => {
            /* username and password validated */
            return db.create({ username, password });
        }),
};

const user = userRepository.create("foo", "bar");
```

#### Example 4 (result validation with Joi or json schema)

```js
const { validateResult } = require("validation-operator/ajv");
const db = require("./db");

const userRepository = {
    findById: validateResults({ 
                type: "object",
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    password: { type: "string" },
                },
                required: ["id", "username", "password"],
            }
        )((_id) => {
            return db.find({ _id });
        }),
};

const user = userRepository.findById("xxxxxx");
/* user validated */
```

#### Example 5 (Typescript)

```ts
import { validateResult } from "validation-operator/ajv";
import db from "./db";

interface User {
    username: string,
    password: string,
}

interface UserRepository {
    findById(_id: string): User
}

const userRepository: UserRepository = {
    findById: validateResults<(_id: string) => User>({ 
                type: "object",
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    password: { type: "string" },
                },
                required: ["id", "username", "password"],
            }
        )((_id) => {
            return db.find({ _id });
        }),
};

const user: User = userRepository.findById("xxxxxx");
/* user validated */
```

#### Example 6 (usage with compose)

```js
const { validateParams, ValidateResult } = require("validation-operator/joi");
const db = require("./db");

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const userRepository = {
    create: compose(
            validateParams(
                Joi.string().required(),
                Joi.string().required(),
            ),
            validateResult(
                Joi.object({
                    id: Joi.string().required(),
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                })
            ),
        )((username, password) => {
            /* username and password validated */
            return db.create({ username, password });
        }),
};

const user = userRepository.create("foo", "bar");
/* user validated */
```

