terraform {
  cloud {
    organization = "phi"

    workspaces {
      name = "rvt-app"
    }
  }
}
