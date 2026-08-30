import { defineConfig } from 'astro/config';
import snapshot from '../../../packages/astro-snapshot/src/index.ts';
import { buildAstroAliases, findAstroPackageDir } from '../astro-alias.ts';
import { resolveScenario } from '../scenarios.ts';

const astroPackageDir = findAstroPackageDir();

// https://astro.build/config
export default defineConfig({
	srcDir: '../shared',
	integrations: [
		snapshot(resolveScenario()),
	],
	vite: {
		resolve: {
			alias: buildAstroAliases(astroPackageDir),
		},
	},
});
