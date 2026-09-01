resource "aws_vpc" "frontend-app-vpc" {
  cidr_block = var.cidr_block
  instance_tenancy = "default"
  tags = {
      Name = "frontend-app-vpc"
  }
  }
    
  #===========================================================
      #  public subnet  for frontend app                                                                                                                 
  #===========================================================
  resource "aws_subnet" "public_subnet" {
  count         = var.public_cidr_count
    cidr_block     = cidrsubnet(aws_vpc.frontend-app-vpc.cidr_block, 8, count.index)
    vpc_id = aws_vpc.frontend-app-vpc.id

    availability_zone = data.aws_availability_zones.available.names[count.index]
  }
  resource "aws_internet_gateway" "frontend-app-igw" {
  vpc_id = aws_vpc.frontend-app-vpc.id
  tags = {
      Name = "frontend-app-igw"
  }
  }
  resource "aws_route_table" "frontend-public-app-public-rt" {
    vpc_id = aws_vpc.frontend-app-vpc.id

    route {
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.frontend-app-igw.id
    }

    tags = {
      Name = "frontend-public-app-public-rt"
    }
  }
  resource "aws_route_table_association" "forntend-app-public-assosiation" {
    count          = var.public_cidr_count
    subnet_id      = aws_subnet.public_subnet[count.index].id
    route_table_id = aws_route_table.frontend-public-app-public-rt.id
    
  }

  #===========================================================
      #  private subnet  for frontend app                                                                                                                 
  #===========================================================
  resource "aws_subnet" "private_subnet" {
    count = var.private_cidr_count
    vpc_id = aws_vpc.frontend-app-vpc.id
    availability_zone = data.aws_availability_zones.available.names[count.index]
    cidr_block = cidrsubnet(aws_vpc.frontend-app-vpc.cidr_block, 8, count.index + var.public_cidr_count)

  }

  resource  "aws_nat_gateway" "private_subnet_natgateway" {
    
      subnet_id     = aws_subnet.public_subnet[0].id
      allocation_id = aws_eip.nat_eip.id
  tags = {
    Name = "private-subnet-natgateway"
  }

  }
  resource "aws_eip" "nat_eip"{
   
    domain = "vpc"
  }
  resource "aws_route_table" "frontend-private-app-private-rt" {
    vpc_id = aws_vpc.frontend-app-vpc.id

    route {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.private_subnet_natgateway.id
    }

  }
  resource "aws_route_table_association" "frontend-app-private-association" {
    count = var.private_cidr_count
    subnet_id      = aws_subnet.private_subnet[count.index].id
    route_table_id = aws_route_table.frontend-private-app-private-rt.id
  }