import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import packageJson from './package.json' assert { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	input: './src/index.ts',
	output: [
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap: !isProduction,
		},
		{
			file: packageJson.main,
			format: 'cjs', // commonJS
			sourcemap: true,
		},
	],
	preserveSymlinks: true,
	external: {},
	plugins: [
		typescript({
			tsconfig: './tsconfig.json',
		}),
		peerDepsExternal(),
		commonjs({
			include: /node_modules/,
		}),
		babel({
			exclude: /node_modules/,
			babelHelpers: 'bundled',
			babelrc: true,
		}),
		nodeResolve(),
		nodePolyfills(),
		json(),
		typescriptPaths(),
	],
};

export default config;
