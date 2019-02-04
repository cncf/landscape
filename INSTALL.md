# Installation

## Install on Mac
1. Install [Homebrew](https://brew.sh/)
2. `brew install node`
3. `git clone git@github.com:cncf/landscape.git`

## Install on Linux
1. `git clone git@github.com:cncf/landscape.git`
2. Please follow [this script](https://github.com/cncf/landscapeapp/blob/master/update_server/setup.template) to install correct versions of `nodejs` and other packages on Linux.

## Local development
1. `git pull`
2. `npm install` (installs dependencies)
* `npm run open:src` (starts a development server) or
* `npm run build`, then `npm run open:dist` (compiles and opens a production build)

## Review build details
1. `npm run build`
1. `open dist/report.html`

## Updating data

After making your changes to `landscape.yml`, run `npm run fetch` to fetch any needed data and generate [processed_landscape.yml](processed_landscape.yml) and [data.json](https://github.com/cncf/landscape/blob/master/src/data.json).

`npm run fetch` runs in 4 modes of increasingly aggressive downloading, with a default to easy. Reading data from the cache (meaning from processed_landscape.yml) means that no new data is fetched if the project/product already exists. The modes are:

| Data cached            | easy   | medium   | hard   | complete   |
|------------------------|--------|----------|--------|------------|
| **Crunchbase**         | true   | false    | false  | false      |
| **GitHub basic stats** | true   | false    | false  | false      |
| **GitHub start dates** | true   | true     | false  | false      |
| **Image data**         | true   | true     | true   | false      |

* **Easy** mode just fetches any data needed for new projects/products.
* **Medium** fetches Crunchbase and basic GitHub data for all projects/products.
* **Hard** also fetches GitHub start dates. These should not change so this should not be necessary.
* **Complete** also re-fetches all images. This is problematic because images tend to become unavailable (404) over time, even though the local cache is fine.

Easy mode (the default) is what you should use if you update `landscape.yml` and want to see the results locally. The Netlify build server runs easy mode, which makes it possible to just commit a change to landscape.yml and have the results reflected in production. Run with `npm run fetch`.

Medium mode is what is run by the update server, with commits back to the repo. It needs to be run regularly to update last commit date, stars, and Crunchbase info. Run with `npm run update`.

Hard and complete modes should be unnecessary except in cases of possible data corruption. Even then, it's better to just delete any problematic entries from `processed_landscape.yml` and easy mode will recreate them with up-to-date information.

