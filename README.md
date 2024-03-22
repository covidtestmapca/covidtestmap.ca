# CovidTestMap.ca

Source code of [covidtestmap.ca].

[covidtestmap.ca]: https://covidtestmap.ca

## Table of Content

- [Table of Content](#table-of-content)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Background](#background)
  - [Previewing Locally](#previewing-locally)
- [License](#license)
  - [Source Code](#source-code)
  - [Iconography](#iconography)
  - [Third-party content](#third-party-content)

# Contributing

## Requirements

- Node.js 14+

## Getting Started

### Background

CovidTestMap.org is a static website, built with [Eleventy] and hosted on Github
pages.

[`src/_data/`] stores information about test providers.

[Eleventy]: https://www.11ty.dev/
[`src/_data/`]: src/_data/

### Previewing Locally

1. Clone the project
2. Run `npm install`
3. Run `npx @11ty/eleventy --serve` to start previewing the website locally.

## License

### Source Code

CovidTestMap.org's source code is licensed under the terms of the
GNU Public License v3.0.

See [LICENSE.GPL-3] for more information.

### Iconography

CovidTestMap.org's visual identity (`src/assets/images/ctm`), is licensed under
the terms of the CC-BY-SA-4.0 license, see [LICENSE.CC-BY-SA-4] for more
information.

### Third-party content

- Icons from `src/assets/images/vendor/iconoir` come from
  [Iconoir], licensed under the terms of the [MIT license]
- Other icons from `src/assets/images/vendor` are licensed by third parties.

- Content from `src/_data_` is publicly available data.

[Iconoir]: https://iconoir.com
[MIT license]: https://github.com/iconoir-icons/iconoir/blob/v7.5.0/LICENSE
[LICENSE.GPL-3]: LICENSE.GPL-3
[LICENSE.CC-BY-SA-4]: LICENSE.CC-BY-SA-4
