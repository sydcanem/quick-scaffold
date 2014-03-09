function greeting() {
	return '<h1>Gulp.js + Browserify kicks ass!</h1>';
}

exports.welcome = function() {
	var elem = document.getElementById('welcome');
	elem.innerHTML = greeting();
};
