---
title: Data Collection
description: Data collected from Flow CLI usage
sidebar_position: 17
---

Flow CLI tracks flow command usage count with Mixpanel.

Data collection is turned on by default. To opt out of our data collection, users can run `flow settings metrics disable`. 

To opt back in, users can run `flow settings metrics enable`.

## Why do we collect data about flow CLI usage?

When we collect aggregate command count, it allow us to prioritise features and fixes based on how users use flow CLI.

## What data do we collect?

We only collect the number of times a command is executed. 

We don't keep track of the values of arguments, flags used and the values of the flags used. We also don't associate any commands to any particular user.

The only property that we collect from our users are their opt in / out data collection preferences. 
T
he analytics user ID is specific to Mixpanel and does not permit Flow CLI maintainers to, for exxample, track you across websites you visit.

For more information about the data collected, see Mixpanel's data collection page in the `Ingestion API` section of https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel.

Although Mixpanel's page above mentions that geolocation properties are recorded by default, we have turned off geolocation data reporting to Mixpanel.
