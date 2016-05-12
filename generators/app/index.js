'use strict';
const _ = require('lodash');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const extend = require('extend');
const mkdirp = require('mkdirp');
const isGitUrl = require('is-git-url');

module.exports = yeoman.Base.extend({
	initializing() {
		this.props = {};
	},

	prompting() {
		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the Kesselblech frontend generator!'
		));

		// Prompts
		const prompts = [
			{
				name: 'name',
				message: 'Who is your project named?',
				default: path.basename(process.cwd()),
				validate(str) {
					return str.length > 0;
				},
			},
			{
				name: 'description',
				message: 'Description',
			},
			{
				name: 'repository',
				message: 'Repository (URL or shortcut syntax)',
			},
			{
				name: 'homepage',
				message: 'Project homepage url',
			},
			{
				name: 'authorName',
				message: 'Author\'s Name',
				default: this.user.git.name(),
				store: true,
			},
			{
				name: 'authorEmail',
				message: 'Author\'s Email',
				default: this.user.git.email(),
				store: true,
			},
			{
				name: 'authorUrl',
				message: 'Author\'s Homepage',
				store: true,
			},
			{
				name: 'keywords',
				message: 'Package keywords (comma to split)',
				filter(words) {
					return words.split(/\s*,\s*/g);
				},
			},
		];

		// Run configurator
		return this.prompt(prompts).then((props) => {
			this.props = props;
		});
	},

	default() {
		if (path.basename(this.destinationPath()) !== this.props.name) {
			this.log(`Your project must be inside a folder named ${this.props.name}!`);
			this.log('I\'ll automatically create this folder.');

			mkdirp(this.props.name);
			this.destinationRoot(this.destinationPath(this.props.name));
		}

		this.composeWith('license', {
			options: {
				name: this.props.authorName,
				email: this.props.authorEmail,
				website: this.props.authorUrl,
			},
		}, {
			local: require.resolve('generator-license/app'),
		});
	},

	writing() {
		const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
		const pkg = extend({
			name: _.kebabCase(this.props.name),
			version: '0.0.0',
			description: this.props.description,
			keywords: [],
			homepage: this.props.homepage,
			author: {
				name: this.props.authorName,
				email: this.props.authorEmail,
				url: this.props.authorUrl,
			},
			scripts: {
				development: 'gulp development',
				build: 'NODE_ENV=production gulp build',
				lint: 'eslint .',
			},
			dependencies: {},
			devDependencies: {
				'babel-core': '^6.7.4',
				'babel-eslint': '^6.0.4',
				'babel-preset-es2015': '^6.6.0',
				babelify: '^7.2.0',
				'browser-sync': '^2.11.2',
				browserify: '^13.0.0',
				del: '^2.2.0',
				eslint: '^2.8.0',
				'eslint-config-airbnb-base': '^1.0.3',
				'eslint-plugin-import': '^1.6.0',
				globby: '^4.0.0',
				gulp: 'github:gulpjs/gulp#4.0',
				'gulp-autoprefixer': '^3.1.0',
				'gulp-if': '^2.0.0',
				'gulp-inject': '^3.0.0',
				'gulp-jade': '^1.1.0',
				'gulp-sass': '^2.2.0',
				'gulp-sourcemaps': '^1.6.0',
				'gulp-svgmin': '^1.2.2',
				'gulp-svgstore': '^6.0.0',
				'gulp-uglify': '^1.5.3',
				'gulp-util': '^3.0.7',
				through2: '^2.0.1',
				'vinyl-buffer': '^1.0.0',
				'vinyl-source-stream': '^1.1.0',
			},
		}, currentPkg);

		if (this.props.keywords) {
			pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
		}

		if (this.props.repository) {
			if (isGitUrl(this.props.repository)) {
				pkg.repository = {
					type: 'git',
					url: this.props.repository,
				};
			} else {
				pkg.repository = this.props.repository;
			}
		}

		this.fs.writeJSON(this.destinationPath('package.json'), pkg);

		this.fs.copy(
			this.templatePath('**'),
			this.destinationPath(),
			{ globOptions: { dot: true } }
		);
	},

	install() {
		this.npmInstall();
	},
});
