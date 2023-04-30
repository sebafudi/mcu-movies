# McuMovies

Live production version: https://mcu-movies.sbfd.me

API: https://mcu-movies.sbfd.me/api/movies

Live dev version: https://dev-mcu-movies.sbfd.me

API: https://dev-mcu-movies.sbfd.me/api/movies

# Description

The app itself is a simple list of Marvel Cinematic Universe movies. It doesn't make any database calls, it's just a static list. <br />
The purpose of this project is to learn how to deploy a full stack application to a server with CI/CD. <br />

# Deployment infrastructure

### **Asgard** - _primary location_

`kara` - Ansible server, manages the deployment of the application to target servers.

`heimdall` - Primary server - hosts _nginx_ and manages SSL certificates.

`odin` - Secondary server - hosts secondary _nginx_, and _docker containers_ for all the apps.

### **Vanaheim** - _secondary location_

`bogdan` - Secondary server - hosts _nginx_ and manages SSL certificates. <sub><sub>(Yes. We run out of Nordic Gods names because we have a lot of VMs and hosts...)</sub></sub>

<br />

## Less important infrastructure

`vidar` - Proxmox server - hosts all the VMs in `asgard`

`idun` - Proxmox server in `vanaheim`

`njord` - Proxmox server - hosts all the VMs in `alfheim` (`alfheim` is behind NAT, so nothing can really point to it directly)

`freya` - OPNsense router in `vanaheim`

`loki` - OPNsense router in `asgard`

`forseti` - OPNsense router in `alfheim` - it runs inside a VM on `njord`. It's used to connect `alfheim` to `asgard` and `vanaheim` via VPN.

`eryk` - Primary server in `vanaheim` - not used, as of now. Basically a copy of `heimdall`

There's a BIND DNS server on every OPNsense that have a slave zone for internal use.

There's also an internal certificate authority with one root certificate and one intermediate certificate for each location.

There are a lot of other VMs, but they are not important for this project.

# Deployment

## Deployment process - _GitHub_

1. `[Human]` Push changes to the `feature/*` branch.
1. `[Human]` Create a pull request to `develop` branch.
1. `[GitHub Actions]` Pull request is tested and built with Nx.
1. `[Human]` If tests and build are successfull, pull request can be closed.
1. `[GitHub Actions]` Run deployment action if pull request is closed and merged to `develop` branch.
1. `[GitHub Actions]` Build docker images as artifacts and send them over ssh to `kara` server.
1. `[GitHub Actions]` Run ansible playbook or `kara`.

## Deployment process - _Ansible_ - _`[kara]`_

1. `[odin, bogdan]` Copy docker images and docker-compose.yml to all secondary servers.
1. `[odin, bogdan]` Load docker images to docker daemon on all secondary servers.
1. `[odin, bogdan]` Check if _nginx_ config for domain is there, if not, create it from _j2_ template.
1. `[odin, bogdan]` Reload nginx if needed.
1. `[odin, bogdan]` Run docker-compose up on all secondary servers.
1. `[heimdall]` Check if _nginx_ config for domain is there, if not, create it from _j2_ template.
1. `[heimdall]` Reload nginx.

<br />

# Application and container structure

## **Nx**

The application is built with **Nx**. It's a monorepo with frontend and api projects.

## **Frontend**

The frontend is built with **React** and **Styled Components** <sub>(Very simple though)</sub>. It's hosted by **lighttpd** inside a **docker container**. It's port is 80, but it shouldn't be accessed or exposed directly.

## **Api**

The api is built with **NestJS**. It's hosted inside a **docker container**. It's port is 3000, but it too shouldn't be accessed or exposed directly.

## **Traefik**

Reverse proxy for docker containers. It's configuration lives solely inside docker-compose.yml. <br />
It's configured so that for example `dev-mcu-movies.sbfd.me` is proxied to `frontend:80` and `dev-mcu-movies.sbfd.me/api` is proxied to `api:3000`. <br />
All containers have a label with the domain name, so that traefik can find them and not mess with other containers.

# Cloudflare

All requests are proxied through Cloudflare. The connection between client and Cloudflare is encrypted with SSL. <br />
Connection between Cloudflare and the primary server (`heimdall`) is also encrypted with SSL. Nginx on `heimdall` is configured to use Cloudflare Universal SSL. <br />
Connection between primary and secondary servers is not encrypted. <br />

# Load balancing/High availability

Load balancing is done by _nginx_ on `heimdall` between `odin` and `bogdan`. <br />
If `odin` goes down, `bogdan` will take over, and vice versa. <br />
If _Traefik_ with api goes down on `odin`, _nginx_ will return 502, and `heimdall` will redirect to `bogdan`. <br />

# Potential problems

- If `heimdall` goes down, the application will be unavailable. <br />
- You can scale the application horizontally, but each deployment will set up frontend and backend.
- If one of the containers with _api_ or _frontend_ goes down, it should be restarted by docker, but if it doesn't, Traefik will return 404, and _nginx_ won't redirect to the other server. <br />
