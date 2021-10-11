> The cloud native landscape guide was initiated by the
> [CNCF Business Value Subcommittee](https://github.com/cncf/business-value)
> and [Cartografos group](https://github.com/cncf/cartografos). It was authored by
> [Jason Morgan](https://www.linkedin.com/in/jasonmorgan2/) and 
> [Catherine Paganini](https://www.linkedin.com/in/catherinepaganini/), 
> edited and reviewed by [Simon Forster](https://www.linkedin.com/in/forsters/) and
> [Ihor Dvoretskyi](https://www.linkedin.com/in/idvoretskyi/), built by 
> [Jordi Noguera](https://www.linkedin.com/in/jordinoguera/) with UX consultation 
> from [Andrea Velázquez](https://www.linkedin.com/in/andreavelazquez1/).

## Introduction

If you've researched cloud native applications and technologies, you've probably come
across the [CNCF cloud native landscape](https://landscape.cncf.io). Unsurprisingly,
the sheer scale of it can be overwhelming. So many categories and so many technologies.
How do you make sense of it?

As with anything else, if you break it down and analyze it one piece at a time, you'll
find it's not that complex and makes a lot of sense. In fact, the map is neatly organized
by functionality and, once you understand what each category represents, navigating it
becomes a lot easier.

In this guide, we’ll break this mammoth landscape down and provide a high-level overview
of its layers, columns, and categories.

### What is the cloud native landscape?

The goal of the cloud native landscape is to compile and organize all cloud native open
ource projects and proprietary products into categories, providing an overview of the
current ecosystem. Organizations that have a cloud native project or product can
[submit a PR](https://github.com/cncf/landscape/) to request it to be added to the
landscape.

### How to use this guide

In this guide, you'll find one chapter per layer and column which discusses each category
within it. Categories are broken down into: what it is, the problem it addresses, how it
helps, and technical 101. While the first three sections assume no technical background,
the technical 101 is targeted to engineers just getting started with cloud native. We
also included a section for associates buzzwords and lists CNCF projects

![CNCF Landscape](https://landscape.cncf.io/images/landscape_preview.png "CNCF Landscape")

> ##### INFOBOX
>
> When looking at the landscape, you'll note a few distinctions:
>  * *Projects in large boxes* are CNCF-hosted open source projects. Some are still in
>    the incubation phase (light blue/purple frame), while others are graduated
>    projects (dark blue frame).
>  * *Projects in small white boxes* are open source projects.
>  * *Products in gray boxes* are proprietary products.
>
> Please note that new projects are continuously becoming part of the CNCF so
> always refer to the actual landscape – things are moving fast!

<section data-category="Provisioning">

Provisioning is the first layer in the cloud native landscape. It encompasses tools that
are used to *create and harden* the foundation on which cloud native apps are built.
You'll find tools to automatically configure, create, and manage the infrastructure,
as well as  forscanning, signing, and storing container images. The layer also extends
to security with tools that enable policy setting and enforcement, embedded authentication
and authorization, and the handling of secrets distribution. That's a mouthful, so let's
discuss each category at a time.

</section>

<section data-subcategory="Automation & Configuration" 
         data-buzzwords="Infrastructure-as-Code (IaC), Automation, Declarative Configuration">

#### What it is

Automation and configuration tools speed up the creation and configuration of compute
resources (virtual machines, networks, firewall rules, load balancers, etc.). Tools in
this category either handle different parts of the provisioning process or try to control
everything end-to-end. Most provide the ability to integrate with other projects and
products in the space.

#### Problem it addresses

Traditionally, IT processes relied on lengthy and labor intensive manual release cycles,
typically between three to six months. Those cycles came with lots of human processes and
controls that slowed down changes to production environments. These slow release cycles
and static environments aren’t compatible with cloud native development. To deliver on
rapid development cycles, infrastructure must be provisioned dynamically and without
human intervention.

#### How it helps

Tools of this category allow engineers to build computing environments without human
intervention. By codifying the environment setup it becomes reproducible with the click
of a button. While manual setup is error prone, once codified, environment creation
matches the exact desired state -- a huge advantage.

While tools may take different approaches, they all aim at reducing the required work
to provision resources through automation.

#### Technical 101

As we move from old-style human-driven provisioning to a new on-demand scaling model
driven by the cloud, the patterns and tools we used before no longer meet our needs.
Most organizations can’t afford a large 24x7 staff to create, configure, and manage
servers. Automated tools like Terraform reduce the level of effort required to scale
tens of servers and networks with hundreds of firewall rules. Tools like Puppet, Chef,
and Ansible provision and/or configure these new servers and applications
programmatically as they are spun up and allow them to be consumed by developers.

Some tools interact directly with the infrastructure APIs provided by platforms like
AWS or vSphere, while others focus on configuring the individual machines to make them
part of a Kubernetes cluster. Many, like Chef and Terraform, can interoperate to provision
and configure the environment. Others, like OpenStack, exist to provide an
Infrastructure-as-a-Service (IaaS) environment that other tools could consume.
Fundamentally, you'll need one or more tools in this space as part of laying down the
computing environment, CPU, memory, storage, and networking, for your Kubernetes clusters.
You'll also need a subset of these to create and manage the Kubernetes clusters
themselves.

There are now over 5 CNCF projects in this space, more if you count projects like Cluster
API which don’t appear on the landscape. There is also a very robust set of other open
source and vendor provided tools.

</section>

<section data-subcategory="Container Registry" 
         data-buzzwords="Container, OCI Image, Registry">

#### What it is

Before diving into container registries, we need to define three tightly related concepts:

* **Container** is "a running process with resource and capability constraints managed by a
  computer’s operating system"
  ([Cloud Native Glossary](https://github.com/cncf/glossary/blob/main/definitions/container.md)).
* **Image** is a set of archive files needed to run containers and its process. You could
  see it as a form of template on which you can create an unlimited number of containers.
* **Repository**, or just repo, is a space to store images.

And **container registries** are specialized web applications that categorize and store repositories.

Let's recap real quick: images contain the information needed to execute a program
(within a container) and are stored in repositories which in turn are categorized and
grouped in registries. Tools that build, run, and manage containers need access to those
images. Access is provided by referencing the registry (the path to access the image).

#### Problem it addresses

Cloud native applications are packaged and run as containers. Container registries store and provide 
the container images needed to run these apps.

#### How it helps
By centrally storing all container images in one place, they are easily accessible for any developer 
working on that app.

#### Technical 101
Container registries either store and distribute images or enhance an existing registry in some 
way. Fundamentally, a registry is a web API that allows container runtimes to store and retrieve 
images. Many provide interfaces to allow container scanning or signing tools to enhance the 
security of the images they store. Some specialize in distributing or duplicating images in a 
particularly efficient manner. Any environment using containers will need to use one or more 
registries.

Tools in this space provide integrations to scan, sign, and inspect the images they store. 
Dragonfly and Harbor are CNCF projects and Harbor recently gained the distinction of 
[being the first](https://goharbor.io/blog/harbor-2.0/) OCI compliant registry. Each major cloud 
provider provides its own hosted registry and many other registries can be deployed standalone or 
directly into your Kubernetes cluster via tools like Helm.

</section>

<section data-subcategory="Security & Compliance" 
         data-buzzwords="Image scanning, Image signing, Policy enforcement, Audit, Certificate Management">

#### What it is

Cloud native applications are designed to be rapidly iterated on. Think of your mobile phone’s 
continuous flow of app updates — they evolve everyday, presumably getting better. In order to 
release code on a regular cadence you must ensure that the code and operating environment are 
secure and only accessed by authorized engineers. Tools and projects in this section provide 
some of the abilities needed to build and run modern applications securely.

#### Problem it addresses

Security and compliance tools help harden, monitor, and enforce platform and application security. 
From containers to Kubernetes environments, these tools allow you to set policy (for compliance), 
get insights into existing vulnerabilities, catch misconfigurations, and harden the containers and 
clusters.

#### How it helps

To run containers securely, containers must be scanned for known vulnerabilities and signed to 
ensure they haven’t been tampered with. Kubernetes has extremely permissive access control settings 
by default that are unsuitable for production use. The result: Kubernetes clusters are an attractive 
target for anyone looking to attack your systems. The tools and projects in this space help harden 
the cluster and detect when the system is behaving abnormally.

#### Technical Intro

* Audit and compliance
* Path to production:
  * Code scanning
  * Vulnerability scanning
  * Image signing
* Policy creation and enforcement
* Network layer security

Some of these tools are rarely used directly. Trivy, Claire, and Notary, for example, are leveraged 
by registries or other scanning tools. Others represent key hardening components of a modern 
application platform. Examples include Falco or Open Policy Agent (OPA).

You'll find a number of mature vendors providing solutions in this space, as well as startups 
founded explicitly to bring Kubernetes native frameworks to market. At the time of this writing 
Falco, Notary/TUF, and OPA are CNCF projects in this space.

</section>

<section data-subcategory="Key Management" 
         data-buzzwords="AuthN and AuthZ, Identity, Access, Secrets">

#### What it is

Before digging into key management, let's first define cryptographic keys. A key is a string of 
characters used to encrypt or sign data. Like a physical key, it locks (encrypts) data so that 
only someone with the right key can unlock (decrypt) it.

As applications and operations adapt to a new cloud native world, security tools are evolving to 
meet new security needs. The tools and projects in this category cover everything from how to 
securely store passwords and other secrets (sensitive data such as API keys, encryption keys, etc.) 
to how to safely eliminate passwords and secrets from your microservices environment.

#### Problem it addresses

Cloud native environments are highly dynamic, requiring on-demand secret distribution. That means 
it has to be entirely programmatic (no humans in the loop) and automated.

Additionally, applications need to know if a given request comes from a valid source 
(authentication) and if that request has the right to do whatever it’s trying to do 
(authorization). This is commonly referred to as AuthN and AuthZ.

#### How it helps

Each tool or project takes a different approach but they all provide a way to either securely 
distribute secrets and keys or a service or specification related to authentication, authorization, 
or both.

#### Technical 101

Tools in this category can be grouped into two sets: 1) key generation, storage, management, and 
rotation, and 2) single sign-on and identity management. Vault, for example, is a rather generic 
key management tool allowing you to manage different types of keys. Keycloak, on the other hand, 
is an identity broker which can be used to manage access keys for different services.

</section>

### Summary

As we've seen, the provisioning layer focuses on building the foundation of your cloud native 
platforms and applications with tools handling everything from infrastructure provisioning to 
container registries to security. Next, we'll discuss the runtime layer containing cloud native 
storage, container runtime, and networking.

<section data-category="Runtime">

Now that we've established the foundation of a cloud native environment, we'll move one 
infrastructure layer up and zoom into the runtime layer. It encompasses everything a container 
needs to run in a cloud native environment. That includes the code used to start a container, 
referred to as a container runtime; tools to make persistent storage available to containers; 
and those that manage the container environment networks.

But note, these resources are not to be confused with the networking and storage work handled by 
the provisioning layer discussed above. Those focused on getting the container platform running. 
Tools in this category are used to start and stop containers, help them store data, and allow them 
to talk to each other.

</section>

<section data-subcategory="Cloud Native Storage"
         data-buzzwords="Persistent volume, CSI, Storage API, Backup and restore">

### What it is

Storage is where the persistent data of an app is stored, often referred to as a persistent volume. 
To function reliably, applications need to have easy access to storage. Generally, when we say 
persistent data, we mean storing things like databases, messages, or any other information we want 
to ensure doesn’t disappear when an app gets restarted.

### Problem it addresses

Cloud native architectures are fluid, flexible, and elastic, making persisting data between 
restarts challenging. To scale up and down or self-heal, containerized apps are continuously 
created and deleted, changing physical location over time. That's why cloud native storage must 
be provided node-independently. To store data, though, you'll need hardware, a disk to be specific, 
and disks, just like any other hardware, are infrastructure-bound — our first big challenge.

Then there is the actual storage interface which can change significantly between datacenters 
(in the old world, each infrastructure had their own storage solution with its own interface), 
making portability really tough.

And lastly, manual provisioning and autoscaling aren't compatible, so, to benefit from the 
elasticity of the cloud, storage must be provisioned automatically.

Cloud native storage is tailored to this new cloud native reality.

### How it helps

The tools in this category help either:

1. Provide cloud native storage options for containers,
2. Standardize the interfaces between containers and storage providers, or
3. Provide data protection through backup and restore operations.

The former means storage that uses a cloud native compatible container storage interface 
(tools in the second category) and which can be provisioned automatically, enabling autoscaling 
and self-healing by eliminating the human bottleneck.

### Technical 101

Cloud native storage is largely made possible by the Container Storage Interface (CSI) which 
provides a standard API for providing file and block storage to containers. There are a number 
of tools in this category, both open source and vendor-provided, that leverage the CSI to provide 
on-demand storage for containers.

Additionally, there are technologies aiming to solve other cloud native storage challenges. 
Minio is a popular project that provides an S3-compatible API for object storage among other 
things. Tools like Velero help simplify the process of backing up and restoring both the 
Kubernetes clusters themselves as well as persistent data used by the applications.

</section>

<section data-subcategory="Container Runtime"
         data-buzzwords="Container, MicroVM">

### What it is

As discussed under container registry, a container is a set of compute constraints used to execute 
(or launch) an application. Containerized apps believe they are running on their own dedicated 
computer and are oblivious that they are sharing resources with other processes 
(similar to virtual machines).

The container runtime is the software that executes containerized (or "constrained") applications. 
Without the runtime, you only have the container image, the at-rest file specifying how the 
containerized app should look like. The runtime will start an app within a container and provide 
it with the needed resources.

### Problem it addresses

Container images (the files with the application specs) must be launched in a standardized, secure, 
and isolated way. Standardized because you need standard operating rules no matter where they are 
running. Secure, well, because you don't want anyone who shouldn't access it to do so. And isolated 
because you don't want the app to affect or be affected by other apps (for instance, if a 
co-located application crashes). Isolation basically functions as protection. Additionally, the 
application needs to be provided resources, such as CPU, storage, and memory.

### How it helps

The container runtime does all that. It launches apps in a standardized fashion across all 
environments and sets security boundaries. The latter is where some of these tools differ. Runtimes 
like CRI-O or gVisor have hardened their security boundaries. The runtime also sets resource limits 
for the container. Without it, the app could consume resources as needed, potentially taking 
resources away from other apps, so you always need to set limits.

### Technical 101

Not all tools in this category are created equal. Containerd (part of the famous Docker product) 
and CRI-O are standard container runtime implementations. Then there are tools that expand the use 
of containers to other technologies, such as Kata which allows you to run containers as VMs. Others 
aim at solving a specific container-related problem such as gVisor which provides an additional 
security layer between containers and the OS.

</section>

<section data-subcategory="Cloud Native Network"
         data-buzzwords="SDN, Network Overlay, CNI">

### What it is

Containers talk to each other and to the infrastructure layer through a cloud native network. 
[Distributed applications](https://thenewstack.io/primer-distributed-systems-and-cloud-native-computing/) 
have multiple components that use the network for different purposes. Tools in this category create 
a virtual network on top of existing networks specifically for apps to communicate, referred to 
as an **overlay network**.

### Problem it addresses

While it's common to refer to the code running in a container as an app, the reality is that most 
containers hold only a small specific set of functionalities of a larger application. Modern 
applications such as Netflix or Gmail are composed of a number of these smaller components each 
running in its own container. To allow all these independent pieces to function as a cohesive 
application, containers need to communicate with each other privately. Tools in this category 
provide that private communication network.

Data and messages flowing between containers may have sensitive or private data. Because cloud 
native networking uses software for controlling, inspecting and modifying data flows, it is a lot 
easier to manage, secure and isolate connections between containers. In some cases you may want to 
extend your container networks and network policies such as firewall and access rules to allow an 
app to connect to virtual machines or services running outside the container network. The 
programmable and often declarative nature of cloud native networking makes this possible.

### How it helps

Projects and products in this category use the Container Network Interface (CNI), a CNCF project, 
to provide networking functionalities to containerized applications. Some tools, like Flannel, are 
rather minimalist, providing bare bones connectivity to containers. Others, such as NSX-T provide a 
full software-defined networking layer creating an isolated virtual network for every Kubernetes 
namespace.

At a minimum, a container network needs to assign IP addresses to pods (that's where containerized 
apps run in Kubernetes), allowing other processes to access it.

### Technical 101

The variety and innovation in this space is largely made possible by the CNI (similar to storage 
and the Container Storage Interface mentioned above).The CNI standardizes the way network layers 
provide functionalities to pods.  Selecting the right container network for your Kubernetes 
environment is critical and you've got a number of tools to choose from. Weave Net, Antrea, Calico, 
and Flannel all provide effective open source networking layers. Their functionalities vary widely 
and your choice should be ultimately driven by your specific needs.

Numerous vendors support and extend Kubernetes networks with Software Defined Networking (SDN) 
tools, providing additional insights into network traffic, enforcing network policies, and even 
extending container networks and policies to your broader datacenter.

</section>

### Summary

This concludes our overview of the runtime layer which provides all the tools containers need to 
run in a cloud native environment:

* Cloud native storage gives apps easy and fast access to data needed to run reliably
* The container runtime which creates and starts containers executing application code
* Cloud native networking provides connectivity for containerized apps to communicate.

Cloud native networking provides connectivity for containerized apps to communicate.

<section data-category="Platform">

As we've seen so far, each of the categories discussed solves a particular problem. Storage alone 
does not provide all you need to manage your app. You'll need an orchestration tool, a container 
runtime, service discovery, networking, an API gateway, etc. Platforms bundle different tools from 
different layers together, solving a larger problem.

There isn't anything inherently new in these platforms. Everything they do can be done by one of 
the tools in these layers or the observability and analysis column. You could certainly build your 
own platform and, in fact, many organizations do. However, configuring and fine-tuning the different 
modules reliably and securely while ensuring that all technologies are always kept up to date 
and vulnerabilities patched is no easy task—you'll need a dedicated team to build and maintain it. 
If you don't have the necessary resources or know-how, your team is likely better off with a 
platform. For some organizations, especially those with small engineering teams, platforms are the 
only way to adopt a cloud native approach.

You'll probably notice, all platforms revolve around 
[Kubernetes](https://github.com/cncf/glossary/blob/main/content/en/kubernetes.md). That's because 
is at the core of the cloud native stack.

</section>

<section data-subcategory="Certified Kubernetes - Distribution">

#### What it is

A distribution, or distro, is when a vendor takes core Kubernetes — that's the unmodified, open 
source code (although some modify it) — and packages it for redistribution. Usually this entails 
finding and validating the Kubernetes software and providing a mechanism to handle cluster 
installation and upgrades. Many Kubernetes distributions include other proprietary or open source applications.

#### What it addresses

[Open source Kubernetes](https://github.com/kubernetes/kubernetes) doesn’t specify a particular 
installation tool and leaves many setup configuration choices to the user. Additionally, there is 
limited support for issues as they arise through community resources like 
[Community Forums](https://discuss.kubernetes.io/), 
[StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes), or 
[Slack](https://slack.k8s.io/).

While using Kubernetes has become easier over time, it can be challenging to find and use the open 
source installers. Users need to understand what versions to use, where to get them, and if a 
particular component is compatible with another. They also need to decide what software will be 
deployed to their clusters and what settings to use to ensure their platforms are secure, stable, 
and efficient. All this requires deep Kubernetes expertise that may not be readily available 
in-house.

#### How it helps

Kubernetes distributions provide a trusted and reliable way to install Kubernetes and provide 
opinionated defaults that create a better and more secure operating environment. A Kubernetes 
distribution gives vendors and projects the control and predictability they need to provide support 
for a customer as they go through the lifecycle of deploying, maintaining, and upgrading their 
Kubernetes clusters.

That predictability enables distribution providers to support users when they have production 
issues. Distributions also often provide a tested and supported upgrade path that allows users 
to keep their Kubernetes clusters up to date. Additionally, distributions often provide software 
to deploy on top of Kubernetes that makes it easier to use.

Distributions significantly ease and speed up Kubernetes adoption. Since the expertise needed to 
configure and fine-tune the clusters is coded into the platform, organizations can get up and 
running with cloud native tools without having to hire additional engineers with specialized 
expertise.

#### Technical 101

If you've installed Kubernetes, you’ve likely used something like kubeadm to get your cluster up 
and running. Even then, you probably had to decide on a CNI, install, and configure it. Then, you 
might have added some storage classes, a tool to handle log messages, maybe an ingress controller, 
and the list goes on. A Kubernetes distribution will automate some or all of that setup. It will 
also ship with configuration settings based on its own interpretation of best practice or an 
intelligent default. Additionally, most distributions will come with some extensions or add-ons 
bundled and tested to ensure you can get going with your new cluster as quickly as possible.

There are a lot of options in this category. [k3s](https://k3s.io/) is the only CNCF project in 
this category. There are a lot of great open source and commercial options available. We encourage 
you to think carefully about your needs when you begin evaluating distributions.

</section>

<section data-subcategory="Certified Kubernetes - Hosted"
         data-buzzwords="Hosted">

#### What it is

Hosted Kubernetes is a service offered by infrastructure providers like AWS, Digital Ocean, Azure, 
and Google, allowing customers to spin up a Kubernetes cluster on-demand. The cloud provider 
takes responsibility for managing part of the Kubernetes cluster, usually called the control plane. 
They are similar to distributions but managed by the cloud provider on their infrastructure.

#### Problem it addresses

Hosted Kubernetes allows teams to get started with Kubernetes without knowing or doing anything 
beyond setting up an account with a cloud vendor. It solves four of the five Ws of getting started 
with Kubernetes. Who (manages it): your cloud provider; what: their hosted Kubernetes offering; 
when: now; and where: on the cloud providers infrastructure. The why is up to you.

#### How it Helps

Since the provider takes care of all management details, hosted Kubernetes is the easiest way to 
get started with cloud native. All users have to do is develop their apps and deploy them on the 
hosted Kubernetes services — it's incredibly convenient. Hosted Kubernetes allows users to spin up 
a cluster and get started right away (with the exception of AWS' EKS which also requires users to 
take some additional steps to prepare their clusters) while taking some responsibility for the 
cluster availability. It’s worth noting that with the extra convenience of these services comes 
some reduced flexibility. The offering is bound to the cloud provider, and Kubernetes users don’t 
have access to the control plane.

#### Technical 101

Hosted Kubernetes are on-demand Kubernetes clusters provided by a vendor, usually an infrastructure 
hosting provider. The vendor takes responsibility for provisioning the cluster and managing the 
Kubernetes control plane. Again, the notable exception is EKS, where individual node provisioning 
is left up to the client.

Hosted Kubernetes allows an organization to quickly provision new clusters and reduce their 
operational risk by outsourcing infrastructure component management to another organization. The 
main trade-offs are that you’ll likely be charged for the control plane management and that you'll 
be limited in what you can do. Managed clusters provide stricter limits on configuring your 
Kubernetes cluster than DIY Kubernetes clusters.

</section>
