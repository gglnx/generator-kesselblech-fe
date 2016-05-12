import { src, dest } from 'gulp';
import jade from 'gulp-jade';
import inject from 'gulp-inject';

export default function html() {
	return src('src/*.jade')
		.pipe(jade({
			pretty: true,
		}))
		.pipe(inject(src('dest/icons/*.svg'), {
			transform: (fileName, file) => file.contents.toString('utf8'),
		}))
		.pipe(dest('dest'));
}
