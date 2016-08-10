var url = 'https://se-rep-loss-calculator.herokuapp.com/'

var noLoginTemplate = '<button class="btn btn-primary">Log in</button>';
var loginTemplate = '<p>Login successful!</p>';
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
});

var onLoginSuccess = function(data){
	console.log(data);
	access_token = data.accessToken;
	sites = data.networkUsers;

	$('#login-container').html(loginTemplate);

	buildSiteSelector();
}

var buildSiteSelector = function(){
	var options = selectorOptionTemplate.replace('__VALUE__', '').replace('__TITLE__', 'Please choose a site');

	$.each(users, function(idx, val){
		options += selectorOptionTemplate.replace('__VALUE__', val.user_id).replace('__TITLE__', val.site_name);
	});

	$('#site-selector-container select').append(options);
	$('#site-selector-container select').prop('disabled', false);
}