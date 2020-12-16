[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/hana-structurer-one)](https://api.reuse.software/info/github.com/SAP-samples/hana-structurer-one)
[![License: Apache2](https://img.shields.io/badge/License-Apache2-green.svg)](https://opensource.org/licenses/Apache-2.0)
# hana-structurer-one
[![SAP](https://i.imgur.com/Dny1qdn.png)](https://cloudplatform.sap.com)

## Description
SAP HANA Extreme application, built on XS Engine,  that analyses structured data (tweets) to retrieve information such as Location, People, Companies and also Sentiment Analysis. [Details in this blog](https://blogs.sap.com/2015/07/03/sap-hana-real-time-sentiment-analysis-and-text-mining-app/)

 * [Demo on Youtube](https://www.youtube.com/watch?v=q6dCTP9AkbA)


## Requirements
* [NodeJS Runtime](https://nodejs.org/en/download/)
* [Twitter API Keys](https://apps.twitter.com/)

## Download and Installation

### SAP HANA app
* [Import the Delivery Unity](https://help.sap.com/viewer/52715f71adba4aaeb480d946c742d1f6/2.0.03/en-US/e6c0c1f7373f417894e1f73be9f0e2fd.html) (tar.gz)available on the latest release of this repo. Once done, execute the [SQL Statements](SQL/CreateIndexes.sql) so all Text Analysis/Mining indexes can be created.

### Data Retriever
* Navigate to the [DataRetriever](DataRetriever) folder and run the commands:
```sh
npm install twitter-stream-channels
npm install hdb
```
* Fill the [twitterSummit](DataRetriever/twitterSummit.js) your HANA System credentials and Twitter App Key
* Start The script: 
```sh
node twitterSummit.js
```

## Support and Contributions  
This repository is provided "as-is". With no Warranty or support

If you have questions, please ask.

## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
