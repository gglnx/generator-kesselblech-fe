import { src, dest } from 'gulp';

export default function copy(done) {
	src(['src/images/**/*']).pipe(dest('dest/images'));
	src(['src/fonts/**/*']).pipe(dest('dest/fonts'));
	done();
}
