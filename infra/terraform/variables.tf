variable "aws_region" { type = string default = "us-east-1" }
variable "db_username" { type = string default = "flowforge" }
variable "db_password" { type = string sensitive = true }
