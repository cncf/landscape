[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1767/badge)](https://bestpractices.coreinfrastructure.org/projects/1767)

# Cloud Native Landscape

![Cloud Native Landscape Logo](https://raw.githubusercontent.com/cncf/artwork/master/other/cncf-landscape/horizontal/color/cncf-landscape-horizontal-color.png)

- [Cloud Native Landscape](#cloud-native-landscape)
  * [Trail Map](#trail-map)
  * [Current Version](#current-version)
  * [Interactive Version](#interactive-version)
  * [Serverless](#serverless)
  * [New Entries](#new-entries)
  * [Logos](#logos)
  * [Proper SVGs](#proper-svgs)
  * [Corrections](#corrections)
  * [External Data](#external-data)
  * [Best Practices Badge](#best-practices-badge)
  * [Non-Updated Items](#non-updated-items)
  * [License](#license)
  * [Formats](#formats)
  * [Installation](#installation)
  * [Vulnerability reporting](#vulnerability-reporting)
  * [Adjusting the Landscape View](#adjusting-the-landscape-view)

The [CNCF](https://www.cncf.io) Cloud Native Landscape Project is intended as a map through the previously uncharted terrain of cloud native technologies. This attempts to categorize most of the projects and product offerings in the cloud native space. There are many routes to deploying a cloud native application, with CNCF Projects representing a particularly well-traveled path. It has been built in collaboration with [Redpoint Ventures](https://www.redpoint.com/) and [Amplify Partners](http://www.amplifypartners.com/).

## Trail Map

The Cloud Native Trail Map provides an overview for enterprises starting their cloud native journey.

[![CNCF Landscape](trail_map/CNCF_TrailMap_latest.png)](https://raw.githubusercontent.com/cncf/landscape/master/trail_map/CNCF_TrailMap_latest.png)

## Current Version

[![CNCF Landscape](https://landscape.cncf.io/images/landscape.png)](https://landscape.cncf.io/images/landscape.png)

## Interactive Version

Please see [landscape.cncf.io](https://landscape.cncf.io).

## Serverless

[![CNCF Serverless Landscape](https://landscape.cncf.io/images/serverless.png)](https://landscape.cncf.io/images/serverless.png)

## New Entries

* Projects with at least 250 GitHub stars that clearly fit in an existing category are generally included. Put the project in the single category where it best fits.
* We generally will only list a company's product in one box, to represent its major or best-known offering. We occasionally make exceptions for large companies.
* We are unlikely to create a new category for products/projects as we'd rather find the best home with the current options.
* We are generally not including commercial versions of open source software. The exception is that we are showing all Certified Kubernetes and non-Certified Kubernetes implementations.
* Closed source products need to link to a clear description of your product; no stealth mode companies.
* Your project or company needs a logo and the logo needs to include the name.

If you think your company or project should be included, please open a pull request to add it to [landscape.yml](landscape.yml). For the logo, you can either upload an SVG to the `hosted_logos` directory or put a URL as the value, and it will be fetched.

Netlify will generate a staging server for you to preview your updates. Please check that the logo and information appear correctly and then add `LGTM` to the pull request confirming your review and requesting a merge.

## Logos

The following rules will produce the most readable and attractive logos:

1. We require SVGs, as they are smaller, display correctly at any scale, and work on all modern browsers. If you only have the logo in another vector format (like AI or EPS), please open an issue and we'll convert it to an SVG for you, or you can often do it yourself at https://cloudconvert.com/. Note that you may need to zip your file to attach it to a GitHub issue. Please note that we require pure SVGs and will reject SVGs that contain embedded PNGs or, since they have the same problems of being bigger and not scaling seamlessly. We also require that SVGs convert fonts to outlines so that they will render correctly whether or not a font is installed. See [Proper SVGs](#proper-svgs) below.
1. When multiple variants exist, use stacked (not horizontal) logos. For example, we use the second column (stacked), not the first (horizontal), of CNCF project [logos](https://github.com/cncf/artwork/#cncf-incubating-logos).
1. Don't use reversed logos (i.e., with a non-white, non-transparent background color). If you only have a reversed logo, create an issue with it attached and we'll produce a non-reversed version for you.
1. Logos must include the company, product or project name in English. It's fine to also include words from another language. If you don't have a version of your logo with the name in it, please open an issue and we'll create one for you (and please specify the font).
1. Match the item name to the English words in the logos. So an Acme Rocket logo that shows "Rocket" should have product name "Rocket", while if the logo shows "Acme Rocket", the product name should be "Acme Rocket". Otherwise, logos looks out of place when you sort alphabetically.
1. Google images is often the best way to find a good version of the logo (but ensure it's the up-to-date version). Search for [grpc logo filetype:svg](https://www.google.com/search?q=grpc+logo&tbs=ift:svg,imgo:1&tbm=isch) but substitute your project or product name for grpc.
1. You can either upload an SVG to the `hosted_logos` directory or put a URL as the value, and it will be fetched.

## Proper SVGs

SVGs need to not rely on external fonts so that they will render correctly in any web browser, whether or not the correct fonts are installed. If you have the original AI file, here are the steps in Illustrator to create a proper SVG:

1. Open file in Illustrator
1. Select all text
1. With the text selected, go to Object > Expand in the top menu
1. Export file by going to File > Export > Export As in top menu
1. Select SVG from the format drop down and make sure that "Use Artboards" is checked
1. This will open a SVG options box, make sure to set Decimal to 5 (that is the highest possible, so to ensure that sufficient detail is preserved)
1. Click Okay to export

## Corrections

Please open a pull request with edits to [landscape.yml](landscape.yml). The file [processed_landscape.yml](processed_landscape.yml) is generated and so should never be edited directly.

If the error is with data from [Crunchbase](https://www.crunchbase.com/) you should open an account there and edit the data. If you don't like a project description, edit it in GitHub. If your project isn't showing the license correctly, you may need to paste the unmodified text of the license into a LICENSE file at the root of your project in GitHub, in order for GitHub to serve the license information correctly.

## External Data

The canonical source for all data is [landscape.yml](landscape.yml). Once a day, we download data for projects and companies from the following sources:

* Project info from GitHub
* Funding info from [Crunchbase](https://www.crunchbase.com/)
* Market cap data from Yahoo Finance
* CII Best Practices Badge [data](https://bestpractices.coreinfrastructure.org/)

The update server enhances the source data with the fetched data and saves the result in [processed_landscape.yml](processed_landscape.yml) and as a JSON [file](https://github.com/cncf/landscape/blob/master/src/data.json), the latter of which is what the app loads to display data.

## Best Practices Badge

As explained at https://bestpractices.coreinfrastructure.org/:
>The Linux Foundation (LF) Core Infrastructure Initiative (CII) Best Practices badge is a way for Free/Libre and Open Source Software (FLOSS) projects to show that they follow best practices. Projects can voluntarily self-certify, at no cost, by using this web application to explain how they follow each best practice. The CII Best Practices Badge is inspired by the many badges available to projects on GitHub. Consumers of the badge can quickly assess which FLOSS projects are following best practices and as a result are more likely to produce higher-quality secure software.

The interactive landscape displays the status (or non-existence) of a badge for each open-source project. There's also a feature not available through the filter bar to see all items [with](https://landscape.cncf.io/bestpractices=yes) and [without](https://landscape.cncf.io/bestpractices=no) badges. Note that a passing badge is a requirement for projects to [graduate](https://www.cncf.io/projects/graduation-criteria/) in the CNCF.

## Non-Updated Items

We generally remove open source projects that have not had a commit in over 3 months. Note that for projects not hosted on GitHub, we need them to mirror to GitHub to fetch updates, and we try to work with projects when their mirrors are broken. Here is view of projects sorted by last update: https://landscape.cncf.io/grouping=no&license=open-source&sort=latest-commit

We generally remove closed source products when they have not tweeted in over 3 months. This doesn't apply to Chinese companies without Twitter accounts, since Twitter is blocked there. Here is a view of products sorted by last tweet: https://landscape.cncf.io/grouping=no&license=not-open-source&sort=latest-tweet

Items that have been removed can apply to be re-added using the regular New Entries criteria above.

## License

This repository contains data received from [Crunchbase](http://www.crunchbase.com). This data is not licensed pursuant to the Apache License. It is subject to Crunchbase’s Data Access Terms, available at [https://data.crunchbase.com/v3.1/docs/terms](https://data.crunchbase.com/v3.1/docs/terms), and is only permitted to be used with this CNCF Cloud Native Landscape Project.

Everything else is under the Apache License, Version 2.0, except for project and product logos, which are generally copyrighted by the company that created them, and are simply cached here for reliability. The trail map, static landscape, serverless landscape, and [landscape.yml](landscape.yml) file are alternatively available under the [Creative Commons Attribution 4.0 license](https://creativecommons.org/licenses/by/4.0/).

## Formats

The CNCF Trail Map is available in these formats:

* [PNG](trail_map/CNCF_TrailMap_latest.png)
* [PDF](trail_map/CNCF_TrailMap_latest.pdf)
* [Adobe Illustrator](trail_map/CNCF_TrailMap_latest.ai)

The CNCF Cloud Native Landscape is available in these formats:

* [PNG](https://landscape.cncf.io/images/landscape.png)
* [PDF](https://landscape.cncf.io/images/landscape.pdf)

The CNCF Serverless Landscape is available in these formats:

* [PNG](https://landscape.cncf.io/images/serverless.png)
* [PDF](https://landscape.cncf.io/images/serverless.pdf)

## Installation

You can install and run locally with the [install directions](INSTALL.md). It's not necessary to install locally if you just want to edit [landscape.yml](landscape.yml). You can do so via the GitHub web interface.

## Vulnerability reporting

Please open an [issue](https://github.com/cncf/landscape/issues/new) or, for sensitive information, email info@cncf.io.

## Adjusting the Landscape View
The file src/components/MainContent2.js describes the key elements of a
landscape big picture. It specifies where to put these sections: App Definition
and Development, Orchesteration & Management, Runtime,  Provisioning, Cloud,
    Platform, Observability and Analyzis, Special. Also it specifies where to
    locate the link to the serverless preview and an info with a QR code.

All these elements should have `top`, `left`, `width` and `height` properties to
position them. `rows` and `cols` specify how much columns or rows we expect in a
given horizontal or vertical section. 

When we see that those elements can not fit the sections, we need to either increase
the width of all the horizontal sections, or increase height and amount of rows
in a single horitzontal section and adjust the position of sections below.

Beside that, we have to adjust the width of a parent div (1620), the width in a
`src/components/BigPicture/FullscreenLandscape.js` (1640) and the width in a
`tools/renderLandscape.js` (6560, because of x4 zoom and margins)

Serverless has a same approach, files are
`src/components/BigPicture/ServerlessContent.js`,
  `src/components/BigPicture/FullscreenServerless.js` and
  `tools/renderLandscape.js`, with a full width of 3450 (because of x3 zoom and
      margins)

Sometimes the total height is changed too, then we need to adjust the height the
same way as we adjust the width.

We have an experimental `fitWidth` property, it is good when you want to get rid of
an extra space on the right of a section.

The best way to test that layout is ok, is to visit `/landscape` and
`/serverless`, and if it looks ok, run `PORT=3000 babel-node
tools/renderLandscape` and see the rendered png files, they are in src/images
folder
