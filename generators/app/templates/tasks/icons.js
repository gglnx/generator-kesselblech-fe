import { src, dest } from 'gulp';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import path from 'path';

export default function icons() {
	return src('src/icons/*.svg')
		.pipe(svgmin(file => ({
			plugins: [{
				cleanupIDs: {
					prefix: `${path.basename(file.relative, path.extname(file.relative))}-`,
					minify: true,
				},
			}],
		})))
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(dest('dest/icons'));
}
