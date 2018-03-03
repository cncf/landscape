# Installation

## Install on Mac
1. Install [Homebrew](https://brew.sh/)
2. `brew install node yarn`
3. `git clone git@github.com:cncf/landscape.git`

## Local development
1. `git pull`
2. `yarn` (installs dependencies)
* `yarn open:src` (starts a development server) or
* `yarn build`, then `yarn open:dist` (compiles and opens a production build)

## Updating data

After making changes to `landscape.yml`, run `yarn fetch` to fetch any needed data and generate [processed_landscape.yml](processed_landscape.yml) and [data.json](https://github.com/cncf/landscape/blob/master/src/data.json).

`yarn fetch` runs in 4 modes of increasingly aggressive downloading, with a default to easy. Reading data from the cache (meaning from processed_landscape.yml) means that no new data is fetched if the project/product already exists. The modes are:

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

Easy mode (the default) is what you should use if you update `landscape.yml` and want to see the results locally. The Netlify build server runs easy mode, which makes it possible to just commit a change to landscape.yml and have the results reflected in production. Run with `yarn fetch`.

Medium mode is what is run by the update server, with commits back to the repo. It needs to be run regularly to update last commit date, stars, and Crunchbase info. Run with `yarn update`.

Hard and complete modes should be unnecessary except in cases of possible data corruption. Even then, it's better to just delete any problematic entries from `processed_landscape.yml` and easy mode will recreate them with up-to-date information.

### Adding a custom image

If you can't find the right logo on the web, you can create a custom one and host it in this repo:

1. Save the logo to `src/hosted_logos/`, for example, `src/hosted_logos/apex.svg`. Use lowercase spinal case (i.e., hypens) for the name.
1. Update landscape.yml, for example, `logo: ./src/hosted_logos/apex.svg`. The location must start with`./src/hosted_logos`.
1. If you've updated the local logo since a previous commit, you need to delete the cached version in `src/logos/`. E.g., delete `src/logos/apex.svg`.
1. Update `processed_landscape.yml` with `yarn fetch`.
1. Commit and push. Double-check your work in the Netlify preview after opening a pull request.

