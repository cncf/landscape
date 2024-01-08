# Cloud Native Landscape

![Cloud Native Landscape Logo](https://raw.githubusercontent.com/cncf/artwork/master/other/cncf-landscape/horizontal/color/cncf-landscape-horizontal-color.png)

The [CNCF](https://www.cncf.io) Cloud Native [Landscape](https://landscape.cncf.io) is intended as a map through the previously uncharted terrain of cloud native technologies. This attempts to categorize most of the projects and product offerings in the cloud native space. There are many routes to deploying a cloud native application, with CNCF Projects representing a particularly well-traveled path.

This repository contains the data files and images required to generate the [CNCF landscape](https://landscape.cncf.io). The software that generates it can be found at the [cncf/landscape2](https://github.com/cncf/landscape2) repository. Please see its [README file](https://github.com/cncf/landscape2#landscape2) for more information about how it works.

## New entries

To add a new entry to the landscape, please open a pull request to add it in alphabetical order to the [landscape.yml](landscape.yml) file. The logo must be added to the `hosted_logos` directory (in SVG format) and referenced from the `logo` field.

Before submitting a new entry it is important to review the following guidelines:

* [Cloud native](https://github.com/cncf/toc/blob/master/DEFINITION.md) projects with at least 300 GitHub stars that clearly fit in an existing category are generally included. Put the project in the single category where it best fits.
* We generally will only list a company's product in one box, to represent its major or best-known offering. We occasionally make exceptions for large companies. Note that if we allowed listing the same product or project in multiple boxes, the over +1k logos on the landscape would multiply to many times that many.
* We are unlikely to create a new category for products/projects as we'd rather find the best home with the current options.
* We are generally not including commercial versions of open source software. The exception is that we are showing all Certified Kubernetes implementations.
* Closed source products need to link to a clear description of your product; no stealth mode companies.
* Crunchbase organization should be the company or organization that controls the software. That is normally the owner of the trademark, whether or not a trademark has been formally filed.
* Your project or company needs a logo in SVG format:
  * Logos must include the company, product or project name in English. It's fine to also include words from another language.
  * Don't use reversed logos (i.e. with a non-white, non-transparent background color).
  * When multiple variants exist, use stacked (not horizontal) logos.

> [!NOTE]
> At the moment the landscape is generated daily, so once your PR is merged your changes should be visible before 24 hours.

## Corrections

If you find an error in the landscape, please open a pull request with the suggested changes to the [landscape.yml](landscape.yml) file. Some information displayed in the landscape is obtained from Crunchbase or GitHub, so errors on it should be fixed in the corresponding source.

## License

The generated landscape contains data received from [Crunchbase](http://www.crunchbase.com). This data is not licensed pursuant to the Apache License. It is subject to Crunchbase’s Data Access Terms, available at [https://data.crunchbase.com/docs/terms](https://data.crunchbase.com/docs/terms), and is only permitted to be used with Linux Foundation landscape projects.

Everything else is under the Apache License, Version 2.0, except for projects and products logos, which are generally copyrighted by the company that created them, and are simply cached here for reliability. The generated landscape and the [landscape.yml](landscape.yml) file are alternatively available under the [Creative Commons Attribution 4.0 license](https://creativecommons.org/licenses/by/4.0/).
