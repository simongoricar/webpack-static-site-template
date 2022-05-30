const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("node:fs");
const path = require("node:path");

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
    const hasHtml: boolean = fs.existsSync(path.join(pagesBasePath, pageName, `${pageName}.html`));
    if (!hasHtml) {
        throw new Error(
          `Page error: expected directory src/pages/${pageName} to contain ${pageName}.html, but the file is missing!`
        );
    }

    const hasJS: boolean = fs.existsSync(path.join(pagesBasePath, pageName, "index.js"));
    const hasTS: boolean = fs.existsSync(path.join(pagesBasePath, pageName, "index.ts"));

    let entryScript: string;
    if (hasJS) {
        entryScript = path.join(pagesBasePath, pageName, "index.js");
    } else if (hasTS) {
        entryScript = path.join(pagesBasePath, pageName, "index.ts");
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
console.log("Pages to build: ");
pages.forEach((page: Page) => {
    console.log(" - " + page.name);
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
    mode: "development",
    entry: webpackEntryMap,
    plugins: webpackPlugins,
};

module.exports = config;
