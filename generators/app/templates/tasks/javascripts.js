import { dest } from 'gulp';
import { browsersync } from './browsersync';
import through from 'through2';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import util from 'gulp-util';
import globby from 'globby';
import gulpif from 'gulp-if';
import babelify from 'babelify';

export default function javascripts() {
	const bundledStream = through();

	bundledStream
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
		.on('error', util.log)
		.pipe(gulpif(process.env.NODE_ENV !== 'production', sourcemaps.write('./')))
		.pipe(dest('dest/javascripts'))
		.pipe(gulpif(process.env.NODE_ENV !== 'production', browsersync.reload({ stream: true })));

	globby(['src/javascripts/*.js']).then(entries => {
		browserify({
			entries,
			debug: process.env.NODE_ENV !== 'production',
			transform: [babelify],
		}).bundle().pipe(bundledStream);
	}).catch(err => bundledStream.emit('error', err));

	return bundledStream;
}
