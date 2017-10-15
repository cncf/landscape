# How To Make Updates

This is only necessary once, but updates git to upload tags on push:

`git config --global push.followTags true`

Each time there is a new update

1. Copy the new jpg, pdf and ai files into the landscape directory.
1. `cd landscape`
1. `rm CloudNativeLandscape_latest.*` to delete the former latest versions.
1. `cp CloudNativeLandscape_v###.jpg CloudNativeLandscape_latest.jpg` with `###` replaced by the new version number, like `0.9.8`.
1. `cp CloudNativeLandscape_v###.pdf CloudNativeLandscape_latest.pdf`
1. `cp CloudNativeLandscape_v###.ai CloudNativeLandscape_latest.ai`
1. `git add -A`
1. `git commit -sm 'Version ###'`
1. `git tag ###`
1. `git push`
