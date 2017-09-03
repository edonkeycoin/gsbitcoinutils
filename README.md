# gsbitcoinutils
Cryptocurrency related Javascript utilities that can be used in Google Sheets spreadsheets

## By edonkey:	June 12, 2017
## Donations:  	18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW


## Introduction

I use Google Sheets to keep track of my mining and other Bitcoin investments because it provides a mechanism to automate the spreadsheets via simple scripting. My spreadsheets gather the value of received Bitcoin coming in to my mining addresses and include that revenue in an ROI calculation. 

Another advantage of Google Sheets is that supports BTC to USD rate conversion. I had to add LTC to USD (via GDAX), because Google doesn't support LTC yet.

The script here isn't particularly original. Much of this info can be found by Google searching. But in case anyone finds it helpful, I'm including the formulas and scripts that I'm using for my BTC and LTC spreadsheets.

## Recent changes

Originally I tried using the API provided by blockchain.info, because I found a script example using their API. But I started getting errors indicating that the endpoint had been used too much, or something to that effect. So I switched to blockr.io and haven't had a problem.

But after a while blockr.io became very slow, causing big delays when updating my spreadsheets. Then they stopped updating their data. They closed up shop on September 4, 2017.

The result is that I need a new API. Blockchain.info refused my request for an API key, with no explaination. I guess I'll never be using their service. 

Currently I've moved to blockcypher.com for address information, and a combination of blockexplorer.com and explorer.litecoin.net for obtaining the current difficulty. Hopefully this will last for a while.

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
