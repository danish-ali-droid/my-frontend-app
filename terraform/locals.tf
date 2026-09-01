locals  {
   user_data = file("${path.module}/user_data.sh")
   bucket_policy = jsonencode ({
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Principal": {
        "AWS": "aws_bucket"
      },
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "${aws_s3_bucket.frontend-app-bucket.arn}/*"
    }
  ]
})
}
