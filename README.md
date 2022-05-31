<h1 align="center">
    webpack-static-site-template
</h1>
<p align="center">
    <sup>Static site generation using Webpack.</sup>
</p>
<p align="center">
    
</p>

---

## Goals
- multi-page static site builder,
- TypeScript with modern JS features (ESNext)
- cleaner stylesheet writing with SCSS
- automatic minification and JS chunking


## Features
- Automatic page detection (practically no configuration).
- *HTML*: Renders at *build time* for static websites. Includes minification in production builds.
- *CSS*: [SCSS](https://sass-lang.com/) (or Sass) for stylesheet clarity and reuse. Includes minification in production builds.
- *JS*: [TypeScript](https://www.typescriptlang.org/) with support for the latest features (ESNext), compiled to ES5.
- *IMAGES and other ASSETS*: Automatically copied into the build when used in the source.
- *DEVELOPMENT*: Live browser reload when developing.

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


### 2.1. Structure
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
 |    - <page name>.html (the HTML of the static page)
 |    - index.ts/js (script entry point for this specific site)
 |  > You may of course want to add other files here, such as some 
 |    stylesheets (`sample.scss`) and import them from the HTML.
 |  > See src/pages/README.md for more info.
 |
 |
 |- styles
 |  > Place your global stylesheets here!
 |  >
 |  > Depending on the project, you will likely have some shared page styles, which
 |    can reside here. Each page that wants to use the global styles should link to 
 |    the `main.scss` file (see src/pages/README.md or the example pages).
```
