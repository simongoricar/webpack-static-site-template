Modules should contain mixins and other content, but do not actually output any styles when @use-d or @import-ed.

Module descriptions:
- `_animations.scss` contains a set of cubic béziers and a keyframe mixin for animation work,
- `_common.scss` contains some flex, sizing and positioning mixins, 
- `_media.scss` is an abstraction on top of [include-media](https://eduardoboucas.github.io/include-media/), a SCSS library for writing easy media queries. Includes options to set your breakpoints as well as adds several handy mixins that are active only on specific device sizes.
