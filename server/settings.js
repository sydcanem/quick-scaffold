module.exports = {
	'app' : {
		'port' : process.env.NODE_PORT || '9090',
		'host' : 'localhost'
	},

	'env' : process.env.NODE_ENV || 'development',
	
	'session' : {
		'secret' : 'mouse trap',
		'db'     : 'dev'
	},

	'static' : {
		'files' : process.cwd() + '/public',
		'views' : process.cwd() + '/public/views'
	},

	'github' : {
		'oauthEndpoint' : 'https://github.com/login/oauth/access_token',
		'clientID'      : process.env.GITHUB_ID,
		'clientSecret'  : process.env.GITHUB_SECRET,
		'callbackURL'   : '/auth/github/callback'
	}
};
