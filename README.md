# gsbitcoinutils
Cryptocurrency related Javascript utilities that can be used in Google Sheets spreadsheets

## By edonkey:	June 12, 2017
## Last update:	September 4, 2017
## Donations:  	36tvf7L5wxCEZfbma5EGuCakjtonfCR7NN


## Introduction

I use Google Sheets to keep track of my mining and other Bitcoin investments because it provides a mechanism to automate the spreadsheets via simple scripting. My spreadsheets gather the value of received Bitcoin coming in to my mining addresses and include that revenue in an ROI calculation. 

Another advantage of Google Sheets is that supports BTC to USD rate conversion. I had to add LTC to USD (via GDAX), because Google doesn't support LTC yet.

The script here isn't particularly original. Much of this info can be found by Google searching. But in case anyone finds it helpful, I'm including the formulas and scripts that I'm using for my BTC and LTC spreadsheets.

## Recent changes

Originally I tried using the API provided by blockchain.info, because I found a script example using their API. But I started getting errors indicating that the endpoint had been used too much, or something to that effect. Blockchain.info refused my request for an API key, with no explanation. I guess I'll never be using their service.

I switched to blockr.io and that worked. But after a while blockr.io became very slow, causing big delays when updating my spreadsheets. Then they stopped updating their data. They closed up shop on September 4, 2017.

Next I tried blockcypher.com, but their base limit on the number of requests per second caused errors opening my spreadsheets. Their paid service was too much for my tastes just to bump up this limit. Also they didn't have an easy way to get the coin difficulty (I'd have to make multiple calls and convert from the compressed bits value in the block header myself).

For now I'm changed the script to an object model that uses blockexplorer.com for BTC and explorer.litecoin.net for LTC. This seems to work nicely. Both services are fast and I haven't seen it throttle me yet.

The only drawback is that explorer.litecoin.net doesn't seem to have an API to obtain the number of transactions for an address. For now that function returns 0. I guess I can look into replacing the LTC explorer at some point if getting the number of transactions is important.

## Installation

To use the scripts, go to the Tools -> Script editor... page for your Google Sheets spreadsheet and paste the script code and save it. Then you can go back to the spreadsheet and use the script functions.

## Use

The Javascript functions can be called directly from your spreadsheet. For example, to get the total received by a given address enter a formula like the following into a cell:

	=walletReceived("18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW")

To compute your projected earnings per day at the current difficulty, call the following with your hash rate in THs:

	=btcEarningsPerTHsPerDay(25)

Also, Google has built in support for Bitcoin currency conversion, like so:

	=GoogleFinance("CURRENCY:BTCUSD")

Since Google doesn't currently support LTC, you can paste the following into a cell to get the current LTC conversion rate from GDAX:

	=IMPORTXML("https://bitinfocharts.com/markets/gdax/ltc-usd-1m.html", "//*[@itemprop='price']")

## Troubleshooting

Most of the time this scripted automation approach works well. But to get updated information you may have to refresh your spreadsheet in your browser.

Every once in a while something gets "stuck" (maybe some Google caching algorithm) and fresh data stops arriving. Try making a meaningless edit (which you can undo) in order to get it unstuck.
