terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1" # Mumbai Data Center for RBI data sovereignty compliance
}

# Core EKS Cluster for Microservices
resource "aws_eks_cluster" "upi_k8s" {
  name     = "upi-fraud-cluster-prod"
  role_arn = aws_iam_role.eks_master_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  }
}

# Managed Kafka for Event Streaming
resource "aws_msk_cluster" "kafka" {
  cluster_name           = "upi-event-bus"
  kafka_version          = "3.4.0"
  number_of_broker_nodes = 3
  
  broker_node_group_info {
    instance_type = "kafka.m5.large"
    client_subnets = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_groups = [aws_security_group.msk_sg.id]
  }
}

# Redis Elasticache for Stateful streaming features
resource "aws_elasticache_cluster" "feature_store" {
  cluster_id           = "upi-feature-store"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 2
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# IAM Roles (Placeholders)
resource "aws_iam_role" "eks_master_role" {
  name = "eks_master_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "eks.amazonaws.com" } }]
  })
}
