var url = window.location.protocol + '//' + window.location.host;

var stackUrl = 'https://api.stackexchange.com';
var version = '/2.2';

var apiKey = 'LatL0Qaw3)dPKFoK6Y1yiQ((';

var noLoginTemplate = '<button class="btn btn-primary">Log in</button>';
var loginTemplate = '<img src="https://se-flair.appspot.com/__SEID__.png" />';
var selectorOptionTemplate = '<option value="__VALUE__">__TITLE__</option>';

// var accessToken = undefined;
var accessToken = 'yYJKNrOkWemouX8aXqXbtg))';
var sites = undefined;

// var targetSiteUrl = undefined;
var targetSiteUrl = 'scifi';

var fromDate = undefined;
var toDate = undefined;

var reputationObjects = {};

$(document).ready(function(){
	$('#login-container').html(noLoginTemplate);

	datePickerInit();

	SE.init({
		clientId: 6388,
		key: apiKey,
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
		buildReputationObjects().then(function(reputationObjects){
			doReputationCalculation(reputationObjects);
		}, function(error){
			alert('Something went wrong: ' + error);
		});
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

			setTargetSite(idx);
			$('#calculate-button').removeClass('disabled');
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

var buildRepQueryString = function(page){
	return stackUrl + version + '/me/reputation-history/full?' + $.param({
		key: apiKey,
		site: targetSiteUrl,
		access_token: accessToken,
		fromdate: fromDate,
		toDate: toDate,
		page: page,
		pagesize: 100
	});
}

var buildReputationObjects = function(page){
	var deferred = Q.defer();

	page = page || 1;
	var queryString = buildRepQueryString(page);

	$.ajax(queryString)
	.done(function(data, status, xhr){
		$.each(data.items, function(idx, elem){
			if(!(elem.post_id in reputationObjects)){
				reputationObjects[elem.post_id] = [];
			}
			reputationObjects[elem.post_id].push(elem);
		});

		if(data.has_more){
			buildReputationObjects(page++);
		} else{
			deferred.resolve(reputationObjects);
		}
	})
	.fail(function(xhr, status, err){
		console.log(xhr);
		deferred.reject(err);
	});

	return deferred.promise;
}

var POST_TYPE_DEPENDENT = ['voter_downvotes', 'voter_undownvotes', 'post_upvoted', 'post_unupvoted'];
var idsToCheck = {};

var doReputationCalculation = function(postRepChanges){
	var earnedRep = 0;
	var actualRep = 0;

	for(var postId in postRepChanges){
		for(var i = 0; i < postRepChanges[postId].length; i++){
			var repObject = postRepChanges[postId][i];
			actualRep += repObject.reputation_change;

			if($.inArray(repObject.reputation_history_type, POST_TYPE_DEPENDENT) >= 0){
				if(!(postId in idsToCheck)){
					idsToCheck[postId] = [];
				}
				idsToCheck[postId].push(repObject.reputation_history_type);
			} else{
				earnedRep += repObject.reputation_change;
			}
		}
	}

	doCalculateRepForPostTypes(idsToCheck).then(function(result){
		earnedRep += result;
		alert("Earned: " + earnedRep + "; actual: " + actualRep);
	}, function(error){
		alert('Something went wrong: ' + error);
	});
}

var buildPostsQueryString = function(postIds){
	var vectorizedPostIds = postIds.join(';');
	return stackUrl + version + '/posts/' + vectorizedPostIds + '?' + $.param({
		key: apiKey,
		site: targetSiteUrl,
		pagesize: 100
	});
}

var POST_DEPENDENT_REP_CHANGES = {
	'question': {
		'voter_downvotes': 0,
		'voter_undownvotes': 0,
		'post_upvoted': 5,
		'post_unupvoted': -5
	},
	'answer': {
		'voter_downvotes': -1,
		'voter_undownvotes': 1,
		'post_upvoted': 10,
		'post_unupvoted': -10
	}
};

var _doCalculateRepForPostTypes = function(queryIds, repForPostIds){
	var deferred = Q.defer();

	var queryString = buildPostsQueryString(queryIds);
	$.ajax(queryString)
	.done(function(data, status, xhr){
		var total = 0;
		$.each(data.items, function(idx, elem){
			var postType = elem.post_type;
			for(var i = 0; i < repForPostIds[elem.post_id].length; i++){
				var repChangeType = repForPostIds[elem.post_id][i];
				total += POST_DEPENDENT_REP_CHANGES[postType][repChangeType];
			}
		});
		deferred.resolve(total);
	})
	.fail(function(xhr, status, err){
		console.log(xhr);
		deferred.reject(err);
	});

	return deferred.promise;
}

var doCalculateRepForPostTypes = function(repForPostIds){
	var deferred = Q.defer();

	var total = 0;
	var postIds = Object.keys(repForPostIds);

	var promises = [];
	for(var i = 0; i < postIds.length; i += 100){
		var end = Math.min(postIds.length, i+100);
		var queryIds = postIds.slice(i, end);

		promises.push(_doCalculateRepForPostTypes(queryIds, repForPostIds));
	}

	Q.allSettled(promises).then(function(results){
		$.each(results, function(idx, elem){
			if(elem.state === 'fulfilled'){
				total += elem.value;
			} else if(elem.state === 'rejected'){
				deferred.reject(elem.reason);
			}
		});

		deferred.resolve(total);
	});

	return deferred.promise;
}