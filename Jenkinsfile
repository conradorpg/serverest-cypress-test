pipeline {
    agent any

    stages {
        stage('Repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/conradorpg/serverest-cypress-test.git'
            }
        }
        stage('Dependências') {
            steps {
                sh 'npm install'
            }
        }
        stage('Testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}
