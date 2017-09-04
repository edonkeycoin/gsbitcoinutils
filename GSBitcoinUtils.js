/*
 Useful set of cryptocurrency related utilities in simple Javascript that can
 be used in GoogleSheets spreadsheets.
 
 Written by edonkey, June 11, 2017
 
 2017-09-04:	Changed to an object model that uses blockexplorer.com for BTC and
				explorer.litecoin.net for LTC because blockcypher.com limits the
				number of transactions per second so much that it caused errors
				refreshing my spreadsheets. The only drawback is that
				explorer.litecoin.net doesn't seem to have an API to obtain the number
				of transactions. I guess I can look into replacing the LTC explorer at
				some point. 
2017-09-03:	Changed to use blockcypher.com since blockr.io closed.
  
 Donations: 18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW
 */

// Strings that identify the coin explorer to use
var gBitcoin = "btc"
var gLitecoin = "ltc"

// Convert from satoshis to Btc
function convertFromSatoshis(value)
{
	var converted = value
	if (0 != converted)
		converted /= 100000000
	return converted
}

// Compute coin earnings. Algorithm from here:
//	http://www.holynerdvana.com/2014/02/how-to-calculate-coins-per-day-for-any.html
function computeCoinEarnings(seconds, blockReward, difficulty, hashrate)
{
	var reward = (seconds * blockReward * hashrate) / (difficulty * (Math.pow(2, 48) / 0x00000000ffff))
	return reward
}

// Compute the earnings per day for a given coin
function earningsPerDay(blockReward, difficulty, hashrate)
{
	var earnings = computeCoinEarnings(86400, blockReward, difficulty, hashrate)
	return earnings
}

// Bitcoin explorer object. Uses blockexplorer.com under the hood
var gBitcoinExplorer = 
{
	baseUrl: 'https://blockexplorer.com/api',
	
	// Build a query URL for the explorer, with an option query string
	// provided by the caller.
	getQueryUrl: function(query) 
	{
		var url = this.baseUrl + "/status"
		if (query != "")
		{
			url += "?q=" + query
		}
		return url
	},

	// Return an explorer URL for the specified address
	getAddressUrl: function(address) 
	{
		var url = this.baseUrl + "/addr/" + address
        return url
	},

	// Download the JSON from the specified URL and parse it
	getParsedJsonData: function(url)
	{
		var response = UrlFetchApp.fetch(url)
		var json = response.getContentText()
		var parsed = JSON.parse(json)
		return parsed
	},

	// Get the total received for a given address.
	getAddressTotalReceived: function(address) 
	{
		var url = this.getAddressUrl(address) + "/totalReceived"
		var response = UrlFetchApp.fetch(url)
		var totalReceived = convertFromSatoshis(parseFloat(response.getContentText()))
		return totalReceived
	},
	
	// Get the number of transactions for a given address.
	getAddressNumTransactions: function(address) 
	{
		var url = this.getAddressUrl(address)
		var data = this.getParsedJsonData(url)
		numTransactions = data.txApperances
		return numTransactions
	},
	
	// Get the current difficulty for the coin
	getDifficulty: function()
	{
		var url = this.getQueryUrl("getDifficulty")
		var data = this.getParsedJsonData(url)
		difficulty = data.difficulty
		return difficulty
	}
};

// Litecoin explorer object. Uses explorer.litecoin.net under the hood
var gLitecoinExplorer = 
{
	baseUrl: 'http://explorer.litecoin.net/chain/Litecoin',
	
	// Build a query URL for the explorer, with an option query string
	// provided by the caller.
	getQueryUrl: function(query) 
	{
		var url = this.baseUrl + "/q"
		if (query != "")
		{
			url += "/" + query
		}
		return url
	},

	// Return an explorer URL for the specified address
	getAddressUrl: function(address) 
	{
		var url = this.baseUrl + "addr/" + address
        return url
	},

	// Download the JSON from the specified URL and parse it
	getParsedJsonData: function(url)
	{
		var response = UrlFetchApp.fetch(url)
		var json = response.getContentText()
		var parsed = JSON.parse(json)
		return parsed
	},

	// Get the total received for a given address.
	getAddressTotalReceived: function(address) 
	{
		var url = this.getQueryUrl("getreceivedbyaddress/" + address)
		var response = UrlFetchApp.fetch(url)
		var totalReceived = parseFloat(response.getContentText())
		return totalReceived
	},
	
	// Get the number of transactions for a given address.
	//
	// Warning! explorer.litecoin.net does not support getting this info so we always return 0.
	getAddressNumTransactions: function(address) 
	{
		//var url = this.getQueryUrl("getreceivedbyaddress/" + address)
		//var response = UrlFetchApp.fetch(url)
		//var numTransactions = parseFloat(response.getContentText())
		//return numTransactions
		return 0
	},

	// Get the current difficulty for the coin
	getDifficulty: function()
	{
		var url = this.getQueryUrl("getdifficulty")
		var response = UrlFetchApp.fetch(url)
		difficulty = parseFloat(response.getContentText())
		return difficulty
	}
};

// Return the appropriate explorer object for the coin specified
function getExplorer(coin)
{
	var explorer
	if (coin == gBitcoin)
	{
		explorer = gBitcoinExplorer
	}
	else if (coin == gLitecoin)
	{
		explorer = gLitecoinExplorer
	}
	else
	{
		// Caller provided an unknown coin string
		throw new IllegalArgumentException("Unexpected coin string", coin);
	}
	
	return explorer
}

// Return the difficulty for the spedified coin.
function getCoinDifficulty(coin)
{
	var explorer = getExplorer(coin)
	var difficulty = explorer.getDifficulty()
	return difficulty
}

// Get the current info on the specified coin to compute the earnings per day
function coinEarningsPerDay(coin, blockReward, hashrate, hashMultiplier)
{
	// Get the last difficulty for coin
	var difficulty = getCoinDifficulty(coin)

	// Compute the total hashrate
	var totalHashrate = hashrate * hashMultiplier

	// Compute and return the earnings
	var earnings = earningsPerDay(blockReward, difficulty, totalHashrate)
	return earnings
}

// Get the BTC earnings per THs per day
function btcEarningsPerTHsPerDay(hashrate)
{
	return coinEarningsPerDay(gBitcoin, 12.5, hashrate, 1000000000000)
}

// Get the LTC earnings per MHs per day
function ltcEarningsPerMHsPerDay(hashrate)
{
	return coinEarningsPerDay(gLitecoin, 25, hashrate, 1000000)
}

// Return the total received by a given coin address
function getCoinWalletReceived(coin, address)
{
	var explorer = getExplorer(coin)
	var totalReceived = explorer.getAddressTotalReceived(address)
	return totalReceived
}

// Return the total received by a given coin address
function getCoinWalletNumTransactions(coin, address)
{
	var explorer = getExplorer(coin)
	var numTransactions = explorer.getAddressNumTransactions(address)
	return numTransactions
}

// Return the total received by a bitcoin address
function walletReceived(address)
{
	return getCoinWalletReceived(gBitcoin, address)
}

// Return the total transactions for a bitcoin address
function walletNumTransactions(address)
{
	return getCoinWalletNumTransactions(gBitcoin, address)
}

// Return the total received by a litecoin address
function ltcWalletReceived(address)
{
	return getCoinWalletReceived(gLitecoin, address)
}

// Return the total transactions for a litecoin address
function ltcWalletNumTransactions(address)
{
	return getCoinWalletNumTransactions(gLitecoin, address)
}

// Test the above functions
function test()
{
	var address = "18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW"

	var received = walletReceived(address)
	var numTransactions = walletNumTransactions(address)

	Logger.log(address + ":		")
	Logger.log("  received:		" + received)
	Logger.log("  transactions: " + numTransactions)

	btcPerDay = btcEarningsPerTHsPerDay(12.5)
	ltcPerDay = ltcEarningsPerMHsPerDay(504)

	Logger.log("btc earnings:" +  btcPerDay)
	Logger.log("ltc earnings:" +  ltcPerDay)
	//Browser.msgBox("btc earnings:" +  btcPerDay)
	//Browser.msgBox("ltc earnings:" +  ltcPerDay)

	// Blocks if Safari popups blocked
	//Browser.msgBox(received)
}

