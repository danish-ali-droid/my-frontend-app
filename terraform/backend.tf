terraform {
  
backend "s3" {
  bucket = "frontend-state-file-bucket"
  key    = "terraform.tfstate"
  region = "us-east-1"
  encrypt = true
  use_lockfile = true
  
}
}