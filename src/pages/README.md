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
    |  |- index.html (must not import any SCSS)
    |  |- index.ts ("imports" index.scss and main.scss)
    |  |- index.scss
    |- sample
       |- sample.html (must not import any SCSS)
       |- index.ts ("imports" sample.scss and main.scss)
       |- sample.scss
```

---

#### HTML and scripts
> Notice how the HTML file must be named just like the directory (the page name), but the **script entry points must always be either `index.js` or `index.ts`**.
>
> Note that per-page entry scripts must NOT be linked (e.g. via a `<script>` tag) inside the HTML page! They are injected automatically, as are the stylesheets you import in the entry file (see page examples).

#### Stylesheets
> Stylesheets are written in [SCSS](https://sass-lang.com/documentation/syntax) for easier and cleaner code. You may of course opt to have page-specific stylesheets as in the example above (`index.scss` and `sample.scss`), but you're also free to have a single main stylesheet in the `styles` directory. The above example actually combines these two approaches, but adapt the techniques to your taste.
