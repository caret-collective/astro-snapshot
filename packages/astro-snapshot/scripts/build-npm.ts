import { build, emptyDir } from '@deno/dnt';
import rootDeno from '../../../deno.json' with { type: 'json' };
import packageDeno from '../deno.json' with { type: 'json' };

const AUTHOR = {
	username: 'twocaretcat',
	domain: 'johng.io',
} as const;
const PACKAGE_NAME = 'astro-snapshot' as const;
const REPO_URL = `https://github.com/caret-collective/${PACKAGE_NAME}` as const;
const DIR = {
	src: './src',
	out: './npm',
} as const;
const currentAstroVersion = rootDeno.imports.astro.split('@')[1];
const nodeTypesVersion = packageDeno.imports['@types/node'].replace(/^npm:@types\/node@/, '');

await emptyDir(DIR.out);
await build({
	entryPoints: [
		{
			name: '.',
			path: `${DIR.src}/index.ts`,
		},
	],
	outDir: DIR.out,
	compilerOptions: {
		lib: ['ES2022'],
		target: 'ES2022',
	},
	shims: {},
	test: false,
	mappings: {
		[`npm:astro@${currentAstroVersion}`]: {
			name: 'astro',
			version: ['^5.18.1', '^6.1.7', currentAstroVersion].join(' || '),
			peerDependency: true,
		},
	},
	package: {
		name: packageDeno.name,
		version: Deno.args[0] ?? packageDeno.version,
		description:
			'An Astro integration for generating screenshots of your pages automatically at build time. Perfect for creating social images, content previews, dynamic icons, and more!',
		keywords: [
			'withastro',
			'astro',
			'astro-integration',
			'screenshot',
			'puppeteer',
			'puppeteer-screenshot',
			'social-preview',
			'social-images',
			'og-images',
			'preview',
			'image',
			'images',
			'seo',
			'typescript',
			'deno',
		],
		license: 'MIT',
		author: {
			name: 'John Goodliff',
			url: `https://${AUTHOR.domain}`,
		},
		repository: {
			type: 'git',
			url: `git+${REPO_URL}.git`,
		},
		homepage: `https://${PACKAGE_NAME}.${AUTHOR.domain}`,
		bugs: `${REPO_URL}/issues`,
		funding: [
			{
				type: 'individual',
				url: `https://${AUTHOR.domain}/funding`,
			},
			{
				type: 'GitHub Sponsors',
				url: `https://github.com/sponsors/${AUTHOR.username}`,
			},
			{
				type: 'Patreon',
				url: `https://patreon.com/${AUTHOR.username}`,
			},
			{
				type: 'Brave Creators',
				url: 'https://publishers.basicattentiontoken.org/en/c/johng',
			},
		],
		devDependencies: {
			'@types/node': nodeTypesVersion,
		},
	},
	async postBuild() {
		await Promise.all([
			Deno.copyFile('../../LICENSE', `${DIR.out}/LICENSE`),
			Deno.copyFile('../../README.md', `${DIR.out}/README.md`),
		]);
	},
});
