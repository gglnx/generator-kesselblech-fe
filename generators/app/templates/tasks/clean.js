import del from 'del';

export default function clean() {
	return del(['dest/**']);
}
