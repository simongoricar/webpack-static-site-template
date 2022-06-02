<h1 align="center">
    webpack-static-site-template
</h1>
<p align="center">
    <sup>Static multipage site generation using Webpack.</sup>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-yellowgreen" alt="MIT license">
    <img src="https://img.shields.io/badge/webpack-%5E5.72.1-6ba7d6?logo=webpack&logoColor=white" alt="Webpack ^5.72.1">
</p>

---

## Goals
- multipage static site builder,
- write normal HTML for smaller sites, but with the ability to use [Nunjucks](https://mozilla.github.io/nunjucks/) templating for more complex tasks,
- write [TypeScript](https://www.typescriptlang.org/) for type-safety with modern JS features (ESNext),
- cleaner stylesheet writing with [SCSS/Sass](https://sass-lang.com/),
- automatic minification in production builds.


## Features
- *General*: Automatic page detection (practically no configuration, just a matter of creating a directory inside `src/pages` and creating relevant files).
- *HTML*: Support for both normal HTML (`.html`) and [Nunjucks](https://mozilla.github.io/nunjucks/) templating (`.njk` extension). Renders at *build time*, includes HTML minification in production builds.
- *CSS*: [SCSS](https://sass-lang.com/) (or Sass) for stylesheet clarity and reuse. Includes minification in production builds.
- *JS*: [TypeScript](https://www.typescriptlang.org/) with support for the latest features (ESNext), compiled to ES5.
- *IMAGES and other ASSETS*: Automatically copied into and linked from build directory when used in source.
- *DEVELOPMENT*: Live browser reload when developing,
- *LINTING*: for consistent code style there's support for TypeScript linting via [eslint](https://eslint.org/) and SCSS linting via [Stylelint](https://stylelint.io/).

---

## 1. Installation
To get started *fork*, *clone* or *download* the repository.

#### Cloning or downloading
In order to clone this repository, run the command below or use the download button.
```
git clone https://github.com/DefaultSimon/webpack-static-site-template.git
```

If you intend to push changes to your site to your own repository though, you'll have to update the remote in your clone (which forking already does for you). For further help, see [this article](https://help.github.com/en/articles/cloning-a-repository).

#### Forking
Forking makes a copy of this repository which is then available as your own repository in your profile. Click the *Fork* button or see help [here](https://help.github.com/en/articles/fork-a-repo).

---

## 2. Usage
This project uses [Yarn](https://yarnpkg.com/) as the package manager. Follow the instructions on the provided link if you haven't installed it before. When done, run `yarn install` to install all dependencies.

Familiarize yourself with the template by looking at the documentation below and varioud READMEs around the project.
When you've looked around feel free to, if need be, start to customize the Webpack configuration, which is available in `config/webpack.config.ts`.

### 2.1 Development server
To start the development server (live reload of changes), run `yarn dev` (or `yarn dev --open` to open the webpage automatically).

### 2.2 Production builds
To build a production version of the site, run `yarn build`. The resulting site will be available in the `dist` directory.

---

## 3. Structure
The project structure is as follows:

```markdown
src
 |- assets
 |  > Place your own assets (images, JSON, etc.) in any way you want here!
 |  > 
 |  > When you want to use the images for example, simply refer to them from the 
 |    HTML file or TypeScript, like so:
 |  >  HTML:  <img src="../../assets/images/someimage.png" alt="Some image.">
 |  >    TS:  import someImage from "../../assets/images/someimage.png"
 |  >
 |  > In the case of HTML the src attribute will be replaced with the correct url of 
 |    the image in the final bundle. In the case of TypeScript the someImage variable 
 |    you import will actually contain just the path to the final image, which you may 
 |    use to dynamically set img.src, etc.
 |
 |
 |- pages
 |  > Place your pages here!
 |  > 
 |  > The structure should be: one directory per page 
 |    (directory name == page name), each one containing at least:
 |    - <page name>.html/njk (the HTML of the static page)
 |    - index.ts/js (script entry point for this specific site)
 |  >
 |  > When using the .njk extension, the file will be processed for Nunjucks templating.
 |  >
 |  > You may of course want to add other files here, such as some 
 |    stylesheets (`sample.scss`) and import them. However:
 |  > When wanting to use for example the global stylesheet (from src/styles) in your
      page, you can "import" it in your page's entry script like so:
 |  >     import "../../styles/main.scss"
 |  >
 |  > NOTE: You should not import any stylesheets inside the HTML/NJK file, because the
 |    development live-reload version will break.
 |  >
 |  > See src/pages/README.md for more info.
 |
 |- styles
 |  > Place your global stylesheets here!
 |  >
 |  > Depending on the project, you will likely have some shared page styles, which
 |    can reside here. Each page that wants to use the global styles should link to 
 |    the `main.scss` file (see src/pages/README.md or the example pages).
 |  > A good starting point is already available, but you may opt to use 
 |    nothing or remove individual parts of the prepared stylesheet template - see below.
```

### 3.1 HTML: Nunjucks
> [**Nunjucks**](https://mozilla.github.io/nunjucks/) is a powerful templating engine built by Mozilla. The syntax is similar to (and inspired by) Python's jinja2.
For more on templating using Nunjucks, read [**Nunjucks' documentation**](https://mozilla.github.io/nunjucks/templating.html).

If your page files have the `.njk` extension, webpack will automatically run them through Nunjucks. If you wish to use some templates via e.g. `{% extend "base.njk" %}`, you may add those templates into the `src/templates` directory and refrer to them in your pages directly (meaning `base.njk`, not `../templates/base.njk`).

### 3.2 Stylesheets: SCSS or Sass
> **SCSS** is a stylesheet language that compiles to CSS. This template uses the [Dart Sass](https://sass-lang.com) compiler, which should generally have the latest SCSS features.

Stylesheets are intended to be written in [SCSS](https://sass-lang.com/documentation/syntax) for easier and cleaner code. You may of course opt to have page-specific stylesheets as in the example (`index.scss` and `sample.scss`), but you're also free to have a single main stylesheet in the `styles` directory. The example pages actually combine these two approaches, but adapt the techniques to your taste. Just make sure that your individual page scripts import the stylesheets you want the page to use (see page examples).

This project includes several small libraries as a starting point:
- [**normalize.css**](https://necolas.github.io/normalize.css/) for a consistent base across browsers,
- [**pure.css**](https://purecss.io/) as the style foundation,
- [**include-media**](https://eduardoboucas.github.io/include-media/) as the SCSS library for @media queries. Reasonable breakpoints were set with help from [a bunch](https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/) [of](https://flaviocopes.com/css-breakpoints/) [articles](https://howto-wordpress-tips.com/responsive-breakpoints-tutorial/) [and frameworks](https://polypane.app/blog/css-breakpoints-used-by-popular-css-frameworks/) and packed into the `modules/_media.scss` module with shorthands for easy work,
- **Bones**, a personal set of very common rules compacted into mixins and CSS classes. Short documentation is available in `sample.njk`/`sample.html` and the source is available at `src/styles/vendor/bones`.
- A variety of basic sizing, animation-related and other mixins to get you started, available in `src/scss/modules`.
- `rem` units scaled to `10px` (`62.5%`, adjusted in `src/styles/ventor/bones/_bones.scss`).

The larger modules are located in `src/styles/vendor` and can be easily removed if you do not need them for your project by deleting the relevant directory and removing the import in `main.scss`.

---

## 4. Quirks and known issues
Issues / Pull requests regarding these quirks are most welcome.

- Sometimes the initial page load after `yarn dev --open` looks incorrect; simply refresh the page once.
- (S)CSS must not be imported directly from HTML/Nunjucks files, but from `.ts`/`.js` instead. 
  If you break this quirk, the production build will still be fine, however the development builds will break. 
  This seems to be due to the `html-loader` not being able to change `<link>` tags into `<script>` tags 
  for hot-reload in development builds.
