var url = window.location.protocol + '//' + window.location.host;

var stackURL = 'https://api.stackexchange.com';
var version = '/2.2';

var noLoginTemplate = '<button class="btn btn-primary">Log in</button>';
var loginTemplate = '<img src="https://se-flair.appspot.com/__SEID__.png" />';
var selectorOptionTemplate = '<option value="__VALUE__">__TITLE__</option>';

var accessToken = undefined;
var sites = undefined;

var targetSiteUrl = undefined;

var fromDate = undefined;
var toDate = undefined;

$(document).ready(function(){
	$('#login-container').html(noLoginTemplate);

	datePickerInit();

	SE.init({
		clientId: 6388,
		key: 'LatL0Qaw3)dPKFoK6Y1yiQ((',
		channelUrl: url + '/blank',
		complete: function(data){
			console.log(data);
		}
	});

	$('#login-container button').click(function(event){
		SE.authenticate({
			success: onLoginSuccess,
			error: function(data){
				alert('Something went wrong. Unable to log in');
				console.log(data);
			},
			scope: ['private_info'],
			networkUsers: true
		});
	});

	$('#calculate-button').click(function(event){
		doRepCalculation();
	});

	$('#site-selector-container select').change(function(event){
		var idx = $(this).val();

		if(idx === ''){
			$(this).parent().addClass('has-error');
			$('#site-selector-container .help-block').removeClass('hidden');
			$('#calculate-btn').addClass('disabled');
		} else{
			$(this).parent().removeClass('has-error');
			$('#site-selector-container .help-block').addClass('hidden');

			console.log(idx);
			setTargetSite(idx);
			$('#calculate-btn').removeClass('disabled');
		}
	});
});

var datePickerInit = function(){
	var formatString = 'MMMM D, YYYY';
	var start = moment().subtract(6, 'days');
	var end = moment();

	function cb(start, end) {
		fromDate = start.hour(0).minute(0).second(0).utc().unix();
		toDate = end.hour(23).minute(59).second(59).utc().unix();
		console.log(fromDate);
		console.log(toDate);
		$('#date-range-picker span').html(start.format(formatString) + ' - ' + end.format(formatString));
	}

	$('#date-range-picker').daterangepicker({
		startDate: start,
		endDate: end,
		locale: {
			format: formatString
		},
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);

	cb(start, end);
}

var onLoginSuccess = function(data){
	console.log(data);
	accessToken = data.accessToken;
	sites = data.networkUsers;

	$('#login-container').html(loginTemplate.replace('__SEID__', sites[0].account_id));

	buildSiteSelector();
}

var buildSiteSelector = function(){
	var options = selectorOptionTemplate.replace('__VALUE__', '').replace('__TITLE__', 'Please choose a site');

	$.each(sites, function(idx, val){
		options += selectorOptionTemplate.replace('__VALUE__', idx)
										 .replace('__TITLE__', val.site_name);
	});

	$('#site-selector-container select').append(options);
	$('#site-selector-container select').prop('disabled', false);
}

var setTargetSite = function(idx){
	if(idx < 0 || idx >= sites.length) {
		alert('Could not select site with index ' + idx);
		return;
	}

	targetSiteUrl = sites[idx].site_url.replace('http://', '');
	targetUserId = sites[idx].user_id;
}

var doRepCalculation = function(){
	var queryString = stackUrl + version + '/me/reputation-history-full/' + $.param({
		site: targetSiteUrl,
		access_token: accessToken,
		fromdate: fromDate,
		toDate: toDate,
	});

	$.ajax(queryString)
	.done(function(data, status, xhr){
		console.log(data);
	})
	.fail(function(xhr, status, err){
		console.log(err);
	});
}