
const truncate = (fullStr, strLen) => {
	if(fullStr === undefined || !fullStr || fullStr.length <= strLen) return fullStr

	const separator = '...'

	let sepLen = separator.length
	let charsToShow = strLen - sepLen
	let frontChars = Math.ceil(charsToShow / 2)
	let backChars = Math.floor(charsToShow / 2)

	return fullStr.substr(0, frontChars) +
		separator +
		fullStr.substr(fullStr.length - backChars)
}

const toString = (address) => {
	if(address === undefined || !address) return address

	return address.toLowerCase().replace('0x', '')
}

const fixedNumber = (fullNumber, toFixed = 5, minDecimals = 2) => {
	if(fullNumber === undefined) return undefined
	let fixedNumber =	+fullNumber.toFixed(toFixed).toString()
	const dec = String(fixedNumber).split('.')[1]
  const len = dec && dec.length > minDecimals ? dec.length : minDecimals
  return Number(fixedNumber).toFixed(len)
}

function formatPrice(price, decimals = 2) {
	if(typeof price === 'string') price = parseFloat(price);
	return price.toFixed(decimals);
}

function formatLabel(labelValue, fixed = 1) {
	return Math.abs(Number(labelValue)) >= 1.0e+12
		? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(fixed) + 'T'
		: Math.abs(Number(labelValue)) >= 1.0e+9
			? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(fixed) + 'B'
			: Math.abs(Number(labelValue)) >= 1.0e+6
				? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(fixed) + 'M'
				: Math.abs(Number(labelValue)) >= 1.0e+3
					? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(fixed) + 'K'
					: (Math.abs(Number(labelValue))).toFixed(fixed)
}

function nftIpfsLink(link) {
	if(link) {
		return link.replace('ipfs://', process.env.VUE_APP_WEB3STORAGE_GATEWAY_LINK)
	}
	return link
}

function formatDate(unixTimestamp, formatDate = 'DD-MM-YYYY', formatTime = null) {
	if(!unixTimestamp) return null;
	let date = new Date(unixTimestamp)
	const Year = date.getFullYear()
	const Month = '0' + (date.getMonth() + 1)
	const Day = '0' + date.getDate()
	const Hours = date.getHours()
	const Minutes = '0' + date.getMinutes()
	const Seconds = '0' + date.getSeconds()
	
	let formattedDate = Day.slice(-2) + '-' + Month.slice(-2) + '-' + Year
	if(formatDate == 'DD Month YYYY') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = Day.slice(-2) + ' ' + MonthNames[date.getMonth()] + ' ' + Year
	}
	if(formatDate == 'DD Month') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = Day.slice(-2) + ' ' + MonthNames[date.getMonth()]
	}
	if(formatDate == 'Month YYYY') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = MonthNames[date.getMonth()] + ' ' + Year
	}

	let formattedTime = null;
	if(formatTime == 'HH:MM:SS') {
		formattedTime = Hours + ':' + Minutes.substring(Minutes.length - 2) + ':' + Seconds.substring(Seconds.length - 2)
	}
	if(formatTime == 'HH:MM') {
		formattedTime = Hours + ':' + Minutes.substring(Minutes.length - 2)
	}

	return formattedDate + (formattedTime ? ` - ${formattedTime}` : '');
}

function calcLoanAmounts(circleSize, roundDays, roundPayment, patienceBenefit) {
	const totalPayments = circleSize * roundPayment;
	let calcResult = [];
	for(let round = 1; round <= circleSize; round++) {
		calcResult.push({
			roundNo: round,
			totalPayments: totalPayments,
			loanAmount: totalPayments + winnerPnL(round, circleSize, roundDays, totalPayments, patienceBenefit)
		})
	}
	return calcResult;
}

function calcTotalPayments(circleSize, roundDays, loanAmount, patienceBenefit) {
	let calcResult = [];
	for(let round = 1; round <= circleSize; round++) {
		calcResult.push({
			roundNo: round,
			totalPayments: loanAmount - winnerPnL(round, circleSize, roundDays, loanAmount, patienceBenefit),
			loanAmount: loanAmount
		})
	}
	return calcResult;
}

function winnerPnL(winnerRound, circleSize, roundDays, totalAmount, patienceBenefit) {
	const _winnerPnL = ((winnerRound - ((circleSize + 1) / 2)) * ((patienceBenefit / 100) / (365 / roundDays))) * totalAmount;
	return _winnerPnL;
}

function nextRound(firstDate, diffDays = 1) {
	const date = new Date(firstDate);
	date.setDate(date.getDate() + diffDays);
	return date;
}

function diffDays(date1, date2) {
	const time_difference = date2.getTime() - date1.getTime();
	const days_difference = parseInt(time_difference / (1000 * 60 * 60 * 24));
	return days_difference;
}

function objectCleaner(obj) {
  Object.keys(obj).forEach(key => {
		if(obj[key] === '' || obj[key] === null || obj[key] === undefined) {
			delete obj[key];
		}
	})
  return obj
}

export default {
	truncate,
	toString,
	fixedNumber,
	formatPrice,
	formatDate,
	calcLoanAmounts,
	calcTotalPayments,
	winnerPnL,
	nextRound,
	diffDays,
	objectCleaner,
	formatLabel,
	nftIpfsLink
}
