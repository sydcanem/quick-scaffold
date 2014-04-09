## Simple scaffold using Gulp, Browserify, Express, React, Mongoose with Github Login

![dependency](https://david-dm.org/sydcanem/quick-scaffold.svg)

To enable source maps for .js files

`gulp --debug`

## Module setup

### Backbone.ioBind
Add this to support/compile.js to be usable by browserify

	var index = new Glossary([
		path.join(__dirname, '..', 'lib', 'sync.js'),
		path.join(__dirname, '..', 'lib', 'model.js'),
		path.join(__dirname, '..', 'lib', 'collection.js')
	], {
		prefix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'prefix.js'), 'utf8'),
		suffix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'suffix.js'), 'utf8')
	});

	index.compile(function (err, source) {
		source = source.replace(/@VERSION/g, version);
		fs.writeFileSync(path.join(__dirname, '..', '.', 'index.js'), source);
		console.log('Build successful: '.green + '\tindex.js'.blue);
	});