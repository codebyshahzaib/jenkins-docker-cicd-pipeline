pipeline {
    agent {
        label 'laptop-node'
    }

    environment {
        SECONDARY_REPO_URL = "https://github.com/codebyshahzaib/Jenkins-pipeline-deployment-configs.git"
        DOCKER_IMAGE_NAME = "jenkins-cicd-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out Main Application Repository...'                
                echo 'Checking out Secondary Configuration Repository...'
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
                    sh "\"${SCANNER_HOME}/bin/sonar-scanner\""
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
                        sh "\"${SCANNER_HOME}/bin/sonar-scanner\" -Dsonar.projectKey=jenkins-cicd-configs -Dsonar.projectName='Jenkins CICD Configs' -Dsonar.sources=."
                    }
                }
            }
        }

        stage('Build & Push Docker Image') {
    steps {
        echo 'Building Docker image for the application...'
        sh "docker build -t codesbyshahzaib/react-app-a5:latest -f app/Dockerfile app"
        
        echo 'Logging into Docker Hub and pushing image...'
        withCredentials([usernamePassword(credentialsId: '8e0c884f-1af6-4bf9-87d8-6220544b7e88', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
            sh "echo \$PASS | docker login -u \$USER --password-stdin"
            sh "docker push codesbyshahzaib/react-app-a5:latest"
        }
    }
}

        stage('Deploy to Remote Location') {
            steps {
                echo 'Deploying application to remote environment...'
                //TODO 
            }
        }
    }

    post {
        success {
            echo ' Pipeline finished successfully! Sending notification...'
            emailext (
                subject: " SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The pipeline completed successfully!",
                to: "shahzaib@camp2.tkxel.com" 
            )
        }
        failure {
            echo ' Pipeline failed! Sending alert...'
            emailext (
                subject: " FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The pipeline has failed.",
                to: "shahzaib@camp2.tkxel.com" 
            )
        }
    }
}
