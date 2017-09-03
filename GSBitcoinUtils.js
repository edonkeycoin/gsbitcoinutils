/*
 Useful set of cryptocurrency related utilities in simple Javascript that can
 be used in GoogleSheets spreadsheets.
 
 Written by edonkey, June 11, 2017
 
 2017-09-03: Changed to use blockcypher.com since blockr.io closed.
 
 Donations: 18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW
 */

// Get a blockcypher.com token and set it here.
// For info on their rates and limitations, see this page:
//	https://www.blockcypher.com/dev/bitcoin/#rate-limits-and-tokens
var gApiToken = ""

// Warning! blockr.io has closed down so this function doesn't work.
// Download the JSON from the specified URL and parse it
function getParsedJsonDataBlockr(url)
{
	var response = UrlFetchApp.fetch(url)
	var json = response.getContentText()
	var parsed = JSON.parse(json)
	var data = parsed.data
	return data
}

// Download the JSON from the specified URL and parse it
function getParsedJsonData(url)
{
	var response = UrlFetchApp.fetch(url)
	var json = response.getContentText()
	var parsed = JSON.parse(json)
	return parsed
}

// Warning! blockr.io has closed down so this function doesn't work.
// Get info about a coin
function getCoinInfoJsonBlockr(coin)
{
	var url = "http://" + coin + ".blockr.io/api/v1/coin/info"
	var data = getParsedJsonData(url)
	return data
}

// Warning! blockr.io has closed down so we can't use this any more
function getCoinDifficultyBlockr(coin)
{
	var data = getCoinInfoJsonBlockr(coin)
	var difficulty = data.last_block.difficulty
	return difficulty
}

// Return the difficulty for the spedified coin. This used to be easier with 
// blockr.io. Now it's a bit of a hack because we have to use multiple block
// explorers with  different interfaces.
function getCoinDifficulty(coin)
{
	var difficulty = 0
	if (coin == "btc")
	{
		var data = getParsedJsonData("http://blockexplorer.com/q/getdifficulty")
		difficulty = data.difficulty
	}
	else if (coin == "ltc")
	{
		var response = UrlFetchApp.fetch("http://explorer.litecoin.net/chain/Litecoin/q/getdifficulty")
		difficulty = parseFloat(response.getContentText())
	}
	
	return difficulty
}

// Get JSON info for a given coin address
function getCoinAddressInfoJson(coin, address)
{
	// blockr.io has closed down.
	//var url = "http://" + coin + ".blockr.io/api/v1/address/info/" + address
	var url = "https://api.blockcypher.com/v1/" + coin + "/main/addrs/" + address + "/balance"
	
	// If an API token was defined, use it here
	if (gApiToken != "")
	{
		url += "?token=" + gApiToken
	}
	
	var data = getParsedJsonData(url)
	return data
}

// Get JSON info for a given bitcoin address
function getAddressInfoJson(address)
{
	return getCoinAddressInfoJson("btc", address)
}

// Return the total received by a bitcoin address
function walletReceived(address)
{
	var data = getAddressInfoJson(address)
	var totalReceived = data.total_received
	if (0 != totalReceived)
		totalReceived /= 100000000
	return totalReceived
}

// Return the total transactions for a bitcoin address
function walletNumTransactions(address)
{
	var data = getAddressInfoJson(address)
	return data.n_tx
}

// Get JSON info for a given litecoin address
function getLtcAddressInfoJson(address)
{
	return getCoinAddressInfoJson("ltc", address)
}

// Return the total received by a bitcoin address
function ltcWalletReceived(address)
{
	var data = getLtcAddressInfoJson(address)
	var totalReceived = data.total_received
	if (0 != totalReceived)
		totalReceived /= 100000000
	return totalReceived
}

// Return the total transactions for a bitcoin address
function ltcWalletNumTransactions(address)
{
	var data = getLtcAddressInfoJson(address)
	return data.n_tx
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
	return coinEarningsPerDay("btc", 12.5, hashrate, 1000000000000)
}

// Get the LTC earnings per MHs per day
function ltcEarningsPerMHsPerDay(hashrate)
{
	return coinEarningsPerDay("ltc", 25, hashrate, 1000000)
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

