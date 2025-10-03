terraform {
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.region
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"
  name = "esim-myanmar-vpc"
  cidr = "10.0.0.0/16"
  azs  = slice(data.aws_availability_zones.available.names, 0, 3)
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"
  cluster_name = "esim-myanmar-cluster"
  cluster_version = "1.27"
  subnets = module.vpc.private_subnets
  vpc_id = module.vpc.vpc_id
}
