import { Configuration, LoaderContext } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "node:fs";
import path from "node:path";

import { Environment, FileSystemLoader } from "nunjucks";

import babelConfig from "../babel.config";

/*
 * CONSTANTS AND TYPES
 */
const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";
console.log("Is production: " + IS_PRODUCTION);

const IS_ONE_SHOT_BUILD: boolean = process.env.IS_SINGLE_BUILD === "true";

const nunjucksTemplatePath = path.resolve("./src/templates");
const nunjucksEnv: Environment = new Environment(
  new FileSystemLoader(nunjucksTemplatePath, { watch: !IS_ONE_SHOT_BUILD, noCache: false })
);

interface Page {
    name: string,
    htmlPath: string,
    entryScriptPath: string | null,
}

/*
 * Resolve all available pages.
 */
const pagesBasePath: string = path.resolve(path.join(__dirname, "../src/pages/"));
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

    const nunjucksPath = path.join(fullDirectoryPath, `${pageName}.njk`);
    const htmlPath = path.join(fullDirectoryPath, `${pageName}.html`);

    const hasNunjucks: boolean = fs.existsSync(nunjucksPath);
    const hasHtml: boolean = fs.existsSync(htmlPath);

    let entryHtmlPath: string;

    if (hasNunjucks && hasHtml) {
        throw new Error(
          `Page error: expected directory src/pages/${pageName} either ${pageName}.html or ${pageName}.njk, found both!`
        );
    } else if (hasNunjucks) {
        entryHtmlPath = nunjucksPath;
    } else if (hasHtml) {
        entryHtmlPath = htmlPath;
    } else {
        throw new Error(
          `Page error: expected directory src/pages/${pageName} to contain ${pageName}.html, but the file is missing!`
        );
    }

    const jsPath = path.join(fullDirectoryPath, "index.js");
    const tsPath = path.join(fullDirectoryPath, "index.ts");

    const hasJS: boolean = fs.existsSync(jsPath);
    const hasTS: boolean = fs.existsSync(tsPath);

    let entryScriptPath: string | null;

    if (hasJS) {
        entryScriptPath = path.join(fullDirectoryPath, "index.js");
    } else if (hasTS) {
        entryScriptPath = path.join(fullDirectoryPath, "index.ts");
    } else {
        entryScriptPath = null;
    }

    pages.push({
        name: pageName,
        htmlPath: entryHtmlPath,
        entryScriptPath
    });
});

// Log pages for comfort.
console.log("Detected pages: ");
pages.forEach((page: Page) => {
    let entryInfo: string = "";
    if (page.entryScriptPath !== null) {
        entryInfo = `script entry: ${path.basename(page.entryScriptPath)}`;
    }

    console.log(
      ` - ${page.name} (${entryInfo})`
    );
});
console.log();

/*
 * Generate the Webpack configuration.
 */
const webpackEntryMap: Record<string, any> = {};
pages.forEach((page: Page) => {
    // Script entry per-page
    if (page.entryScriptPath !== null) {
        webpackEntryMap[page.name] = {
            "import": page.entryScriptPath,
            "filename": `scripts/${page.name}-[hash].js`,
        };
    }
});

const webpackPlugins: any[] = pages.map((page: Page) => {
    // HTML entry per-page (with automatically injected page-specific script chunk if available)
    return new HtmlWebpackPlugin({
        filename: `${page.name}.html`,
        template: page.htmlPath,
        inject: "head",
        chunks: page.entryScriptPath !== null ? [page.name] : []
    });
});


const config: Configuration & Record<string, any> = {
    mode: IS_PRODUCTION ? "production" : "development",
    entry: {
        ...webpackEntryMap,
    },
    plugins: [
        ...webpackPlugins,
        new MiniCssExtractPlugin({
            filename: IS_PRODUCTION ? "./styles/[name]-[hash].css" : "./styles/[name].css",
            chunkFilename: IS_PRODUCTION ? "./styles/[name]-[hash].css" : "./styles/[name].css",
        }),
    ],
    output: {
        filename: "[name]-[hash].js",
        clean: true,
        assetModuleFilename: "./assets/[name]-[hash][ext]",
    },
    devtool: IS_PRODUCTION ? "nosources-source-map" : "eval-source-map",
    devServer: {
        hot: true,
        liveReload: true,
        watchFiles: ["src/**/*"],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // This option ensures the shared stylesheet has its own chunk that is shared between pages.
                siteStyles: {
                    name: "site",
                    test: /src[\\/]styles[\\/]/i,
                    chunks: "all",
                    minSize: 0,
                }
            }
        }
    },
    module: {
        rules: [
            /*
             * The following rule takes care of emiting CSS files or hot-loading them when developing.
             */
            {
                test: /\.s[ac]ss$/i,
                use: [
                    IS_PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
                    // MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: !IS_PRODUCTION,
                            sassOptions: {
                                outputStyle: IS_PRODUCTION ? "compressed" : "expanded"
                            }
                        }
                    }
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
            },
            {
                test: /\.njk$/i,
                loader: "html-loader",
                options: {
                    preprocessor: (content: string | Buffer, context: LoaderContext<unknown>) => {
                        let rawContent: string;
                        if (typeof content === "string") {
                            rawContent = content;
                        } else {
                            rawContent = content.toString("utf-8");
                        }

                        try {
                            return nunjucksEnv.renderString(rawContent, {});
                        } catch (err) {
                            // @ts-ignore
                            context.emitError(err);
                        }
                    },
                }
            }
        ]
    },
};

module.exports = config;
