# Jenkins & Docker CI/CD Pipeline 🚀

An end-to-end CI/CD pipeline built with Jenkins, Docker, and SonarQube. This repository contains the application source code and the main `Jenkinsfile` that orchestrates the entire build, scan, and deployment process.

This project implements a **Multi-SCM** checkout architecture. It pulls the main application code from this repository (`jenkins-docker-cicd-pipeline`), and pulls deployment configurations from a secondary repository (`Jenkins-pipeline-deployment-configs`).

## 🏗️ Pipeline Architecture

1. **Multi-SCM Checkout**: Jenkins pulls code from `jenkins-docker-cicd-pipeline` (App) and `Jenkins-pipeline-deployment-configs` (Config).
2. **Code Quality Scan**: Code is analyzed using SonarQube to ensure quality gates are met.
3. **Containerization**: If the code passes the quality scan, a Docker image is built.
4. **Deployment**: The Docker image is deployed to a remote environment.
5. **Notifications**: Success or failure notifications are sent to the team.

## ✅ Completion Checklist

- [ ] Jenkins worker node configured
- [ ] Required plugins installed
- [ ] Multi-SCM checkout configured (Main Repo + Config Repo)
- [ ] SonarQube scan integrated
- [ ] Docker image built successfully
- [ ] Pipeline committed to GitHub
