<div align="center">
  <img height="180px" width="240px" src="images/logo.svg">
  <h1>SLMF-HTTP-connector</h1>
</div>

[![Build Status](https://travis-ci.org/F-Army/SLMF-HTTP-connector.svg?branch=master)](https://travis-ci.org/F-Army/SLMF-HTTP-connector)
[![Coverage Status](https://coveralls.io/repos/github/F-Army/SLMF-HTTP-connector/badge.svg?branch=master&kill_cache=1)](https://coveralls.io/github/F-Army/SLMF-HTTP-connector?branch=master)
[![codebeat badge](https://codebeat.co/badges/f5a1e2a2-71da-46af-b8fc-37d7beec7fb2)](https://codebeat.co/projects/github-com-f-army-slmf-http-connector-master)
[![Known Vulnerabilities](https://snyk.io/test/github/F-Army/SLMF-HTTP-connector/badge.svg)](https://snyk.io/test/github/F-Army/SLMF-HTTP-connector)

<br/>

Basic usage
----------

Install this packages simply using npm:

```
npm install slmf-http-connector
```


Let's begin by starting the connector:

```
const { SlmfHttpConnector } = require("slmf-http-connector");

const connector = new SlmfHttpConnector({
        accumulationPeriod : 500,
        maxAccumulatedMessages : 3,
        maxSlmfMessages : 2,
        maxRetries: 3,
        port: 8080,
        url : "http://127.0.0.1",
});

connector.start();

```

Now you are ready to add location messages from your server or application:
```
const { BatteryStatus, TagIdFormat } = require("slmf-http-connector");

connector.addMessages({
      source: "Infrastructure",
      format: "DFT",
      tagIdFormat: TagIdFormat.IEEE_EUI_64,
      tagId: 0,
      position: {
          x: 0,
          y: 0,
          z: 0,
      },
      battery: BatteryStatus.Good,
      timestamp: new Date(),
});
```
The messages will be sent to the target server using POST request in XML format (ISO/IEC 24730-1:2014) .<br/><br/>
If you need to stop the connector just do:
```
connector.stop(); // It will not send nor receive messages until started
```
