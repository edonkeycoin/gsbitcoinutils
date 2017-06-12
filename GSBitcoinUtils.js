/*
 Useful set of cryptocurrency related utilities in simple Javascript that can
 be used in GoogleSheets spreadsheets.
 
 Written by edonkey, June 11, 2017
 
 Donations: 18wQtEDmhur2xAd3oE8qgrZbpCDeuMsdQW
 */

// Download the JSON from the specified URL and parse it
function getParsedJsonData(url)
{
	var response = UrlFetchApp.fetch(url);
	var json = response.getContentText();
	var parsed = JSON.parse(json);
	var data = parsed.data
	return data
}

// Use blockr.io to get info about a coin
function getCoinInfoJson(coin)
{
	var url = "http://" + coin + ".blockr.io/api/v1/coin/info";
	var data = getParsedJsonData(url);
	return data
}

// Use blockr.io to receive JSON info for a given coin address
function getCoinAddressInfoJson(coin, address)
{
	var url = "http://" + coin + ".blockr.io/api/v1/address/info/" + address;
	var data = getParsedJsonData(url);
	return data
}

// Use blockr.io to receive JSON info for a given bitcoin address
function getAddressInfoJson(address)
{
	return getCoinAddressInfoJson("btc", address)
}

// Return the total received by a bitcoin address
function walletReceived(address)
{
	var data = getAddressInfoJson(address)
	return data.totalreceived;
}

// Return the total transactions for a bitcoin address
function walletNumTransactions(address)
{
	var data = getAddressInfoJson(address)
	return data.nb_txs;
}

// Use blockr.io to receive JSON info for a given bitcoin address
function getLtcAddressInfoJson(address)
{
	return getCoinAddressInfoJson("ltc", address)
}

// Return the total received by a bitcoin address
function ltcWalletReceived(address)
{
	var data = getLtcAddressInfoJson(address)
	return data.totalreceived;
}

// Return the total transactions for a bitcoin address
function ltcWalletNumTransactions(address)
{
	var data = getLtcAddressInfoJson(address)
	return data.nb_txs;
}

// Compute coin earnings. Algorithm from here:
//	http://www.holynerdvana.com/2014/02/how-to-calculate-coins-per-day-for-any.html
function computeCoinEarnings(seconds, blockReward, difficulty, hashrate)
{
	var reward = (seconds * blockReward * hashrate) / (difficulty * (Math.pow(2, 48) / 0x00000000ffff));
	return reward;
}

// Compute the earnings per day for a given coin
function earningsPerDay(blockReward, difficulty, hashrate)
{
	var earnings = computeCoinEarnings(86400, blockReward, difficulty, hashrate);
	return earnings;
}

// Get the current info on the specified coin to compute the earnings per day
function coinEarningsPerDay(coin, blockReward, hashrate, hashMultiplier)
{
	// Get the last difficulty for coin
	var data = getCoinInfoJson(coin);
	var difficulty = data.last_block.difficulty

	// Compute the total hashrate
	var totalHashrate = hashrate * hashMultiplier;

	// Compute and return the earnings
	var earnings = earningsPerDay(blockReward, difficulty, totalHashrate);
	return earnings;
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
	
	// Blocks if Safari popups blocked
	//Browser.msgBox(received)
}

