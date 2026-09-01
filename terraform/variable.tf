variable "cidr_block" {
   default = "10.0.0.0/16"
}
variable  "public_cidr_count" {
    type = number 
    default = 2
     
}

variable "private_cidr_count" {
    default = 2
}