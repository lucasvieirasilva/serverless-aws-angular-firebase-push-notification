#!/bin/bash
FIREBASE_API_KEY=$1

function fail() {
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

function create_application() {
  info "Creating SNS Plataform Application for Firebase"

  aws sns create-platform-application --name FirebasePlatform --platform GCM --attributes PlatformCredential=$FIREBASE_API_KEY
  
  success "SNS Plataform Application has been created"
}

check_aws
create_application