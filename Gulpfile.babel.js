import { src } from 'gulp';
import eslint from 'gulp-eslint';
import nsp from 'gulp-nsp';
import path from 'path';

export function test() {
	return src('**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

export function prepublish(cb) {
	nsp({ package: path.resolve('package.json') }, cb);
}

export default test;
