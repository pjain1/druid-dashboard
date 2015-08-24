# Druid-ui [![Build Status](https://travis-ci.org/yahoo/druid-dashboard.svg?branch=master)](https://travis-ci.org/yahoo/druid-dashboard) [![Code Climate](https://codeclimate.com/github/yahoo/druid-dashboard/badges/gpa.svg)](https://codeclimate.com/github/yahoo/druid-dashboard) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yahoo/druid-dashboard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/druid_dashboard.svg?auth=747dc09416a2950583bb2254c6544fd4)](https://saucelabs.com/u/druid_dashboard)

This README outlines the details of collaborating on this Ember application.

This is a relatively simple initial take on a dashboard for Druid.  It uses timeseries and top list queries to
populate timeseries graphs and dimensional tables that can be used for filtering.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

If you are on a Mac, you can get all of this stuff by first having [homebrew](http://brew.sh/) installed.  Then

 ```
 brew install git node
 npm install -g bower
 npm install -g ember-cli
 ```

 If you are not on a mac, then you will have to get `git` and `node` on your own, but the `npm install` commands
 should still be relevant.

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

For development, you will need to proxy requests back to a running Druid instance.  You can do this with the `--proxy`
command-line option.

* `ember server --proxy http://hostname:port_of_broker`
* Visit your app at [http://localhost:4200](http://localhost:4200).

Also, you will need to adjust the metrics that are queried for to line up with the metrics that you have available
in your data source.  This can be done by editting the `aggs` variable and the `metricDisplayOrder` variables in
`controllers/datasource/show.js`.  In a perfect world, this would be something a bit easier to configure (i.e. not
require a code change), but it is what it is for now.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

One of the ways to deploy the app is to serve it from a Druid Broker using [static_ui](https://github.com/yahoo/druid-extensions/tree/master/static_ui#static_ui) druid extension. Please visit the link for further instructions.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
