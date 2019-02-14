# LAN

GEPWNAGE LAN System

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

#### REST API

- [ ] The portal
- [ ] An API endpoint `POST /vouchers` which allows an API user to create a voucher.
- [ ] An API endpoint `GET /vouchers` to list all vouchers.
- [ ] An API endpoint `POST /vouchers/id` to update a voucher.
- [ ] An API endpoint `DELETE /vouchers/id` to remove a voucher.

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
