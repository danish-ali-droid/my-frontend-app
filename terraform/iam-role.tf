#======================================
# create iam role for ec2 instance 
#======================================
resource "aws_iam_role" "ec2_role" {
  name = "my-ec2-role"

  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = "myrole1"
        Principal = {
          Service = "ec2.amazonaws.com"
         
        }
      },
    ]
  })

  tags = {
    tag-key = "tag-value"
  }
}
#======================================
# create iam role for code deploy 
#======================================
resource "aws_iam_role" "codedeploy_service_role" {
  name = "codedeploy-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codedeploy.amazonaws.com"
        }
      }
    ]
  })
}
#======================================
# policyies attachments    for ec2 role             
#======================================
resource "aws_iam_role_policy_attachment" "ec2_s3_read" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}
resource "aws_iam_role_policy_attachment" "ssm_policy" {
    role = aws_iam_role.ec2_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
resource "aws_iam_role_policy_attachment" "ec2_codedeploy_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeDeployFullAccess"
}
#===========================================
# policies attachments for code deploy role            
#===========================================
resource "aws_iam_role_policy_attachment" "codedeploy_managed" {
  role       = aws_iam_role.codedeploy_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
}

#======================================
# instance profile             
#======================================

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "frontend-ec2-instance-profile"
  role = aws_iam_role.ec2_role.name 
}
