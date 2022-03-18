import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import includePaths from 'rollup-plugin-includepaths';

let includePathOptions = {
	include: {},
	paths: ['src'],
	external: [],
	extensions: ['.ts'],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	input: './src/index.ts',
	output: [
		{
			file: packageJson.main,
			format: 'cjs', // commonJS
		},
		{
			file: packageJson.module,
			format: 'esm',
		},
	],
	preserveSymlinks: true,
	external: {},
	plugins: [
		peerDepsExternal(),
		resolve({ jsnext: true, main: true }),
		commonjs({
			include: /node_modules/,
		}),
		babel({
			exclude: /node_modules/,
			babelHelpers: 'runtime',
		}),
		typescript({ tsconfig: './tsconfig.json' }),

		json(),
		includePaths(includePathOptions),
	],
};
