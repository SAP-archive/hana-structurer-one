# StructurerOne
SAP HANA Extreme application that analyses structured data (tweets) to retrieve information such as Location, People, Companies and also Sentiment Analysis. Details: http://scn.sap.com/docs/DOC-65109

# Installation - SAP HANA app
You can clone this repository and create a new project on your HANA system or import the Delivery Unity available on the link above. Once done, execute the SQL Statements located on SQL/CreateIndexes.sql so all Text Analysis/Mining indexes can be created.

# Installation - Data Retriever
This app analizes data from tweets. To run the the data retriever scripts:<br>
 - install NodeJS https://nodejs.org/en/ (you can isntall it anywhere)<br>
 - Install aditional packages by running the commands:<br>
```sh
    npm install twitter-stream-channels
    npm install hdb
    npm install util
```
- Fill the scripts with your HANA System credentials and Twitter App Key (https://apps.twitter.com/)<br>
- To start the scrpits:<br>
    node scriptname.js
    
# Demo
 - [Sample demo on Youtube](https://www.youtube.com/watch?v=q6dCTP9AkbA]
 
 # Info 
 on [this blog by Ralph](https://blogs.sap.com/2015/07/03/sap-hana-real-time-sentiment-analysis-and-text-mining-app/)
