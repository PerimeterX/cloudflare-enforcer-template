import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pluginJson from '@rollup/plugin-json';

export default {
    plugins: [
        typescript(),
        nodeResolve(),
        pluginJson(),
        commonjs(),
    ],
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        entryFileNames: 'index.js',
        format: 'module',
        generatedCode: {
            preferConst: true
        },
    },
};
