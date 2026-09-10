pipeline {
    // Defines the Jenkins agent to run this pipeline. 
    // TODO: Update 'my-worker-node' with your actual worker node label.
    agent { label 'my-worker-node' }

    environment {
        // Define global variables here
        DOCKER_IMAGE_NAME = "my-python-app"
        
        // TODO: Replace 'your-username' with your actual GitHub username
        SECONDARY_REPO_URL = "https://github.com/your-username/pipeline-deployment-configs.git"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out Main Application Repository...'
                // Note: The main repository (jenkins-docker-cicd-pipeline) is automatically checked out by the Jenkins job configuration.
                
                echo 'Checking out Secondary Configuration Repository (Multi-SCM)...'
                // Checking out the secondary repo into a specific folder named "deployment-configs"
                dir('deployment-configs') {
                    git branch: 'main', url: "${env.SECONDARY_REPO_URL}"
                }
            }
        }

        stage('Code Quality (SonarQube Scan)') {
            steps {
                echo 'Running SonarQube static code analysis...'
                // TODO: Configure SonarQube server in Jenkins and uncomment the block below
                // withSonarQubeEnv('My SonarQube Server') {
                //     sh 'sonar-scanner'
                // }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for the application...'
                // TODO: Ensure Docker is installed on your worker node and uncomment the block below
                // sh "docker build -t ${env.DOCKER_IMAGE_NAME}:latest ."
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
