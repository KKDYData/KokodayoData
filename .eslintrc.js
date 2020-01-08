module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        'plugin:vue/recommended'
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        parser: "babel-eslint",
    },
    plugins: [
        "vue"
    ],
    rules: {
        "no-console": "off",
        indent: [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        quotes: [
            "error",
            "single"
        ],
        semi: [
            "error",
            "never"
        ],
        "no-unused-vars": ["error", { "args": "none" }],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 6,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "vue/html-indent": 0,
        "vue/multiline-html-element-content-newline": 0,
        "vue/no-v-html": 0,
        "vue/singleline-html-element-content-newline": 0,
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "always",
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always",
        }]
    }
};
