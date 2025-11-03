# Agent Onboarding Guide for CNCF Landscape

This document provides guidance for AI coding agents working with the CNCF Landscape repository. The landscape is a comprehensive directory of cloud native projects and products, maintained as a data file that generates the interactive landscape at https://landscape.cncf.io.

## Repository Overview

### Purpose
This repository contains the data and assets for the CNCF Cloud Native Landscape:
- **landscape.yml**: A 20,000+ line YAML file containing ~2,384 cloud native projects/products organized into 11 categories
- **hosted_logos/**: Directory with 2,242+ SVG logos for all listed projects/products
- **docs/**: Documentation including item summary field specifications
- The actual landscape rendering is done by the [landscape2](https://github.com/cncf/landscape2) project

### Key Files
- `landscape.yml` - Main data file (complex, ~20k lines, alphabetically organized)
- `hosted_logos/*.svg` - Project/product logos in SVG format
- `README.md` - Contributor guidelines and entry requirements
- `docs/item_summary.md` - Documentation for optional summary fields
- `.github/workflows/validate.yml` - Validation workflow
- `.github/workflows/linkchecker.yml` - Link validation workflow
- `.github/workflows/preview.yml` - Preview comment automation

## Working with landscape.yml

### Structure
The landscape.yml file follows this hierarchical structure:

```yaml
landscape:
  - category:
    name: Category Name
    subcategories:
      - subcategory:
        name: Subcategory Name
        items:
          - item:
            name: Project/Product Name
            homepage_url: https://example.com
            repo_url: https://github.com/org/repo  # Optional, for open source
            logo: filename.svg  # Must exist in hosted_logos/
            project: graduated|incubating|sandbox|archived  # For CNCF projects only
            crunchbase: https://www.crunchbase.com/organization/org-name
            twitter: https://twitter.com/handle  # Optional
            description: Brief description  # Optional
            open_source: true  # Optional, defaults to false
            second_path:  # Optional, for items in multiple categories
              - "Category / Subcategory"
            extra:  # Optional, additional metadata
              accepted: 'YYYY-MM-DD'
              dev_stats_url: https://...
              clomonitor_name: project-name
              # See docs/item_summary.md for all available fields
```

### Critical Constraints
1. **Alphabetical Order**: Items within each subcategory MUST be in alphabetical order by name
2. **SVG Logos Required**: All logos must be SVG format and in `hosted_logos/` directory
3. **Single Category Rule**: Generally, each project appears in ONE category only (exceptions exist for large companies)
4. **Open Source Stars**: Open source projects need 300+ GitHub stars to be included
5. **Crunchbase Required**: Valid Crunchbase organization URL required for all entries
6. **Schema Validation**: First line references schema: `# yaml-language-server: $schema=https://raw.githubusercontent.com/cncf/landscape2/refs/heads/main/docs/config/schema/data.schema.json`

### CNCF Project Statuses
CNCF projects use the `project` field with these values:
- `graduated` - Graduated CNCF projects (~34 projects)
- `incubating` - Incubating CNCF projects (~35 projects)
- `sandbox` - Sandbox CNCF projects (~139 projects)
- `archived` - Archived CNCF projects (~25 projects)

### Extra Fields
The `extra` section supports many optional fields. Key ones include:
- `accepted` - Date accepted to CNCF
- `incubating`/`graduated` - Date of status change
- `dev_stats_url` - DevStats dashboard URL
- `clomonitor_name` - CLOMonitor project name
- `annual_review_date`/`annual_review_url` - Review information
- `blog_url`, `slack_url`, `artwork_url` - Additional links
- `summary_*` fields - For rich item summaries (see docs/item_summary.md)
- `audits` - Security audit information

See `docs/item_summary.md` for complete list of summary fields (personas, tags, use_case, business_use_case, release_rate, integrations, intro_url).

## Testing and Validation

### No Traditional Tests
This repository has **NO** npm, make, or traditional test commands. Validation happens through GitHub Actions.

### Validation Workflow
The repository uses the `landscape2-validate-action` to validate landscape.yml:

```yaml
# .github/workflows/validate.yml
- uses: cncf/landscape2-validate-action@v2
  with:
    target_kind: data
    target_path: ./landscape.yml
```

This runs automatically on:
- Pull requests to main/master
- Merge queue

**Manual Validation**: There's no local validation tool. PRs must be opened to trigger CI validation.

### Link Checker
The `lychee-action` validates all URLs in the landscape:
- Runs on PRs and merge queue
- Ignores domains listed in `.lycheeignore` (linkedin.com, localhost, crunchbase.com, creativecommons.org)
- Fails PR if broken links found

### Preview Feature
When a PR modifies `landscape.yml` or `hosted_logos/*`, a bot comments with a preview link:
- Overlays your changes on the live landscape
- Experimental feature - may not work perfectly
- Useful for visual verification before merge

## Common Tasks

### Adding a New Entry

1. **Prepare the logo**:
   - Must be SVG format
   - Include project/product name in English
   - No reversed logos (white/transparent background only)
   - Use stacked layout if multiple variants exist
   - Add to `hosted_logos/` directory

2. **Find the correct category**:
   - Review existing categories - avoid creating new ones
   - Place in the single best-fit category
   - Use existing subcategories

3. **Add to landscape.yml**:
   - Find the appropriate subcategory
   - Insert in alphabetical order by name
   - Include all required fields (name, homepage_url, logo, crunchbase)
   - Add repo_url only if 100% open source with 300+ stars
   - Follow YAML indentation carefully (use spaces, not tabs)

4. **Verify Crunchbase data**:
   - Ensure organization headquarters and LinkedIn are correct
   - Use the organization that controls the software/trademark

5. **Open PR**:
   - Validation and link checking run automatically
   - Check preview link in PR comments
   - Address any validation errors

### Updating an Existing Entry

1. Locate the item in landscape.yml (search by name)
2. Modify only the specific fields that need updating
3. Maintain alphabetical order if changing the name
4. If updating logo, ensure SVG is in hosted_logos/
5. Open PR - validation runs automatically

### Common Errors and Workarounds

**Error: "Item not in alphabetical order"**
- Solution: Ensure items within a subcategory are alphabetically sorted by `name` field
- Compare with surrounding entries

**Error: "Logo not found"**
- Solution: Ensure the logo file exists in `hosted_logos/` and matches the filename exactly (case-sensitive)

**Error: "Invalid YAML syntax"**
- Solution: Check indentation (must use spaces, typically 2 or 4 per level)
- Ensure colons are followed by spaces
- Quote values containing special characters

**Error: "Invalid Crunchbase URL"**
- Solution: Use format `https://www.crunchbase.com/organization/org-name`
- Verify organization exists on Crunchbase

**Error: "Missing required field"**
- Solution: Ensure all required fields present: name, homepage_url, logo, crunchbase
- For CNCF projects, extra.clomonitor_name often required

**Logo not rendering in preview**
- Solution: Verify SVG is valid and doesn't use external resources
- Check that logo doesn't have reversed colors (non-white background)
- Ensure logo includes project name text

## Best Practices

### Editing landscape.yml
1. **Use a YAML-aware editor** with schema validation support
2. **Make minimal changes** - modify only what's necessary
3. **Preserve formatting** - maintain existing indentation and structure
4. **Test locally** - While no test command exists, visually verify YAML syntax
5. **One logical change per PR** - Don't mix multiple unrelated updates
6. **Be precise with alphabetization** - This is strictly enforced

### Working with Logos
1. **Always use SVG format** - No PNG, JPG, or other formats accepted
2. **Optimize SVGs** - Remove unnecessary metadata and whitespace
3. **Include text** - Logo must show the project/product name
4. **Use simple backgrounds** - White or transparent only
5. **Check file size** - Keep logos reasonably sized (typically < 50KB)

### Pull Requests
1. **Fill out PR template** - Address all checklist items
2. **Reference related issues** - Use "Fixes #123" syntax
3. **Provide context** - Explain why the change is being made
4. **Be patient** - Validation takes time, landscape updates daily
5. **Respond to reviews** - Maintainers may request changes
6. **Include screenshots** - For logo changes, show before/after if possible

## Technical Advisory Groups (TAGs)

CNCF projects can specify their TAG in the `extra` section:

```yaml
extra:
  tag: runtime  # or app-delivery, security, network, etc.
```

Valid TAG values:
- app-delivery
- contributor-strategy
- environmental-sustainability
- network
- observability
- runtime
- security
- storage

If not specified, TAG is auto-detected from category/subcategory mapping in the landscape2-sites settings.

## Advanced Features

### second_path
Items can appear in multiple categories using `second_path`:

```yaml
second_path:
  - "CNAI / Agentic AI"
  - "Serverless / Tools"
```

Format: "Category / Subcategory" - must match existing categories exactly.

### allow_duplicate_repo
Special flag that allows the same repo_url in multiple entries (rare, typically for projects with multiple components).

### Item Summaries
Rich project descriptions can be added via `extra.summary_*` fields. See `docs/item_summary.md` for:
- summary_personas - Target users
- summary_tags - Technical feature tags
- summary_use_case - Technical problem solved
- summary_business_use_case - Business value
- summary_release_rate - Release cadence
- summary_integrations - What it integrates with
- summary_intro_url - Overview video URL

### Attribution Requirements

AI agents must disclose what tool and model they are using in the "Assisted-by" commit footer:

```text
Assisted-by: [Model Name] via [Tool Name]
```

Example:

```text
Assisted-by: GLM 4.6 via Claude Code
```

### Additional Guidelines

## Pull Request Requirements

- Include a clear description of changes.
- Reference any related issues.
- Pass CI (automatic validation and link checking via GitHub Actions).
- Optionally add screenshots for UI changes.

## Important Notes

### What This Repo Is NOT
- This is NOT the landscape rendering engine (that's landscape2)
- This is NOT a place to request new categories (unlikely to be accepted)
- This is NOT for stealth-mode companies (need public product description)
- This is NOT for commercial versions of open source (except Certified Kubernetes)

### Update Frequency
- Landscape regenerates daily
- Changes visible within 24 hours after PR merge
- Preview feature available for immediate visual check

### Data Sources
- Some data pulled from Crunchbase (not under Apache License)
- Some data pulled from GitHub (stars, last commit, etc.)
- Errors in external data should be fixed at source

## Getting Help

1. **README.md** - Start here for contributor guidelines
2. **docs/item_summary.md** - For extra fields documentation
3. **landscape2 docs** - For schema and field reference: https://github.com/cncf/landscape2/blob/main/docs/config/data.yml
4. **GitHub Issues** - Don't create issues for data corrections, open PRs instead
5. **PR Template** - Checklist helps catch common problems

## Quick Reference

| Task | Command/Location |
|------|------------------|
| Validate YAML | Open PR (no local command) |
| Check links | Open PR (lychee runs in CI) |
| Preview changes | Check PR comments after opening |
| Find schema | First line of landscape.yml |
| Logo requirements | README.md "New entries" section |
| Field documentation | docs/item_summary.md |
| CNCF project info | extra.accepted, extra.clomonitor_name |

## Summary

This repository is **data-focused** rather than code-focused. The primary artifact is `landscape.yml`, a large, complex YAML file with strict formatting and validation requirements. There are no traditional tests - validation happens exclusively through GitHub Actions. When working with this repository:

1. Understand the landscape.yml structure deeply before making changes
2. Always maintain alphabetical order within subcategories
3. Ensure logos are SVG format in hosted_logos/
4. Use PRs to trigger validation - there's no local test command
5. Be patient - changes appear in landscape within 24 hours
6. Follow the attribution requirements for AI-assisted commits
7. Keep changes minimal and focused on the specific task
