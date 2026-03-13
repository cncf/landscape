# Landscape Guide — Architecture Layers

The architecture diagram includes multiple columns and a bottom-most layer labeled **Special**, which are not currently documented.  
This document provides clear explanations for those components.

---

### Serverless Column
Represents services that run without dedicated server management, scale automatically, and execute on demand or via events.  
Common use: cloud functions, scheduled triggers, background event-driven tasks.  
Examples: AWS Lambda, Azure Functions, Google Cloud Functions.

---

### Members Column
Represents users or entities that interact with, own, or maintain parts of the landscape.  
Includes maintainers, contributors, project owners, or affiliated members with access or responsibility in the system.

---

### Special Layer (Bottom-most)
Contains components that do not belong to standard infrastructure categories but are still essential to the ecosystem.  
Includes internal tools, experimental modules, auxiliary automation, legacy support services, or one-off dependencies that require separate classification.