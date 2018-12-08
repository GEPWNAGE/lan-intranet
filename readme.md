# LAN

GEPWNAGE LAN System

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See deployment for notes on
how to deploy the project on a live system.

### Prerequisites

PHP for dev, with sqlite extension

### Installing the portal

After cloning, copy `.env.example` (or `.env.dev-example` for development) to `.env`,
and apply the credentials. Then run:

```php
composer install
php artisan key:generate
php artisan migrate
```

This will get you started. If you want a complicated setup, you can run MySQL. But by
default sqlite is used.

## Deployment

For deploy, follow installation. Since this doesn't need a lot of database
writing, you will not need something like MySQL. SQLite is good enough (which
the default config uses).

## Authors

* **Pieter Kokx** - *Initial work* - [kokx](https://github.com/kokx)
* **Willem Mouwen** - *Initial work* - [wmouwen](https://github.com/wmouwen)

See also the list of [contributors](https://github.com/GEPWNAGE/lan/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* **Nicky Gerritsen** - for some help in finding the correct API endpoints
* **#gepwnage** on the GEWIS IRC - for general mental support
