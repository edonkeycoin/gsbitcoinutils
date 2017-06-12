# gsbitcoinutils
Cryptocurrency related Javascript utilities that can be used in GoogleSheets spreadsheets

## By edonkey:	June 12, 2015
## Donations:  	18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW


## Introduction

I use Google Sheets to keep track of my mining and other Bitcoin investments because it provides a mechanism to automate the spreadsheets via simple scripting. My spreadsheets gather the received Bitcoin coming in to my mining addresses and include that revenue in the ROI calculation. Also, Google supports BTC to USD rate conversion. I had to add LTC, because they don't support it yet.



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
