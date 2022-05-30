## Pages
This directory should contain one subdirectory per each page you want to build.

Additionally, please follow the expected structure as in this example:
```md
src
 |- pages
    |- index
    |  |- index.html
    |  |- index.ts
    |- sample
       |- sample.html
       |- index.ts
```

Notice how the HTML file must be named just like the directory (the page name), but the **script entry points
must always be either `index.js` or `index.ts`**.
