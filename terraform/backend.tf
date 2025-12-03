terraform {
  backend "s3" {
    bucket         = "kanyuy-mern-2025"
    key            = "staff-task-manager/terraform.tfstate"
    region         = "af-south-1"
    use_lockfile   = true
  }
}