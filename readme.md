# LAN

GEPWNAGE LAN Party System

## LAN Network Checklist

Checklist of what has to be done for the network setup:

1. Connect the internet to the UniFi USG (internet port)
2. Setup the controller (Note: port LAN 2 of the USG)
3. Connect core switch to the USG (Note: port LAN 1 of the USG)
4. Setup the intranet website / beamer machine
5. Verify the above
6. Install other switches in the room

For detailed information, see the network map in `unifi-controller/install.org`.

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See deployment for notes on
how to deploy the project on a live system.

### Prerequisites

  - PHP with sqlite extension

## Portal

### Installation

After cloning, copy `.env.example` (or `.env.dev-example` for development) to `.env`,
and apply the credentials. Then run:

```bash
# Install PHP dependencies
composer install

# Generate random hash
php artisan key:generate

# Create database
touch database/database.sqlite
php artisan migrate

# Compile frontend resources
npm run production

# Create API user (optional)
php artisan user:create user@somedomain.org
```

This will get you started. If you want a complicated setup, you can run MySQL. But by
default sqlite is used.

Don't forget to check file permissions for the entire folder.

### Vouchers

Note: all vouchers are **single use**.

To create voucher, use `php artisan voucher:create`.

To list vouchers, use `php artisan voucher:list`.

### Printing

To print the vouchers, execute the following steps, on a computer with latex
installed (preferably the texlive-full distribution):

1. `php artisan voucher:latex`
2. `cd resource/latex`
3. `make`
4. Print `pages.pdf`

### Importing the list of vouchers on a different machine

The machine on which the portal runs will likely not have latex and it is much
better to generate the vouchers before the LAN (we don't have a printer at the
LAN). Thus, we want to transport the voucher list from where we generate them,
to the actual machine on which the portal runs.

The easiest way to do this, is to simply copy the `database/database.sqlite` to
the portal machine. We simply hope this works.

Because that may not work, it is also easy to generate a list of vouchers using sqlite:

- `sqlite3 database/database.sqlite ".dump vouchers" > vouchers.sql`

And to import (note that this has to happen on a clean database):

- remove `database/database.sqlite` if it exists
- `php artisan migrate`
- `sqlite3 database/database.sqlite < vouchers.sql`

## UniFi Controller

### Installation

To view more information about the controller, see [`unifi-controller/install.org`](unifi-controller/install.org)

## Deployment

For deploy, follow installation. Since this doesn't need a lot of database
writing, you will not need something like MySQL. SQLite is good enough (which
the default config uses).

## Authors

* **Pieter Kokx** - *Initial work* - [kokx](https://github.com/kokx)
* **Willem Mouwen** - *Initial work* - [wmouwen](https://github.com/wmouwen)
* **Koen Klaren** - *Intranet* - [Mesoptier](https://github.com/Mesoptier)

See also the list of [contributors](https://github.com/GEPWNAGE/lan/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* **Nicky Gerritsen** - for some help in finding the correct API endpoints
* **#gepwnage** on the GEWIS IRC - for general mental support
