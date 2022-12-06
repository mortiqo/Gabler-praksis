# FA Client Portal

Modern and responsive open source portal that allows your clients to access their investments

- Modern - fresh visual design, built using popular technologies
- Responsive - access fluently with mobile and desktop devices
- Open source - customize freely or use as-is

## Overview

Client Portal is a web application developed with [React](https://reactjs.org/) + [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html). Below listed are some core libraries utilized by the app:

- [Keycloak](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter) - handles authentication against FA.
- [Apollo](https://www.apollographql.com/docs/react/get-started) - fetches and mutates data using FA's graphql APIs, and caches data in the browser.
- [Tailwindcss](https://tailwindcss.com/docs/installation) - styles the app.
- [Apexcharts](https://apexcharts.com/docs/react-charts/#) - renders interactable charts in the app.
- [Formio](https://github.com/formio/react#readme) - renders the ui of processes defined in FA.
- [Headlessui](https://headlessui.com/) - supplies the app with pre-defined ui components.

## Getting started

### Prerequisites

In order for you to get started with running and/or customizing FA Client Portal, you would need the following:

- FA Platform test environment
- Enabling the access for the FA Client Portal to connect with your platform => request the access from FA Customer Support
  - add _Valid Redirect URI_ to be `http://localhost:3000/*`
  - set _Web Origin_ set to `+`.
- Development tools installed including git, npm, yarn...

### Steps

#### Clone the project to your local computer

Run the following in your shell

    git clone https://bitbucket.org/fasolutions-ondemand/fa-client-app.git

#### Modify the application settings to match your FA Platform test environment

We now assume the address for your FA Platform is

https://mytestenv.fasolutions.com

#### Point the authorization towards your test environment

FA Client Portal uses Keycloak for authorization. Configuration file (_keycloak.json_) is located in _public_ directory. Current file
is customized for test environment. Change it to point to your FA Platform test environment.

    "auth-server-url": "https://mytestenv.fasolutions.com/auth/",

Furthermore, make sure the Keycloak client to be used is defined in the file under resource. The default setting is:

    "resource": "external-api",

This default setting can be directly used, since the external-api client comes preconfigured with FA with public access type.

#### CORS policy

Currently, backend API allows only connection with headers from same origin. To bypass that you should use proxy server.
For local development we use http-proxy-middleware, before you start please adjust REACT*APP_API_URL variable in *.env\_
file.

    REACT_APP_API_URL=https://mytestenv.fasolutions.com

#### Running the application

For local development run:

yarn install
yarn start

If you need develop PWA run _`yarn run withSW`_

## Customization

### Translations

App language is taken from contact settings in FA Solutions backend. Fallback language is english, i.e. if translations
for specified language are missing, english will be used. Translation files are located in _public/locales_ directory.
Every language must have its own directory. Directory name should consist of two parts:

- The language code, taken from the ISO 639-1 standard
- The country/region code, taken from the ISO 3166-1 alpha-2 standard

Seperated by dash. For example fi-FI is the name of directory for Finnish language. Some translations are taken from
backend API - transaction and order types (sell, buy, etc.) and holding types (stock, fund, bond, etc.).

### Icons

To change app icon you need to change at least 4 files in _public_ directory:

- favicon.ico - used as favicon in browsers
- logo.svg - used as icon on navbar
- logo192.png (192px x 192px) - used in PWA and apple touch icon
- logo_maskable.png - used in PWA

Keep in mind that for PWA we use maskable icon (more info can be found [here](https://web.dev/maskable-icon/)), if your
do not have maskable icon please adjust _manifest.json_ file. You can also add other sizes but changes in _
manifest.json_
file would be necessary. More info can be found [here](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons).
Please be aware that icons can be updated with some delay, more about updates can be
found [here](https://web.dev/manifest-updates/).

### Colors

Adjustable colors are exposed in the _tailwind.config.js_. Currently, it is possible to change the following:

- Primary color (buttons, charts, etc)
- User avatar background color palette.

For example, to change the primary color, set the _primary_ variable to your preferred color. You
can choose from predefined color palettes. List of available palettes can be
found [here](https://tailwindcss.com/docs/customizing-colors). You can also use custom palette - more information can be
found [here](https://tailwindcss.com/docs/customizing-colors#generating-colors).

To apply color changes you must build the project (yarn build) and deploy it.

### Contact info

You can change contact info tab content by editing _contact.html_ file located in _public_ directory. You can use
Tailwind classes but please be aware that to reduce bundle size Tailwind scans files for class names and generate only
css for classes that has been found (you can read more [here](https://tailwindcss.com/docs/content-configuration)), so
if you use class that hasn't been used yet, build of the app will be necessary.

### Context root

FA Client Portal application runs by default under _/public/myinvestments/_ context root. If you want to change the end _myinvestments_ to be e.g. _portal_, you need to change the following:

#### Deployment folder

The application's deployment folder under _/public/_ needs to match the new context root.

#### homepage configuration in the application

The _homepage_ parameter defined in _package.json_ file needs to match the new context root:
"homepage": "/public/portal",

## Deployment to test environment

You can deploy FA Client Portal to your FA Platform test environment so that the application is hosted as part of FA Platform.
Any application deployed to FA Platform are available under _/public_ context root or its subfolder.

Let's assume we deploy the application under _/public/myinvestments_. The application is preconfigured to run in that context root.
However, if you choose to run it in another context root, check the section _Context root_.

Then, run _`yarn build`_ to build the deployable version.

In order to deploy the built application to your FA test environment, follow the instructions at https://documentation.fasolutions.com/en/customizing-fa-client-portal.html.
