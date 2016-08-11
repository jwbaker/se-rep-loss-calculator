var url = window.location.protocol + '//' + window.location.host;

var stackURL = 'https://api.stackexchange.com';
var version = '/2.2';

var noLoginTemplate = '<button class="btn btn-primary">Log in</button>';
var loginTemplate = '<img src="http://se-flair.appspot.com/__SEID__.png" />';
var selectorOptionTemplate = '<option value="__VALUE__">__TITLE__</option>';

var access_token = undefined;
var sites = undefined;

$(document).ready(function(){
	$('#login-container').html(noLoginTemplate);

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

	$('#site-selector-container select').change(function(event){
		var idx = $(this).val();

		if(idx === ''){
			$(this).parent().addClass('has-error');
			$('#site-selector-container .help-block').removeClass('hidden');
		} else{
			$(this).parent().removeClass('has-error');
			$('#site-selector-container .help-block').addClass('hidden');
		}
	});
});

var onLoginSuccess = function(data){
	console.log(data);
	access_token = data.accessToken;
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