const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const fs = require("node:fs");
const path = require("node:path");

const babelConfig = require("../babel.config");

/*
 * CONSTANTS AND TYPES
 */
const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

interface Page {
    name: string,
    entryScript: string,
}

/*
 * Resolve all available pages.
 */
const pagesBasePath: string = path.resolve("./src/pages/");
const pages: Page[] = [];

const pageNameList: string[] = fs.readdirSync(pagesBasePath);
pageNameList.forEach((pageName: string) => {
    const fullDirectoryPath = path.join(pagesBasePath, pageName);

    // Ignore normal files in the "pages" directory.
    if (!fs.lstatSync(fullDirectoryPath).isDirectory()) {
        return;
    }

    const hasHtml: boolean = fs.existsSync(path.join(fullDirectoryPath, `${pageName}.html`));
    if (!hasHtml) {
        throw new Error(
          `Page error: expected directory src/pages/${pageName} to contain ${pageName}.html, but the file is missing!`
        );
    }

    const hasJS: boolean = fs.existsSync(path.join(fullDirectoryPath, "index.js"));
    const hasTS: boolean = fs.existsSync(path.join(fullDirectoryPath, "index.ts"));

    let entryScript: string;
    if (hasJS) {
        entryScript = path.join(fullDirectoryPath, "index.js");
    } else if (hasTS) {
        entryScript = path.join(fullDirectoryPath, "index.ts");
    } else {
        throw new Error(
          `Page error: expected directory src/pages/${pageName} to contain either index.js or index.ts, found neither!`
        );
    }

    pages.push({
        name: pageName,
        entryScript
    });
});

// Log pages for comfort.
console.log("Detected pages: ");
pages.forEach((page: Page) => {
    console.log(` - ${page.name} (script entry point: ${path.basename(page.entryScript)})`);
});
console.log();

/*
 * Generate the Webpack configuration.
 */
const webpackEntryMap: Record<string, any> = {};
pages.forEach((page: Page) => {
    webpackEntryMap[page.name] = {
        "import": page.entryScript,
        "filename": `${page.name}.js`,
    };
});

const webpackPlugins: any[] = pages.map((page: Page) => {
    return new HtmlWebpackPlugin({
        filename: `${page.name}.html`,
        template: path.join(pagesBasePath, page.name, `${page.name}.html`),
        inject: "head",
        chunks: [page.name]
    });
})


const config = {
    mode: IS_PRODUCTION ? "production" : "development",
    entry: webpackEntryMap,
    plugins: [
      ...webpackPlugins,
      new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css",
      }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    IS_PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: !IS_PRODUCTION
                        }
                    },
                ],
            },
            {
                test: /\.(js|ts|jsx|tsx)/i,
                loader: "babel-loader",
                options: babelConfig,
            },
        ]
    }
};

module.exports = config;
