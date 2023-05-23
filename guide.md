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
source projects and proprietary products into categories, providing an overview of the
current ecosystem. Organizations that have a cloud native project or product can
[submit a PR](https://github.com/cncf/landscape/) to request it to be added to the
landscape.

### How to use this guide

In this guide, you'll find one chapter per layer and column which discusses each category
within it. Categories are broken down into: what it is, the problem it addresses, how it
helps, and technical 101. While the first three sections assume no technical background,
the technical 101 is targeted to engineers just getting started with cloud native. We
also included a section for associated buzzwords and lists CNCF projects

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

### Contribute to the CNCF Landscape

Are you searching for an exciting project to contribute to within the CNCF ecosystem? Look no further! The CNCF hosts a wide range of projects that span cloud-native computing. To find the perfect project for your skills and interests, check out our comprehensive contribution guide at [Getting Started](https://contribute.cncf.io/contributors/getting-started/). It provides step-by-step instructions on getting started and offers valuable insights for both newcomers and experienced contributors. Join our vibrant community and make your mark on cloud-native innovation today!

<section data-category="Provisioning">

Provisioning is the first layer in the cloud native landscape. It encompasses tools that
are used to *create and harden* the foundation on which cloud native apps are built.
You'll find tools to automatically configure, create, and manage the infrastructure,
as well as  for scanning, signing, and storing container images. The layer also extends
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
  ([Cloud Native Glossary](https://github.com/cncf/glossary/blob/main/content/en/container.md)).
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

#### Technical 101

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

### Summary: Provisioning

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

### Summary: Runtime

This concludes our overview of the runtime layer which provides all the tools containers need to 
run in a cloud native environment:

* Cloud native storage gives apps easy and fast access to data needed to run reliably
* The container runtime which creates and starts containers executing application code
* Cloud native networking provides connectivity for containerized apps to communicate.

<section data-category="Orchestration & Management">

Now that we’ve covered both the provisioning and runtime layer we can now dive into orchestration 
and management. Here you’ll find tooling to handle running and connecting your cloud native 
applications. This section covers everything from Kubernetes itself, one of the key enablers of 
cloud native development to the infrastructure layers responsible for inter app, and external 
communication. Inherently scalable, cloud native apps rely on automation and resilience, enabled 
by these tools.

</section>

<section data-subcategory="Scheduling & Orchestration"
         data-buzzwords="Cluster, Scheduler, Orchestration">

### What it is

Orchestration and scheduling refer to running and managing 
[containers](https://github.com/cncf/glossary/blob/main/content/en/container.md) across a cluster. 
A cluster is a group of machines, physical or virtual, connected over a network (see cloud native 
networking).

Container orchestrators (and schedulers) are somewhat similar to the operating system (OS) on your 
laptop. The OS manages all your apps such as Microsoft 365, Slack and Zoom; executes them, and 
schedules when each app gets to use your laptop's hardware resources like CPU, memory and  storage.

While running everything on a single machine is great, most applications today are a lot bigger 
than one computer can possibly handle. Think Gmail or Netflix. These massive apps are distributed 
across multiple machines forming a 
[distributed application](https://thenewstack.io/primer-distributed-systems-and-cloud-native-computing/). 
Most modern-day applications are built this way, requiring software that is able to manage all 
components running across these different machines. In short, you need a "cluster OS." That's 
where orchestration tools come in.

You probably noticed that containers come up time and again. Their ability to run apps in many 
different environments is key. Container orchestrators, in most cases, 
[Kubernetes](https://kubernetes.io/), provide the ability to manage these containers. Containers 
and Kubernetes are both central to cloud native architectures, which is why we hear so much about 
them.

### Problem it addresses

As mentioned in the section ‘cloud native networking’, in cloud native architectures, applications 
are broken down into small components, or services, each placed in a container. You may have heard 
of them referred to as [microservices](https://github.com/cncf/glossary/blob/main/content/en/microservices-architecture.md).
Instead of having one big app (often known as a ‘monolith’) you now have dozens or even hundreds 
of (micro)services. And each of these services needs resources, monitoring, and fixing if a problem 
occurs. While it may be feasible to do all those things manually for a single service, you'll need 
automated processes when dealing with multiple services, each with its own containers.

### How it helps

Container orchestrators automate container management. But what does that mean in practice? Let's 
answer that for Kubernetes since it is the de facto container orchestrator.

Kubernetes does something called desired state reconciliation: it matches the current state of 
containers within a cluster to the desired state. The desired state is specified by the engineer 
(e.g. ten instances of service A running on three nodes, i.e. machines, with access to database B, 
etc.) and continuously compared against the actual state. If the desired and actual state don't 
match, Kubernetes reconciles them by creating or destroying objects. For example, if a container 
crashes, Kubernetes will spin up a new one.

In short, Kubernetes allows you to treat a cluster as one computer. It focuses only on what that 
environment should look like and handles the implementation details for you.

### Technical 101

Kubernetes lives in the orchestration and scheduling section along with other less widely 
adopted orchestrators like Docker Swarm and Mesos. It enables users to manage a number of 
disparate computers as a single pool of resources in a declarative way. 
Declarative configuration management in Kubernetes is handled via 
[control loops](https://kubernetes.io/docs/concepts/architecture/controller/), a pattern in which 
a process running in Kubernetes monitors the Kubernetes store for a particular object type and 
ensures the actual state in the cluster matches the desired state.

As an example, a user creates a Kubernetes deployment that states there must be 3 copies of a web 
application. The deployment controller will ensure that those 3 web application containers get 
created then continue to monitor the cluster to see if the number of containers is correct. If a 
particular container gets removed for any reason the deployment controller will cause a new 
instance to be created. Alternatively if the deployment is modified to scale down to 1 web app 
instance it will instruct Kubernetes to delete 2 of the running web apps.

This core controller pattern can also be used to extend Kubernetes by users or software developers. 
The operator pattern allows people to write custom controllers for custom resources and build any 
arbitrary logic, and automation, into kubernetes itself.

While Kubernetes isn’t the only orchestrator the CNCF hosts (both Crossplane and Volcano are 
incubating projects), it is the most commonly used and actively maintained orchestrator.

</section>

<section data-subcategory="Coordination & Service Discovery"
         data-buzzwords="DNS, Service Discovery">

### What it is

Modern applications are composed of multiple individual services that need to collaborate to 
provide value to the end user. To collaborate, they communicate over a network (see cloud native 
networking), and to communicate, they must first locate one another. Service discovery is the 
process of figuring out how to do that.

### Problem it addresses

Cloud native architectures are dynamic and fluid, meaning they are constantly changing. When a 
container crashes on one node, a new container is spun up on a different node to replace it. Or, 
when an app scales, replicas are spread out throughout the network. There is no one place where a 
particular service is — the location of everything is constantly changing. Tools in this category 
keep track of services within the network so services can find one another when needed.

### How it helps

Service discovery tools address this problem by providing a common place to find and potentially 
identify individual services. There are basically two types of tools in this category:

1. **Service discovery engines**: database-like tools that store information on all services and 
how to locate them
2. **Name resolution tools**: tools that receive service location requests and return network 
address information (e.g. CoreDNS)

> ##### INFOBOX
> In Kubernetes, to make a pod reachable a new abstraction layer called "service"  is introduced. 
> Services provide a single stable address for a dynamically changing group of pods.
> 
> Please note that "service" may have different meanings in different contexts, which can be quite 
> confusing. The term “services” generally refers to the service placed inside a container and pod. 
> It's the app component or microservice with a specific function within the actual app, for 
> example your mobile phone’s face recognition algorithm.
> 
> A Kubernetes service is the abstraction that helps pods find and connect to each other. It is an 
> entry point for a service (functionality) as a collection of processes or pods. In Kubernetes, 
> when you create a service (abstraction), you create a group of pods which together provide a 
> service (functionality within one or more containers) with a single end point (entry point) 
> which is the Kubernetes service.

#### Technical 101

As distributed systems became more and more prevalent, traditional DNS processes and traditional 
load balancers were often unable to keep up with changing endpoint information. To make up for 
these shortcomings, service discovery tools handle individual application instances rapidly 
registering and deregistering themselves. Some options such as CoreDNS and etcd are CNCF projects 
and are built into Kubernetes. Others have custom libraries or tools to allow services to operate 
effectively.

</section>

<section data-subcategory="Remote Procedure Call"
         data-buzzwords="gRPC">

### What it is

Remote Procedure Call (RPC) is a particular technique enabling applications to talk to each other. 
It's one way of structuring app communication.

### Problem it addresses

Modern apps are composed of numerous individual services that must communicate in order to 
collaborate. RPC is one option for handling the communication between applications.

### How it helps

RPC provides a tightly coupled and highly opinionated way of handling communication between 
services. It allows for bandwidth-efficient communications and many programming languages enable 
RPC interface implementations.

### Technical 101

There are a lot of potential benefits with RPC: It makes coding connections easier, it allows for 
extremely efficient use of the network layer and well-structured communications between services. 
RPC has also been criticized for creating brittle connection points and forcing users to do 
coordinated upgrades for multiple services. gRPC is a particularly popular RPC implementation and 
has been adopted by the CNCF.

</section>

<section data-subcategory="Service Proxy"
         data-buzzwords="Service Proxy, Ingress">

### What it is

A service proxy is a tool that intercepts traffic to or from a given service, applies some logic to 
it, then forwards that traffic to another service. It essentially acts as a “go-between” that can 
collect information about network traffic as well as apply rules to it. This can be as simple as 
serving as a load balancer that forwards traffic to individual applications or as complex as 
an interconnected mesh of proxies running side by side with individual containerized applications 
handling all network connections.

While a service proxy is useful in and of itself, especially when driving traffic from the broader 
network into a Kubernetes cluster, service proxies are also building blocks for other systems, such 
as API gateways or service meshes, which we'll discuss below.

### Problem it addresses

Applications should send and receive network traffic in a controlled manner. To keep track of the 
traffic and potentially transform or redirect it, we need to collect data. Traditionally, the code 
enabling data collection and network traffic management was embedded within each application.

A service proxy "externalizes" this functionality. No longer does it have to live within the app. 
Instead, it's embedded in the platform layer (where your apps run). This is incredibly powerful 
because it allows developers to fully focus on writing your value-generating application code, 
allowing the universal task of handling traffic to be managed by the platform team, whose 
responsibility it should be in the first place. Centralizing the distribution and management of 
globally needed service functionality such as routing or TLS termination from a single common 
location allows communication between services to become more reliable, secure, and performant.

### How it helps

Proxies act as gatekeepers between the user and services or between different services. With this 
unique positioning, they provide insight into what type of communication is happening and can then 
determine where to send a particular request or even deny it entirely.

Proxies gather critical data, manage routing (spreading traffic evenly among services or rerouting 
if some services break down), encrypt connections, and cache content (reducing resource 
consumption).

### Technical 101

Service proxies work by intercepting traffic between services, applying logic on it, and allowing 
it to move on if permitted. Centrally controlled capabilities embedded into proxies allow 
administrators to accomplish several things. They can gather detailed metrics about inter-service 
communication, protect services from being overloaded, and apply other common standards to 
services, like mutual TLS. Service proxies are fundamental to other tools like service meshes as 
they provide a way to enforce higher-level policies to all network traffic.

Please note, the CNCF includes load balancers and ingress providers into this category.

</section>

<section data-subcategory="API Gateway"
         data-buzzwords="API Gateway">

### What it is

While humans generally interact with computer programs via a GUI (graphical user interface) such as 
a web page or a desktop application, computers interact with each other through APIs 
(application programming interfaces). But an API shouldn't be confused with an API gateway.

An API gateway allows organizations to move key functions, such as authorizing or limiting the 
number of requests between applications, to a centrally managed location. It also functions as a 
common interface to (often external) API consumers.

### Problem it addresses

While most containers and core applications have an API, an API gateway is more than just an API. 
An API gateway simplifies how organizations manage and apply rules to all interactions.

API gateways allow developers to write and maintain less custom code (the system functionality 
is encoded into the API gateway, remember?). They also enable teams to see and control the 
interactions between application users and the applications themselves.

### How it helps

An API gateway sits between the users and the application. It acts as a go-between that takes the 
messages (requests) from the users and forwards them to the appropriate service. But before handing 
the request off, it evaluates whether the user is allowed to do what they’re trying to do and 
records details about who made the request and how many requests they’ve made.

Put simply, an API gateway provides a single point of entry with a common user interface for app 
users. It also enables you to handoff tasks otherwise implemented within the app to the gateway, 
saving developer time and money.

> ##### EXAMPLE
> 
> Take Amazon store cards. To offer them, Amazon partners with a bank that will issue and manage 
> all Amazon store cards. In return, the bank will keep, let's say, $1 per transaction. The bank 
> will use an API gateway to authorize the retailer to request new cards, keep track of the number 
> of transactions for billing, and maybe even restrict the number of requested cards per minute. 
> All that functionality is encoded into the gateway, not the services using it. Services just 
> worry about issuing cards.

### Technical 101

Like proxies and service meshes (see below), an API gateway takes custom code out of our apps and 
brings it into a central system. The API gateway works by intercepting calls to backend services, 
performing some kind of value add activity like validating authorization, collecting metrics, 
or transforming requests, then performing whatever action it deems appropriate.

API gateways serve as a common entry point for a set of downstream applications while at the same 
time providing a place where teams can inject business logic to handle authorization, rate 
limiting, and chargeback. They allow application developers to abstract away changes to their 
downstream APIs from their customers and offload tasks like onboarding new customers to the gateway.

</section>

<section data-subcategory="Service Mesh"
         data-buzzwords="Service mesh, Sidecar, Data plane, Control plane">

### What it is

Service meshes manage traffic (i.e. communication) between services. They enable platform teams 
to add reliability, observability, and security features uniformly across all services running 
within a cluster without requiring any code changes.

Along with Kubernetes, service meshes have become some of the most critical infrastructure 
components of the cloud native stack.

### Problem it addresses

In a cloud native world, we are dealing with multiple services all needing to communicate. This 
means a lot more traffic is going back and forth on an inherently unreliable and often slow 
network. To address this new set of challenges, engineers must implement additional functionality. 
Prior to the service mesh, that functionality had to be encoded into every single application. 
This custom code often became a source of technical debt and provided new avenues for failures 
or vulnerabilities.

### How it helps

Service meshes add reliability, observability, and security features uniformly across all services 
on a platform layer without touching the app code. They are compatible with any programming 
language, allowing development teams to focus on writing business logic.

> ##### INFOBOX
> 
> Since traditionally, these service mesh features had to be coded into each service, each time 
> a new service was released or updated, the developer had to ensure these features were 
> functional, too, providing a lot of room for human error. And here's a dirty little secret, 
> developers prefer focusing on business logic (value-generating functionalities) rather than 
> building reliability, observability, and security features.
> 
> For the platform owners, on the other hand, these are core capabilities and central to everything 
> they do. Making developers responsible for adding features that platform owners need is 
> inherently problematic. This, by the way, also applies to general-purpose proxies and API 
> gateways mentioned above. Service meshes and API gateways solve that very issue as they are 
> implemented by the platform owners and applied universally across all services.

### Technical 101

Service meshes bind all services running on a cluster together via service proxies creating a mesh 
of services, hence service mesh. These are managed and controlled through the service mesh control 
plane. Service meshes allow platform owners to perform common actions or collect data on 
applications without having developers write custom logic.

In essence, a service mesh is an infrastructure layer that manages inter-service communications by 
providing command and control signals to a network of service proxies (your mesh). Its power lies 
in its ability to provide key system functionality without having to modify the applications.

Some service meshes use a general-purpose service proxy (see above) for their data plane. Others 
use a dedicated proxy; Linkerd, for example, uses the [Linkerd2-proxy "micro proxy"](https://linkerd.io/) 
to gain an advantage in performance and resource consumption. These proxies are uniformly attached 
to each service through so-called sidecars. Sidecar refers to the fact that the proxy runs in its 
own container but lives in the same pod. Just like a motorcycle sidecar, it's a separate module 
attached to the motorcycle, following it wherever it goes.

> ##### EXAMPLE
> 
> Take circuit breaking. In microservice environments, individual components often fail or begin 
> running slowly. Without a service mesh, developers would have to write custom logic to handle 
> downstream failures gracefully and potentially set cooldown timers to avoid upstream services 
> to continually request responses from degraded or failed downstream services. With a service 
> mesh, that logic is handled at a platform level.
> 
> Service meshes provide many useful features, including the ability to surface detailed metrics, 
> encrypt all traffic, limit what operations are authorized by what service, provide additional 
> plugins for other tools, and much more. For more detailed information, check out the 
> [service mesh interface](https://smi-spec.io/) specification.

</section>

### Summary: Orchestration & Management

As we've seen, tools in this layer deal with how all these independent containerized services are 
managed as a group. Orchestration and scheduling tools can be thought of as a  cluster OS 
managing containerized applications across your cluster. Coordination and service discovery, 
service proxies, and service meshes ensure services can find each other and communicate effectively 
in order to collaborate as one cohesive app. API gateways are an additional layer providing even 
more control over service communication, in particular between external applications. Next, we'll 
discuss the application definition and development layer — the last layer of the CNCF landscape. It 
covers databases, streaming and messaging, application definition, and image build, as well as 
continuous integration and delivery.

<section data-category="App Definition and Development">

Everything we have discussed up to this point was related to building a reliable, secure environment 
and providing all needed dependencies. We've now arrived at the top layer of the CNCF cloud 
native landscape. As the name suggests, the application definition and development layer focuses 
on the tools that enable engineers to build apps.

</section>

<section data-subcategory="Database"
         data-buzzwords="SQL, DB, Persistence">

### What it is

A database is an application through which other apps can efficiently store and retrieve data. 
Databases allow you to store data, ensure only authorized users access it, and enable users to 
retrieve it via specialized requests. While there are numerous different types of databases with 
different approaches, they ultimately all have these same overarching goals.

### Problem it addresses

Most applications need an effective way to store and retrieve data while keeping that data safe. 
Databases do this in a structured way with proven technology though there is quite a bit of 
complexity that goes into doing this well.

### How it helps

Databases provide a common interface for applications to store and retrieve data. Developers use 
these standard interfaces and a relatively simple query language to store, query, and retrieve 
information. At the same time, databases allow users to continuously backup and save data, as 
well as encrypt and regulate access to it.

### Technical 101

Databases are apps that store and retrieve data, using a common language and interface compatible 
with a number of different languages and frameworks.

In general, there are two common types of databases: Structured query language (SQL) databases and 
no-SQL databases. Which database a particular application uses should be driven by its needs and 
constraints.

With the rise of Kubernetes and its ability to support stateful applications, we’ve seen a new 
generation of databases take advantage of containerization. These new cloud native databases aim 
to bring the scaling and availability benefits of Kubernetes to databases. Tools like YugabyteDB 
and Couchbase are examples of cloud native databases, although more traditional databases like 
MySQL and Postgres run successfully and effectively in Kubernetes clusters.

Vitess and TiKV are CNCF projects in this space.

> ##### INFOBOX
> 
> If you look at this category, you'll notice multiple names ending in DB (e.g. MongoDB, 
> CockroachDB, FaunaDB) which, as you may guess, stands for database. You'll also see various 
> names ending in SQL (e.g. MySQL or memSQL) — they are still relevant. Some are "old school" 
> databases that have been adapted to a cloud native reality. There are also some databases that 
> are no-SQL but SQL compatible, such as YugabyteDB and Vitess.

</section>

<section data-subcategory="Streaming & Messaging"
         data-buzzwords="Choreography, Streaming, MQ, Message bus">

### What it is

To accomplish a common goal, services need to communicate with one another and keep each other in 
the loop. Each time a service does something, it sends a message about that particular event.

Streaming and messaging tools enable service-to-service communication by transporting messages 
(i.e. events) between systems. Individual services connect to the messaging service to either 
publish events, read messages from other services, or both. This dynamic creates an environment 
where individual apps are either publishers, meaning they write events, or subscribers that read 
events, or more likely both.

### Problem it addresses

As services proliferate, application environments become increasingly complex, making the 
management of communication between apps more challenging. A streaming or messaging platform 
provides a central place to publish and read all the events that occur within a system, 
allowing applications to work together without necessarily knowing anything about one another.

### How it helps

When a service does something other services should know about, it "publishes" an event to the 
streaming or messaging tool. Services that need to know about these types of events “subscribe” 
and watch the streaming or messaging tool. That's the essence of a publish-subscribe, or just 
pub-sub, approach and is enabled by these tools.

By introducing a "go-between" layer that manages all communication, we are decoupling services 
from one another. They simply watch for events, take action, and publish a new one.

Here's an example. When you first sign up for Netflix, the "signup" service publishes a "new signup 
event" to a messaging platform with further details such as name, email address, subscription 
level, etc. The "account creator" service, which subscribes to signup events, will see the event and
create your account. A "customer communication" service that also subscribes to new signup 
events will add your email address to the customer mailing list and generate a welcome email, 
and so on.

This allows for a highly decoupled architecture where services can collaborate without needing to 
know about one another. This decoupling enables engineers to add new functionality without 
updating downstream apps, known as consumers, or sending a bunch of queries. The more decoupled a 
system is, the more flexible and amenable it is to change. And that is exactly what engineers 
strive for in a system.

### Technical 101

Messaging and streaming tools have been around long before cloud native became a thing. To 
centrally manage business-critical events, organizations have built large enterprise service 
buses. But when we talk about messaging and streaming in a cloud native context, we’re generally 
referring to tools like NATS, RabbitMQ, Kafka, or cloud provided message queues.

What these systems have in common are the architecture patterns they enable. Application 
interactions in a cloud native environment are either orchestrated or choreographed. There's a 
lot more to it, but let's just say that orchestrated refers to systems that are centrally managed, 
and choreographed systems allow individual components to act independently.

Messaging and streaming systems provide a central place for choreographed systems to communicate. 
The message bus provides a common place where all apps can go to tell others what they’re doing 
by publishing messages, or see what's going on by subscribing to messages.

The NATS and Cloudevents projects are both incubating CNCF projects in this space. NATS provides a 
mature messaging system and Cloudevents is an effort to standardize message formats between 
systems. Strimzi, Pravega, and Tremor are sandbox projects with each being tailored to a unique 
use case around streaming and messaging.

</section>

<section data-subcategory="Application Definition & Image Build"
         data-buzzwords="Package Management, Charts, Operators">

### What it is

Application definition and image build is a broad category that can be broken down into two main 
subgroups. First, developer-focused tools that help build application code into containers and/or 
Kubernetes. And second, operations-focused tools that deploy apps in a standardized way. Whether 
you intend to speed up or simplify your development environment, provide a standardized way to 
deploy third-party apps, or wish to simplify the process of writing a new Kubernetes extension, 
this category serves as a catch-all for a number of projects and products that optimize the 
Kubernetes developer and operator experience.

### Problem it addresses     

Kubernetes, and containerized environments more generally, are incredibly flexible and powerful. 
With that flexibility also comes complexity, mainly in the form of multiple configuration options 
as well as multiple demands for the various use cases. Developers need the ability to create 
reproducible images when they containerize their code. Operators need a standardized way to deploy 
apps into container environments, and finally, platform teams need to provide tools to simplify 
image creation and application deployment, both for in-house and third party applications.

### How it Helps

Tools in this space aim to solve some of these developer or operator challenges. On the developer 
side, there are tools that simplify the process of extending Kubernetes to build, deploy, and 
connect applications. A number of projects and products help to store or deploy pre-packaged apps. 
These allow operators to quickly deploy a streaming service like NATS or Kafka or install a service 
mesh like Linkerd.

Developing cloud native applications brings a whole new set of challenges calling for a large set 
of diverse tools to simplify application build and deployments. As you start addressing operational 
and developer concerns in your environment, look for tools in this category.

### Technical 101

Application definition and build tools encompass a huge range of functionality. From extending 
Kubernetes to virtual machines with KubeVirt, to speeding app development by allowing you to port 
your development environment into Kubernetes with tools like Telepresence. At a high level, tools 
in this space solve either developer-focused concerns, like how to correctly write, package, test, 
or run custom apps, or operations-focused concerns, such as deploying and managing applications.

Helm, the only graduated project in this category, underpins many app deployment patterns. Helm 
allows Kubernetes users to deploy and customize many popular third-party apps, and it has been 
adopted by other projects like the Artifact Hub (a CNCF sandbox project). Companies like Bitnami 
also provide curated catalogs of apps. Finally, Helm is flexible enough to allow users to customize 
their own app deployments and is often used by organizations for their own internal releases.

The Operator Framework is an incubating project aimed at simplifying the process of building and 
deploying operators. Operators are out of scope for this guide but let's note here that they help 
deploy and manage apps, similar to Helm (you can read more about operators 
[here](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)). Cloud Native Buildpacks, 
another incubating project, aims to simplify the process of building application code into 
containers.

There’s a lot more in this space and exploring it all would require a dedicated chapter. But 
research these tools further if you want to make Kubernetes easier for developers and operators. 
You’ll likely find something that meets your needs.

</section>

<section data-subcategory="Continuous Integration & Delivery"
         data-buzzwords="CI/CD, Continuous integration, Continuous delivery, Continuous deployment, Blue/green, Canary deploy">

### What it is

Continuous integration (CI) and continuous delivery (CD) tools enable fast and efficient development 
with embedded quality assurance. CI automates code changes by immediately building and testing the 
code, ensuring it produces a deployable artifact. CD goes one step further and pushes the artifact 
through the deployment phases.

Mature CI/CD systems watch source code for changes, automatically build and test the code, then 
begin moving it from development to production where it has to pass a variety of tests or validation 
to determine if the process should continue or fail. Tools in this category enable such an approach.

### Problem it addresses

Building and deploying applications is a difficult and error-prone process, particularly when it 
involves a lot of human intervention and manual steps. The longer a developer works on a piece of 
software without integrating it into the codebase, the longer it will take to identify an error and 
the more difficult it will be to fix. By integrating code on a regular basis, errors are caught 
early and are easier to troubleshoot. After all, finding an error in a few lines of code is a lot 
easier than doing so in a few hundred lines of code, or, even worse, finding it once it reaches 
production.

While tools like Kubernetes offer great flexibility for running and managing apps, they also create 
new challenges and opportunities for CI/CD tooling. Cloud native CI/CD systems are able to 
leverage Kubernetes itself to build, run, and manage the CI/CD process, often referred to as a 
pipeline. Kubernetes also provides information about app health, enabling cloud native CI/CD tools 
to more easily determine if a given change was successful or should be rolled back.

### How it helps

CI tools ensure that any code change or updates developers introduce are built, validated, and 
integrated with other changes automatically and continuously. Each time a developer adds an update, 
automated testing is triggered to ensure only good code makes it into the system. CD extends CI to 
include pushing the result of the CI process into production-like and production environments.

Let's say a developer changes the code for a web app. The CI system sees the code change, then 
builds and tests a new version of that web app. The CD system takes that new version and deploys 
it into a dev, test, pre-production, and finally production environment. It does that while testing 
the deployed app after each step in the process. All together these systems represent a CI/CD 
pipeline for that web app.

### Technical 101

Over time, a number of tools have been built to help with the process of moving code from a source 
code repository to production. Like most other areas of computing, the advent of cloud native 
development has changed CI/CD systems. Some traditional tools like Jenkins, probably the most 
prolific CI tool on the market, have [overhauled](https://jenkins-x.io/) themselves entirely to 
better fit into the Kubernetes ecosystem. Others, like Flux and Argo have pioneered a new way of 
doing continuous delivery called GitOps, which the OpenGitOps project is working to define as a
vendor-neutral standard.

In general, you’ll find projects and products in this space are either (1) CI systems, (2) CD 
systems, (3) tools that help the CD system decide if the code is ready to be pushed into production, 
or (4), in the case of Spinnaker and Argo, all three. Flux and Argo are CNCF gratuated projects in this 
space, Keptn is the CNCF incubating project, along with the CNCF sandbox projects 
OpenFeature, OpenGitOps and OpenKruise.
You can also find many more options hosted by the 
[Continuous Delivery Foundation](https://cd.foundation/). Look for tools in this space to help 
your organization automate your path to production.

</section>

### Summary: App Definition & Development

As we've seen, tools in the application definition and development layer enable engineers to build 
cloud native apps. You'll find databases to store and retrieve data or streaming and messaging 
tools allowing for decoupled, choreographed architectures. Application definition and image build 
tools include a variety of technologies that improve the developer and operator experience. 
Finally, CI/CD helps engineers catch any errors early on, ensuring code is ready for deployment 
by driving up  quality.

This chapter concludes the layers of the CNCF landscape. Next we'll focus on the observability and 
analysis "column."

<section data-category="Observability and Analysis">

Now that we've worked our way through the layers of the CNCF landscape, we'll focus on the columns 
starting with observability and analysis.

Before diving into these categories, let's first define observability and analysis. Observability 
is a system characteristic describing the degree to which a system can be understood from its 
external outputs. Measured by CPU time, memory, disk space, latency, errors, etc., computer systems 
can be more or less observable. Analysis is an activity in which you look at this observable data 
and make sense of it.

To ensure there is no service disruption, you'll need to observe and analyze every aspect of your 
application so every anomaly gets detected and rectified right away. This is what this category is 
all about. It runs across and observes all layers which is why it's on the side and not embedded 
in a specific layer.

Tools in this category are broken down into logging, monitoring, tracing, and chaos engineering. 
Please note that the category name is somewhat misleading — although chaos engineering is listed 
here, consider it a reliability tool rather than an observability or analysis tool.

</section>

<section data-subcategory="Monitoring"
         data-buzzwords="Monitoring, Time series, Alerting, Metrics">

### What it is

Monitoring refers to instrumenting an app to collect, aggregate, and analyze logs and metrics to 
improve our understanding of its behavior. While logs describe specific events, metrics are a 
measurement of a system at a given point in time — they are two different things but both necessary 
to get the full picture of your system's health. Monitoring includes everything from watching disk 
space, CPU usage, and memory consumption on individual nodes to doing detailed synthetic 
transactions to see if a system or application is responding correctly and in a timely manner. 
There are a number of different approaches to monitor systems and applications.

### Problem it addresses

When running an application or platform, you want it to accomplish a specific task as designed and 
ensure it's only accessed by authorized users. Monitoring allows you to know if it is working 
correctly, securely, cost effectively, only accessed by authorized users, as well as any other 
characteristic you may be tracking.

### How it helps

Good monitoring allows operators to respond quickly, and even automatically, when an incident 
arises. It provides insights into the current health of a system and watches for changes. 
Monitoring tracks everything from application health to user behaviour and is an essential 
part of effectively running applications.

### Technical 101

Monitoring in a cloud native context is generally similar to monitoring traditional applications. 
You need to track metrics, logs, and events to understand the health of your applications. The 
main difference is that some of the managed objects are ephemeral, meaning they may not be long 
lasting so tying your monitoring to objects like auto generated resource names won’t be a good long 
term strategy. There are a number of CNCF projects in this space that largely revolve around 
Prometheus, the CNCF graduated project.

</section>

<section data-subcategory="Logging"
         data-buzzwords="Logging">

### What it is

Applications emit a steady stream of log messages describing what they are doing at any given time. 
These log messages capture various events happening in the system such as failed or successful 
actions, audit information, or health events. Logging tools collect, store, and analyze these 
messages to track error reports and related data. Along with metrics and tracing, logging is one 
of the pillars of observability.

### Problem it addresses

Collecting, storing, and analyzing logs is a crucial part of building a modern platform and 
logging performs one or all of those tasks. Some tools handle every aspect from collection to 
analysis while others focus on a single task like collection. All logging tools aim at helping 
organizations gain control over their log messages.

### How it helps

When collecting, storing, and analyzing application log messages, you'll understand what an 
application was communicating at any given time. But as logs only represent messages that 
applications or platforms deliberately emit, they don’t necessarily pinpoint the root cause of a 
given issue. That being said, collecting and retaining log messages over time is an extremely 
powerful capability and will help teams diagnose issues and meet regulatory and compliance 
requirements.

### Technical 101

Collecting, storing, and processing log messages is by no means a new problem, but cloud native 
patterns and Kubernetes have significantly changed the way logs are handled. Some traditional 
approaches to logging that were appropriate for virtual and physical machines, like writing logs 
to a file on a local disk, are ill suited to containerized applications, where  file systems don't 
outlast an application. In a cloud native environment, log collection tools like Fluentd run 
alongside application containers and collect messages directly from the applications. Messages 
are then forwarded on to a central log store to be aggregated and analyzed.

Fluentd is the only CNCF project in this space.

</section>

<section data-subcategory="Tracing"
         data-buzzwords="Span, Tracing">

### What it is

In a microservices world, services are constantly communicating with each other over the network. 
Tracing, a specialized use of logging, allows you to trace the path of a request as it moves 
through a distributed system.

### Problem It addresses

Understanding how a microservice application behaves at any given point in time is an extremely 
challenging task. While many tools provide deep insights into service behavior, it can be difficult 
to tie an action of an individual service to the broader understanding of how the entire app 
behaves.

### How it helps

Tracing solves this problem by adding a unique identifier to messages sent by the application. 
That unique identifier allows you to follow (or trace) individual transactions as they move through 
your system. You can use this information to see the health of your application as well as 
debug problematic microservices or activities.

### Technical 101

Tracing is a very powerful debugging tool that allows you to troubleshoot and fine tune the 
behaviour of a distributed application. That power does come at a cost. Application code needs 
to be modified to emit tracing data and any spans (a representation of individual units of work 
done in a distributed system) need to be propagated by infrastructure components (e.g. service 
meshes and their proxies) in the data path of your application. Jaeger and Open Tracing are CNCF 
projects in this space.

</section>

<section data-subcategory="Chaos Engineering"
         data-buzzwords="Chaos Engineering">

### What it is

Chaos engineering refers to the practice of intentionally introducing faults into a system in 
order to test its resilience and ensure applications and engineering teams are able to withstand 
turbulent and unexpected events. A chaos engineering tool will provide a controlled way to 
introduce faults and run specific experiments against a particular instance of an application.

### Problem it addresses  

Complex systems fail. They fail for a host of reasons and in a distributed system the consequences 
are typically hard to understand. Chaos engineering is embraced by organizations that accept that 
failures will occur and, instead of trying to prevent failures, practice recovering from them. 
This is referred to as optimizing for 
[mean time to repair](https://en.wikipedia.org/wiki/Mean_time_to_repair), or MTTR.

> ##### INFOBOX
> 
> The traditional approach to maintaining high availability for applications is referred to as 
> optimizing for [mean time between failures](https://en.wikipedia.org/wiki/Mean_time_between_failures), 
> or MTBF. You can observe this practice in organizations that use things like "change review 
> boards" and "long change freezes" to keep an application environment stable by restricting 
> changes. The authors of [Accelerate](https://itrevolution.com/accelerate-book/) suggest that 
> high performing IT organizations achieve high availability by optimizing for mean time to 
> recovery, or MTTR, instead.

### How it Helps
In a cloud native world, applications must dynamically adjust to failures, a relatively new 
concept. That means, when something fails, the system doesn't go down completely but gracefully 
degrades or recovers. Chaos engineering tools enable you to experiment on a software system in 
production to ensure they perform gracefully should a real failure occur.

In short, you experiment with a system because you want to be confident that it can withstand 
turbulent and unexpected conditions. Instead of waiting for something to happen and find out, you 
place it under duress in controlled conditions to identify weaknesses and fix them before chance 
uncovers them for you.

### Technical 101

Chaos engineering tools and practices are critical to achieving high availability for your 
applications. Distributed systems are often too complex to be fully understood by any one engineer 
and no change process can fully predetermine the impact of changes on an environment. By 
introducing deliberate chaos engineering practices teams are able to practice and automate 
failure recovery. Chaos Mesh and Litmus Chaos are two CNCF tools in this space.

</section>

### Summary: Observability & Analysis

As we've seen, the observability and analysis column is all about understanding the health of your 
system and ensuring it stays operational even under tough conditions. Logging tools capture event 
messages emitted by apps, monitoring watches logs and metrics, and tracing follows the path of 
individual requests. When combined, these tools ideally provide a 360 degree view of what's going 
on within your system. Chaos engineering is a little different. It provides a safe way to verify 
the system can withstand unexpected events, ensuring it stays healthy.

Next, we'll focus on cloud native platforms. Configuring tools across the landscape so they work 
well together is no easy task. Platforms bundle them together, easing adoption.

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
installation and upgrades. Many Kubernetes distributions include other proprietary or open source 
applications.

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

<section data-subcategory="Certified Kubernetes - Installer"
         data-buzzwords="Installer">

### What it is

Kubernetes installers help install Kubernetes on a machine. They automate the Kubernetes 
installation and configuration process and may even help with upgrades. Kubernetes installers 
are often coupled with or used by Kubernetes distributions or hosted Kubernetes offerings.

### Problem it addresses  

Similar to Kubernetes distributions, Kubernetes installers simplify getting started with 
Kubernetes. Open source Kubernetes relies on installers like kubeadm which, as of this writing, 
is part of the Certified Kubernetes Administrator certification exam to get Kubernetes clusters 
up and running.

### How it helps

Kubernetes installers ease the Kubernetes installation process. Like distributions, they provide a 
vetted source for the source code and version. They also often ship with opinionated Kubernetes 
environment configurations. Kubernetes installers like [kind](https://kind.sigs.k8s.io/) 
(Kubernetes in Docker) allow you to get a Kubernetes cluster with a single command.

### Technical 101

Whether you’re installing Kubernetes locally on Docker, spinning up and provisioning new virtual 
machines, or preparing new physical servers, you’re going to need a tool to handle all the 
preparation of various Kubernetes components (unless you’re looking to do it the 
[hard way](https://github.com/kelseyhightower/kubernetes-the-hard-way)).

Kubernetes installers simplify that process. Some handle spinning up nodes and others merely 
configure nodes you’ve already provisioned. They all offer various levels of automation and each 
suits different use cases. When getting started with an installer, start by understanding your 
needs, then pick an installer that addresses them. At the time of this writing, kubeadm is 
considered so fundamental to the Kubernetes ecosystem that it’s included as part of the CKA, 
certified Kubernetes administrator exam. Minikube, kind, kops, and kubespray are all CNCF-owned 
Kubernetes installer projects.

</section>

<section data-subcategory="PaaS/Container Service"
         data-buzzwords="">

### What it is

A Platform-as-a-Service, or PaaS, is an environment that allows users to run applications 
without necessarily concerning themselves with the details of the underlying compute resources. 
PaaS and container services in this category are mechanisms to either host a PaaS for developers 
or host services they can use.

### Problem it addresses  

We’ve talked a lot about the tools and technologies around cloud native. A PaaS attempts to 
connect many of the technologies found in this landscape in a way that provides direct value 
to developers. It answers the following questions: how will I run applications in various 
environments? And, once running, how will my team and users interact with them?

### How it helps

PaaS provides opinions and choices around how to piece together the various open and closed 
source tools needed to run applications. Many offerings include tools that handle PaaS installation 
and upgrades and the mechanisms to convert application code into a running application. 
Additionally, PaaS handles the runtime needs of application instances, including on-demand 
scaling of individual components and visibility into the performance and log messages of 
individual apps.

### Technical 101

Organizations are adopting cloud native technologies to achieve specific business or 
organizational objectives. A PaaS provides a quicker path to value than building a custom 
application platform. Tools like Cloud Foundry Application Runtime help organizations get up 
and running with new applications quickly. They excel at providing the tools needed to 
run [12 factor](https://12factor.net/) or cloud native applications.

Any PaaS comes with its own set of trade-offs and restrictions. Most only work with a subset of 
languages or application types and the opinions and decisions baked into these platforms may or 
may not be a good fit for your needs. Stateless applications tend to do very well in a PaaS but 
stateful applications like databases usually don’t. There are currently no CNCF projects in this 
space but most of the offerings are open source and Cloud Foundry is managed by the Cloud Foundry 
Foundation.

</section>

### Summary: Platform

As we've seen there are multiple tools that help ease Kubernetes adoption. From Kubernetes 
distributions and hosted Kubernetes to more barebones installers or PaaS, they all take various 
installation and configuration burdens and pre-package them for you. Each solution comes with its 
own "flavor." Vendor opinions about what's important and appropriate are built into the solution.

Before adopting any of these, you'll need to do some research to identify the best solution for 
your particular use case. Will you likely encounter advanced Kubernetes scenarios where you'll need 
control over the control plane? If so, hosted solutions may not be a good fit. Do you have a small 
team that manages "standard" workloads and needs to offload as many operational tasks as possible? 
There are multiple aspects to consider. While there is no single best tool for all use cases, 
there certainly will be an optimal tool for your needs. 

## Summary: Cloud Native Landscape

Now that we've broken the CNCF Cloud Native Landscape down and discussed it layer by layer, 
category by category, it probably feels less overwhelming. There is a logical structure to it and, 
once you understand it, navigating the landscape becomes a lot easier. 

The layers of the CNCF Landscape build on each other. First, there is the **provisioning** layer 
with the tools needed to lay the infrastructure foundation. Next is the **runtime** layer where 
everything revolves around containers and what they need to run in a cloud native environment. 
The **orchestration and management** layer contains the tools to orchestrate and manage your 
containers and applications — in other words, the tools needed to create the platform on which 
applications are built. The **application and definition and development** layer is concerned with the tooling 
needed to enable applications to store and send data as well as with the ways we build and 
deploy our applications. 

Next to the layers, there are two columns. The **observability and analysis** column includes 
tools that monitor applications and flag when something is wrong. Since all layers have to be 
monitored, this category runs across all of them. And finally, there are **platforms**. Platforms 
don't provide new functionality, instead, they bundle multiple tools across the different layers 
together, configuring and fine-tuning them so they are ready to be used. This eases the adoption of 
cloud native technologies and may even be the only way organizations are able to leverage them. 

This concludes the CNCF Landscape guide. We hope you enjoyed the read and that we were able to 
bring a little more clarity to the landscape.

> ##### NOTE
> 
> The cloud native space evolves quickly. If you see anything that's outdated, please submit a PR 
> so we can update it. We want this to be a living document and appreciate your contribution.