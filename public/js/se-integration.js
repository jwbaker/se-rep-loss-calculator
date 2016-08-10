var url = 'https://se-rep-loss-calculator.herokuapp.com/'

var noLoginTemplate = '<button class="btn btn-primary">Log in</button>';
var loginTemplate = '<p><img src="http://se-flair.appspot.com/__SEID__.png" alt=""></p>'

var access_token = undefined;
var users = undefined;

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
	users = data.network_users;

	for(var i = 0; i < users.length; i++){
		if(users[i].site_url === 'http://stackexchange.com'){
			$('#login-container').html(loginTemplate.replace(
				'__SEID__',
				users[i].account_id
			));
		}
	}
}