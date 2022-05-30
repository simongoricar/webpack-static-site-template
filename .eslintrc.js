module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "import",
        "react"
    ],
    env: {
        browser: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb-typescript"
    ],
    parserOptions: {
        project: "./tsconfig.json"
    },
    rules: {
        "no-console": "off",
        indent: ["error", 4],
        "@typescript-eslint/indent": "off",
        quotes: ["error", "double"],
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "max-len": ["error", { comments: 120, code: 90 }],
    },
    overrides: [
        {
            files: ["config/**/*.js"],
            rules: {
                "import/no-extraneous-dependencies": "off",
                "no-param-reassign": "off",
                "@typescript-eslint/no-var-requires": "off",
            }
        }
    ]
};
