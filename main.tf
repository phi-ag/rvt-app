terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.52.0"
    }
  }

  required_version = ">= 1.7.0"
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "The Cloudflare API token."
}

variable "cloudflare_account_id" {
  type        = string
  description = "The Cloudflare account id."
}

variable "cloudflare_zone_id" {
  type        = string
  description = "The Cloudflare zone id."
}

variable "pages_project_name" {
  type        = string
  description = "Name of the project."
}

variable "pages_preview_domain" {
  type        = string
  description = "Custom preview domain."
}

variable "pages_production_domain" {
  type        = string
  description = "Custom production domain."
}

variable "pages_preview_branch" {
  type        = string
  default     = "main"
  description = "The name of the branch that is used for the preview environment."
}

variable "pages_production_branch" {
  type        = string
  default     = "production"
  description = "The name of the branch that is used for the production environment."
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pages_project" "page" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = var.pages_production_branch

  lifecycle {
    ignore_changes = [build_config]
  }
}

resource "cloudflare_pages_domain" "preview" {
  account_id   = var.cloudflare_account_id
  project_name = var.pages_project_name
  domain       = var.pages_preview_domain
  depends_on   = [cloudflare_pages_project.page]
}

resource "cloudflare_pages_domain" "production" {
  account_id   = var.cloudflare_account_id
  project_name = var.pages_project_name
  domain       = var.pages_production_domain
  depends_on   = [cloudflare_pages_project.page]
}

resource "cloudflare_record" "preview" {
  zone_id = var.cloudflare_zone_id
  name    = cloudflare_pages_domain.preview.domain
  content = "${var.pages_preview_branch}.${cloudflare_pages_project.page.subdomain}"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "production" {
  zone_id = var.cloudflare_zone_id
  name    = cloudflare_pages_domain.production.domain
  content = cloudflare_pages_project.page.subdomain
  type    = "CNAME"
  proxied = true
}

output "domain_preview" {
  value = cloudflare_pages_domain.preview.domain
}

output "domain_production" {
  value = cloudflare_pages_domain.production.domain
}

output "web_analytics_tag" {
  value = cloudflare_pages_project.page.build_config[0].web_analytics_tag
}

output "web_analytics_token" {
  value = cloudflare_pages_project.page.build_config[0].web_analytics_token
}
