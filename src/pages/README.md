## Pages
This directory should contain one subdirectory per each page you want to build.

Additionally, please follow the expected structure as in this example:
```md
src
 |- ...
 |- styles
 |  |- main.scss
 |  |- ...
 |- pages
    |- index
    |  |- index.html ("imports" index.scss and main.scss, but NOT index.ts!)
    |  |- index.ts
    |  |- index.scss
    |- sample
       |- sample.html ("imports" sample.scss and main.scss, but NOT index.ts!)
       |- index.ts
       |- sample.scss
```

---

#### HTML and scripts
> Notice how the HTML file must be named just like the directory (the page name), but the **script entry points
must always be either `index.js` or `index.ts`**.
>
> Note that per-page entry scripts must NOT be linked (e.g. via a `<script>` tag) inside the HTML page! They are injected automatically.

#### Stylesheets
> Stylesheets are written in [SCSS](https://sass-lang.com/documentation/syntax) for easier and cleaner code. You may of course opt to have page-specific stylesheets as in the example above (`index.scss` and `sample.scss`), but you're also free to have a single main stylesheet in the `styles` directory. The above example actually combines these two approaches, but adapt the techniques to your taste.

