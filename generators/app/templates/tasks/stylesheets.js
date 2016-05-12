import { src, dest } from 'gulp';
import { browsersync } from './browsersync';
import sass from 'gulp-sass';
import gulpif from 'gulp-if';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

export default function stylesheets() {
	return src('src/stylesheets/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['src/stylesheets', 'node_modules'],
			outputStyle: (process.env.NODE_ENV === 'production') ? 'compressed' : 'nested',
		}))
		.pipe(autoprefixer({
			browsers: [
				'Chrome >= 35',
				'Firefox >= 38',
				'Edge >= 12',
				'Explorer >= 9',
				'iOS >= 8',
				'Safari >= 8',
				'Android 2.3',
				'Android >= 4',
				'Opera >= 12',
			],
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dest/stylesheets'))
		.pipe(gulpif(process.env.NODE_ENV !== 'production', browsersync.stream({ match: '**/*.css' })));
}
