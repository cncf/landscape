# Item summary

The landscape is able to display a summary section in the item's detail view when the required information is provided in the `landscape.yml` file. This information must be located in the `extra` section of the corresponding entry, and the available fields are described in the *reference* section below.

> [!NOTE]
> Please note that to update this information you have to be a project owner, maintainer, or have some type of strong project affiliation.

## Reference

```yaml
## (sample taken from Dragonfly)

extra:
  summary_personas: Platform Engineers, DevOps Engineers, SREs, Cloud Architects, Startup Engineering Teams, Backend Developers
  summary_tags: kubernetes, visual interface, deployment automation, cloud native, platform engineering, developer experience, infrastructure management, cluster orchestration, no-code, low-code, kubernetes ui, devtools
  summary_use_case: Simplifies Kubernetes deployment and operations through a visual workstation interface. Enables teams to manage clusters, deploy workloads, and configure infrastructure without deep YAML expertise, reducing operational complexity and accelerating delivery.
  summary_business_use_case: Reduces time-to-deploy and operational overhead by abstracting Kubernetes complexity. Improves developer productivity, lowers onboarding time, and minimizes infrastructure misconfigurations, enabling startups and enterprises to ship faster with fewer DevOps bottlenecks.
  summary_release_rate: Rapid iteration with frequent feature releases (monthly).
  summary_integrations: Kubernetes, Docker, Helm, AWS, Google Cloud, Azure, Container Registries, CI/CD pipelines, Prometheus, Grafana, GitHub, GitLab
```

**Target Users:** (summary_personas)
Who is this project for? Who'll be using it? Developers, SRE/DevOps Engineers, Architects?

**Tags:** (summary_tags)
Add tags that describe your project's properties. Please focus on technical features. The goal is for the user to differentiate and compare projects on a high level. Tags will allow them to infer project features, qualities, and properties.

Example: KubeEdge, Akri, OpenYurt, and SuperEdge will likely all share the Edge tag indicating that they relate to the network edge. OpenYurt and SuperEdge may also share the IoT tag, while KubeEdge and Akri won't. Metal3-io’s tags might show it to be the only project dealing with baremetal and provisioning.

**Use case:** (summary_use_case)
Focus on the technical problem your project solves. Why would someone need it? What technical pain points does it address? Be brief and limit your description to 500 characters.

**Business use:** (summary_business_use_case)
Comment on your project's business use case. How would it bring value to an organization? Does it reduce risk of some type (e.g., regulatory, reputational), or increase responsiveness to customer demand? Does it increase security in a way that reduces business support costs? What is the business problem your project is trying to solve? Be brief and limit your description to 500 characters.

**Release cadence:** (summary_release_rate)
How often do you release a new version?

**Integrations:** (summary_integrations)
What does it integrate with?

**Overview video:** (summary_intro_url)
Optional: 5 min product pitch. Same thing as above, but delivered in video format.
