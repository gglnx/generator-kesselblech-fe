import { watch, parallel, series } from 'gulp';
import { browsersync } from './tasks/browsersync';
import clean from './tasks/clean';
import stylesheets from './tasks/stylesheets';
import javascripts from './tasks/javascripts';
import html from './tasks/html';
import copy from './tasks/copy';
import icons from './tasks/icons';

// Build task
export const build = series(
	clean, icons, parallel(javascripts, html, stylesheets, copy)
);

// Development task
export const development = series(
	clean, icons, parallel(javascripts, stylesheets, html), function run() {
		// Start browserSync
		browsersync.init({
			server: {
				baseDir: ['src', 'dest'],
				routes: {
					'/node_modules': 'node_modules',
				},
			},
		});

		// Watch files, run compliers
		watch('src/stylesheets/**/*.scss', stylesheets);
		watch('src/**/*.jade', series(html, browsersync.reload));
		watch('src/javascripts/**/*.js', javascripts);
		watch('src/icons/*.svg', icons);
	}
);
