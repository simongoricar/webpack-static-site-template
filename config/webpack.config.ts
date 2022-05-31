const HtmlWebpackPlugin = require("html-webpack-plugin");

const fs = require("node:fs");
const path = require("node:path");

const babelConfig = require("../babel.config");

/*
 * CONSTANTS AND TYPES
 */
const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

interface Page {
    name: string,
    entryScript: string | null,
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

    // Ignore directories that start with . or _
    if (pageName.startsWith(".") || pageName.startsWith("_")) {
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

    let entryScript: string | null = null;
    if (hasJS) {
        entryScript = path.join(fullDirectoryPath, "index.js");
    } else if (hasTS) {
        entryScript = path.join(fullDirectoryPath, "index.ts");
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
    // Script entry per-page
    if (page.entryScript !== null) {
        webpackEntryMap[page.name] = {
            "import": page.entryScript,
            "filename": `scripts/${page.name}.js`,
        };
    }
});

const webpackPlugins: any[] = pages.map((page: Page) => {
    // HTML entry per-page (with automatically injected page-specific script chunk if available)
    return new HtmlWebpackPlugin({
        filename: `${page.name}.html`,
        template: path.join(pagesBasePath, page.name, `${page.name}.html`),
        inject: "head",
        chunks: page.entryScript !== null ? [page.name] : []
    });
});


const config = {
    mode: IS_PRODUCTION ? "production" : "development",
    entry: {
        ...webpackEntryMap,
    },
    plugins: [
        ...webpackPlugins,
    ],
    output: {
        filename: "[name]-[hash][ext]",
        clean: true,
        assetModuleFilename: "./assets/[name]-[hash][ext]",
    },
    module: {
        rules: [
            /*
             * The following rule takes care of emiting CSS files or hot-loading them when developing.
             */
            ...(
              IS_PRODUCTION ? [
                  {
                      test: /\.s[ac]ss$/i,
                      // Emits the CSS file
                      type: "asset/resource",
                      generator: {
                          filename: "./styles/[name]-[hash].css"
                      }
                  }
              ] : [
                  {
                      test: /\.s[ac]ss$/i,
                      use: [
                          "style-loader",
                          "css-loader"
                      ]
                  }
              ]
            ),
            /*
             * The following rule converts SCSS/Sass to CSS.
             */
            {
                test: /\.s[ac]ss$/i,
                use: [
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
            /*
             * The following rule uses Babel to convert modern JS syntax to ES5.
             */
            {
                test: /\.(js|ts|jsx|tsx)/i,
                include: path.resolve("src"),
                loader: "babel-loader",
                options: babelConfig,
            },
            /*
             * The following rule emits any used images into the build folder.
             */
            {
                test: /\.(jpg|jpeg|png|webp|gif|svg)/i,
                type: "asset/resource",
                generator: {
                    filename: "./assets/images/[name]-[hash][ext]"
                }
            },
            /*
             * This rule parses HTML files and makes sure any <link>/<script>/... tags are properly parsed.
             */
            {
                test: /\.html$/i,
                loader: "html-loader"
            }
        ]
    },
};

module.exports = config;
