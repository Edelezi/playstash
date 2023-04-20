module.exports = {
    plugins: ['stylelint-order', 'stylelint-scss'],
    rules: {
        'order/properties-alphabetical-order': null,
    },
    overrides: [
        {
            files: ['**/*.{css,scss}'],
            customSyntax: 'postcss-scss',
        },
        // {
        //     files: ['**/*.{jsx,tsx}'],
        //     customSyntax: '@stylelint/postcss-css-in-js',
        // },
    ],
};
