#!/bin/bash
REGION=$1

function fail(){
  tput setaf 1; echo "Failure: $*" && tput sgr0
  exit 1
}

function info() {
  tput setaf 6; echo "$*" && tput sgr0
}

function success() {
  tput setaf 2; echo "$*" && tput sgr0
}

function check_aws() {
  info "checking aws cli configuration..."

	if ! [ -f ~/.aws/config ]; then
		if ! [ -f ~/.aws/credentials ]; then
			fail "AWS config not found or CLI not installed. Please run \"aws configure\"."
		fi
	fi

  success "aws cli is configured"
}

function delete_application() {
  info "Deleting SNS Plataform Application for Firebase"

  ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
  ARN="arn:aws:sns:$REGION:$ACCOUNT_ID:app/GCM/FirebasePlatform"

  echo "ARN $ARN"

  aws sns delete-platform-application --platform-application-arn $ARN
  
  success "SNS Plataform Application has been deleted"
}

check_aws
delete_application
