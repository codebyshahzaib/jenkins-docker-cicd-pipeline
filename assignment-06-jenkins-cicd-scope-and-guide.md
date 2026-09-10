# Assignment 06 – Jenkins CI/CD Pipeline & Code Quality
## Scope Definition & Implementation Guide

---

## 1. Scope Definition

### 1.1 Objective
Build a single Jenkins **declarative pipeline** that takes source code from more than one SCM source, runs a static code quality scan (SonarQube), packages the app into a Docker image, ships that image to a remote host, and reports pipeline outcome (success/failure) via a notification channel — all running on a dedicated Jenkins **agent/worker node**, not the Jenkins controller itself.

### 1.2 In-Scope Work Items
Mapping the assignment bullets into concrete deliverables:

| # | Assignment Line | What It Actually Requires |
|---|---|---|
| 1 | Worker node/agent in Jenkins | A second machine (or container) registered as a Jenkins **agent**, with the pipeline's `agent` directive pointing at it (by label), not running on the controller |
| 2 | Install Git/SCM/webhook/Email plugins | Jenkins plugin installs: Git plugin, GitHub/GitLab/Bitbucket plugin (whichever SCMs you use), Multibranch/Pipeline SCM support, Generic Webhook Trigger (or GitHub/GitLab native webhook), Email Extension plugin |
| 3 | Multi-SCM checkout | Pipeline stage that checks out code from **two or more** distinct repositories (e.g. app repo + config repo, or app repo + infra repo) into the same workspace |
| 4 | Checkout → SonarQube scan | SonarQube Scanner plugin configured, `sonar-project.properties` or scanner CLI pointed at the checked-out code, results pushed to a SonarQube server |
| 5 | Clean code and set up on Docker | Interpreted as: act on SonarQube's findings/quality gate (fail pipeline if gate fails), then build a Docker image of the app if the gate passes |
| 6 | Deploy Docker to a remote location | Push image to a registry (Docker Hub / private registry / ECR) and/or SSH into a remote host to pull and run the container there |
| 7 | Success/Failure message | `post { success {} failure {} }` block in the pipeline wired to Email and/or Slack |

### 1.3 Out of Scope (unless your internship supervisor says otherwise)
- Kubernetes deployment (this assignment is Docker-only — K8s is a separate track you're learning)
- Building the application itself — you're integrating CI/CD around an existing app (can reuse the Node.js app from your SonarQube/Prometheus learning project)
- Full observability stack (Prometheus/Grafana) — that belongs to the larger internship project, not this assignment
- Infrastructure provisioning (Terraform) for the Jenkins/Sonar/Docker hosts — assume these servers already exist, or stand them up minimally just to support this pipeline

### 1.4 Assumptions to Confirm Before Starting
- You have (or will stand up): a Jenkins controller, a second machine to act as agent, a SonarQube server, a Docker-capable remote host, and a Git remote (GitHub/GitLab) with at least two repos or two branches to satisfy "multi-SCM"
- "Remote location" for deployment can be a second EC2/VM reachable via SSH — it does not need to be a separate cloud account
- Notification can be Email (simplest, matches the plugin list given) — Slack is a valid substitute/addition if your team already uses it

### 1.5 Deliverables (tied to the Completion Checklist)
1. A working Jenkins agent node visible as "online" in Jenkins → Manage Nodes
2. Screenshot/list of installed plugins
3. Pipeline script (Jenkinsfile) committed to a GitHub repo
4. SonarQube project dashboard showing at least one completed analysis
5. Docker image visible either in `docker images` on the remote host or in a registry
6. Console log or recording showing a full green pipeline run, and one deliberately broken run showing the failure notification firing
7. Short README explaining the pipeline stages and how to reproduce

---

## 2. Architecture Overview (Conceptual)

```
 Git Repo A ─┐
             ├─► Jenkins Controller ─► Jenkins Agent (worker node)
 Git Repo B ─┘                              │
                                             ├─► SonarQube Server (scan + quality gate)
                                             │
                                             ├─► Docker Build (on agent or via Docker-in-Docker)
                                             │
                                             ├─► Push to Registry (optional) 
                                             │
                                             ├─► SSH Deploy → Remote Docker Host (run container)
                                             │
                                             └─► Email/Slack Notification (success or failure)
```

Key design decision: the **agent** is where checkout, scanning, and Docker build happen. The **controller** only orchestrates. This is what "set a worker node" is testing — many beginners run everything on the controller (`agent any` with no dedicated label), which technically works but misses the point of the exercise.

---

## 3. Step-by-Step Guide

### Step 1 — Provision and Register the Jenkins Agent
- Stand up a second VM/container (can be a small EC2 instance or a Docker container running an SSH server + Java).
- In Jenkins: **Manage Jenkins → Nodes → New Node**. Give it a name and a **label** (e.g. `docker-agent`) — this label is how your pipeline will target it.
- Connect it via SSH (Jenkins built-in SSH launcher, using a credential you add in Jenkins) or via a JNLP/inbound agent if SSH isn't available.
- Verify: the node shows "connected" and has enough tools installed on it (Git, Docker, Java if using inbound agent).

### Step 2 — Install Required Plugins
Go to **Manage Jenkins → Plugins → Available** and install:
- Git plugin (usually pre-installed)
- GitHub plugin or GitLab plugin, depending on where your repos live
- Pipeline / Pipeline: Multibranch (usually pre-installed)
- Generic Webhook Trigger plugin (or rely on the native GitHub/GitLab webhook trigger)
- Email Extension Plugin (for richer success/failure emails than the default Mailer)
- Docker Pipeline plugin (lets your Jenkinsfile use `docker.build(...)` syntax)
- SonarQube Scanner plugin

Restart Jenkins if prompted.

### Step 3 — Configure Global Tools & Servers
- **Manage Jenkins → System**: add your SonarQube server URL and an authentication token (generated from SonarQube itself) under "SonarQube servers."
- **Manage Jenkins → Tools**: register the SonarQube Scanner installation.
- **Manage Jenkins → Credentials**: add Git credentials (for private repos), SSH credentials (for the remote deploy host and the agent), and Docker registry credentials if pushing to one.
- Configure the Email Extension plugin with your SMTP server details (Gmail SMTP with an app password is the easiest for a class assignment).

### Step 4 — Set Up the Webhook
- In each GitHub/GitLab repo you're using: **Settings → Webhooks**, point it at your Jenkins URL's webhook endpoint (e.g. `http://<jenkins-host>/github-webhook/`).
- This is what makes the pipeline trigger automatically on push, instead of requiring a manual "Build Now."

### Step 5 — Design the Multi-SCM Checkout
- Decide what your second source is: a config repo, an infra-as-code repo, or simply a second branch/repo of the same app.
- In the pipeline, this becomes two checkout steps into two different subdirectories of the same workspace (conceptually — no need to write the exact syntax now, just plan the folder layout, e.g. `./app` and `./config`).
- Document why each source is needed — this is what the assignment is testing: can you justify checking out from more than one place, not just mechanically do it.

### Step 6 — Plan the SonarQube Stage
- Decide the scan target: which folder(s), which language analyzer (JS/TS analyzer if using your Node.js project).
- Decide the **quality gate** condition: what SonarQube metric(s) will fail the build (e.g. new bugs > 0, coverage below threshold). Set this gate in the SonarQube project's "Quality Gate" settings, not in Jenkins.
- Plan for the pipeline to **wait for and check the quality gate result** before proceeding to the Docker stage — this is the "clean code" gate the assignment refers to.

### Step 7 — Plan the Docker Build Stage
- Confirm a `Dockerfile` exists in your app repo (reuse the one from your Node.js SonarQube/Prometheus learning project if applicable).
- Decide the image tag scheme (e.g. `app-name:${BUILD_NUMBER}`).
- Decide whether you push to a registry (Docker Hub, ECR, or a private registry) or skip straight to deploying directly on the remote host via SSH + `docker load`/`docker build` there.

### Step 8 — Plan the Remote Deployment Stage
- Simplest approach for an assignment: SSH from the Jenkins agent into the remote Docker host, pull the newly built/pushed image, stop the old container, start the new one.
- Alternative: use `docker context` to point the Docker CLI on the agent directly at the remote Docker daemon over SSH, so `docker run` executes remotely without a separate SSH step.
- Either way, plan for zero-downtime-ish behavior: stop old container only after confirming the new image pulled successfully.

### Step 9 — Plan Notifications
- Use a `post` block concept: on pipeline success, send one email/Slack message; on failure, send a different one with the failure reason/link to console output.
- Test both paths deliberately — trigger one intentional failure (e.g. a bad quality gate or a broken Dockerfile) to prove the failure path actually fires, not just the success path.

### Step 10 — Test, Document, Submit
- Run the pipeline end-to-end at least twice: once clean (green), once forced-failing (to prove notifications work both ways).
- Write the README: pipeline diagram, plugin list, how to reproduce, and screenshots of a) the agent node online, b) a SonarQube analysis result, c) the Docker image on the remote host, d) both notification emails/messages.
- Record the 10-minute demo if that's still required for the broader internship deliverables (per your other internship documentation), or a shorter clip if this assignment is graded standalone.
- Commit the Jenkinsfile and README to GitHub and submit the repo link per the checklist.

---

## 4. Completion Checklist — Expanded

| Checklist Item | Done When |
|---|---|
| Jenkins worker node configured | Node shows "connected" in Manage Nodes, pipeline stages actually execute on it (check console log for the agent name) |
| Required plugins installed | Git, GitHub/GitLab, Webhook, Email Extension, Docker Pipeline, SonarQube Scanner all show under Installed Plugins |
| Multi-SCM checkout configured | Console log shows two distinct checkout operations from two distinct sources into the workspace |
| SonarQube scan integrated | SonarQube project dashboard shows a completed analysis tied to this pipeline's build number |
| Docker image built successfully | `docker images` on the agent or remote host lists the new tagged image |
| Pipeline committed to GitHub | Jenkinsfile + README visible in the repo's default branch |

---

## 5. Common Pitfalls to Avoid
- Running everything with `agent any` and never actually exercising the dedicated worker node label
- Only testing the success notification path and never proving failure notifications work
- Treating "multi-SCM" as checking out the same repo twice — pick genuinely distinct sources
- Skipping the quality gate check — building and deploying the Docker image regardless of SonarQube results defeats the "clean code" requirement
- Hardcoding credentials/IPs directly in the Jenkinsfile instead of using Jenkins Credentials store
