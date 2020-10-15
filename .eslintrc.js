module.exports = {
    "env": {
        "commonjs": true,
        "es2020": true,
        "node": true
    },
    "extends": [
        "google",
        "plugin:prettier/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "prettier/prettier": [
            "error",
            {
                "bracketSpacing": true,
                "semi": true,
                "singleQuote": true
            }
        ]
    }
};