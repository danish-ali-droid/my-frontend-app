
  #===========================================================
      #  ec2 for frontend app   in private subnet                                                                                                          
  #===========================================================

  resource "aws_instance" "severs" {
    count = var.private_cidr_count
    ami           = "ami-0fe71de6f2bab5fbf"
    instance_type = "t3.micro"
    subnet_id     = aws_subnet.private_subnet[count.index].id
    key_name      = "danish-keypair"
   vpc_security_group_ids = [aws_security_group.instances_sg.id]
   iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
    user_data = local.user_data
    tags = {
      Name = "frontend-app-server-${count.index + 1}"
    }
  }
  #===========================================================
      #  ceate load balancer for frontend app                                                                                                         
  #===========================================================
  resource "aws_lb" "frontend-app-lb" {
    name               = "frontend-app-lb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.lb_sg.id]
    subnets            =  aws_subnet.public_subnet[*].id
  }
  resource "aws_lb_target_group" "frontend-app-tg" {
    name     = "frontend-app-tg"
    port     = 80
    protocol = "HTTP"
    vpc_id   = aws_vpc.frontend-app-vpc.id
  
    health_check {
      path                = "/"
      protocol            = "HTTP"
      matcher             = "200"
      interval            = 30
      timeout             = 5
      healthy_threshold   = 2
      unhealthy_threshold = 2
    }
  }
  resource "aws_lb_target_group_attachment" "frontend-app-tg-attachment" {
    count = var.private_cidr_count
    target_group_arn = aws_lb_target_group.frontend-app-tg.arn
    target_id = aws_instance.severs[count.index].id
    port = 80 

  }
    resource "aws_lb_listener" "http_listener" {
    load_balancer_arn = aws_lb.frontend-app-lb.arn
    port              = "80"
    protocol          = "HTTP"

    default_action {
      type             = "forward"
      target_group_arn = aws_lb_target_group.frontend-app-tg.arn
    }
  }
  
  #===========================================================
      #  ceate security group for load balancer                                                                                                        
  #===========================================================
  resource "aws_security_group" "lb_sg" {
    name        = "frontend-app-lb-sg"
    description = "Allow HTTP and HTTPS traffic"
    vpc_id      = aws_vpc.frontend-app-vpc.id

    ingress {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"] 
    }
    egress {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  tags = {
    Name = "frontend-app-lb-sg"
  }
  }
  #===========================================================
      #  ceate security group for instances                                                                                                        
  #===========================================================

  resource "aws_security_group" "instances_sg" {
    name        = "frontend-app-instances-sg"
    description = "Allow HTTP and HTTPS traffic"
    vpc_id      = aws_vpc.frontend-app-vpc.id
    ingress {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      security_groups = [aws_security_group.lb_sg.id]
    }
    egress {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  tags = {
    Name = "frontend-app-instances_sg"
  }
  }
# =========================
# aws s3
# =========================
  resource "aws_s3_bucket" "frontend-app-bucket"{
    bucket =  "danish-frontend-app-bucket"
    tags = {
      Name = "danish-frontend-app-bucket"
    }
  }

#=====================================
# code deploy 
#=====================================
  resource "aws_codedeploy_app" "frontend-app" {
  compute_platform = "Server"
  name             = "my-frontend-app"
}
#=====================================
# code deploy config
#=====================================
resource "aws_codedeploy_deployment_config" "frontend-app-deployment-config" {
  deployment_config_name = "frontend-deployment-config"

  minimum_healthy_hosts {
    type  = "HOST_COUNT"
    value = 2
  }
}
#======================================
#  deployment group for code deploy
#======================================

resource "aws_codedeploy_deployment_group" "frontend-app-deployment-group" {
app_name = aws_codedeploy_app.frontend-app.name
deployment_group_name = "my-frontend-app-depoyment-group"
service_role_arn = aws_iam_role.codedeploy_service_role.arn
deployment_config_name = aws_codedeploy_deployment_config.frontend-app-deployment-config.deployment_config_name
ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "frontend-app-server-*" 
    }
  }
  load_balancer_info {
    target_group_info {
      name = aws_lb_target_group.frontend-app-tg.name
    }
  }
  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }
}
