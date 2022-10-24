
# How to update the Project Summary Table

## These are instructions to update your project's information on the Project Summary Table. 

Please note: to update the information, you have to be a project owner, project maintainer, or have some type of strong project affiliation. 

The Project Summary Table is automatically generated out of the same underlying landscape.yml (https://github.com/cncf/landscape/blob/master/landscape.yml) used for the CNCF Landscape.
As such, all updates are done via pull requests. There are two ways you can do this:

- Use the GitHub web UI or your own tooling to create a branch and raise a PR against landscape.yml in the cncf/landscape repo

- Use the recently developed landscape web UI. This UI automatically creates a branch, formats landscape.yml, and even helps create a pull request.

## Using your own tooling:

These are the fields used for the landscape. They are all located in the extra: section for your project entry.: 


```
extra: 
  summary_personas
  summary_tags
  summary_use_case
  summary_business_use_case
  summary_release_rate
  summary_integrations
  summary_intro_url
``` 

If you are familiar with raising a pull request against the Landscape, you can simply follow the same process to update the additional fields used by the summary table.

## Using the Web Landscapes UI

- Navigate to weblandscapes.ddns.net
- Confirm that “cncf/landscape” is selected in the Repostitory field. 
![Step 1!](/images/step1.jpg "Select the repository")

- Then create your own branch name or accept the default name proposed, and press the "connect" button.


