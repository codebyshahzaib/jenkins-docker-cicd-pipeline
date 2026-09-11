pipeline {
    agent any

    environment {
        SECONDARY_REPO_URL = "https://github.com/codebyshahzaib/Jenkins-pipeline-deployment-configs.git"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out Main Application Repository...'                
                echo 'Checking out Secondary Configuration Repository (Multi-SCM)...'
                dir('deployment-configs') {
                    git branch: 'main', url: "${env.SECONDARY_REPO_URL}"
                }
            }
        }

        stage('Code Quality (Main App)') {
            environment {
                SCANNER_HOME = tool 'sonar-scanner'
            }
            steps {
                echo 'Running SonarQube static code analysis for Main Application...'
                withSonarQubeEnv('My SonarQube Server') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }

        stage('Code Quality (Secondary Configs)') {
            environment {
                SCANNER_HOME = tool 'sonar-scanner'
            }
            steps {
                echo 'Running SonarQube static code analysis for Secondary Configuration...'
                dir('deployment-configs') {
                    withSonarQubeEnv('My SonarQube Server') {
                        sh "${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=jenkins-cicd-configs -Dsonar.projectName='Jenkins CICD Configs' -Dsonar.sources=."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for the application...'
                // TODO: Ensure Docker is installed on your worker node and uncomment the block below
                // sh "docker build -t ${env.DOCKER_IMAGE_NAME}:latest -f app/Dockerfile app"
            }
        }

        stage('Deploy to Remote Location') {
            steps {
                echo 'Deploying application to remote environment...'
                // TODO: Add deployment scripts here. 
                // You can execute the scripts that were pulled from your secondary repository!
                // sh "bash deployment-configs/scripts/deploy.sh"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline finished successfully! Sending notification...'
            // TODO: Add Email or Slack notification plugin steps here
        }
        failure {
            echo '❌ Pipeline failed! Sending alert...'
            // TODO: Add Email or Slack notification plugin steps here
        }
    }
}
