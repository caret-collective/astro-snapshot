import { build, emptyDir } from '@deno/dnt';
import rootDeno from '../../../deno.json' with { type: 'json' };
import packageDeno from '../deno.json' with { type: 'json' };

const AUTHOR = {
	username: 'twocaretcat',
	domain: 'johng.io',
} as const;
const PACKAGE_NAME = 'astro-snapshot' as const;
const REPO_URL = `https://github.com/caret-collective/${PACKAGE_NAME}` as const;
const dir = {
	src: './src',
	out: './npm',
} as const;
const ASTRO_VERSION = {
	previous: '^5.18.1',
	current: rootDeno.imports.astro.split('@')[1],
} as const;

/**
 * Removes the `astro` peer dependency from the built `package.json`.
 *
 * This post-build patch removes the generated
 * `astro` entry from `dependencies` so that consumers are not forced to
 * install a specific version. Instead, they supply their own via the
 * declared `peerDependencies` range.
 *
 * @returns A promise that resolves when the patched `package.json` has been written to disk.
 */
async function patchAstroVersion() {
	const pkgPath = `${dir.out}/package.json`;
	const pkg = JSON.parse(await Deno.readTextFile(pkgPath));

	delete pkg.dependencies.astro;

	return Deno.writeTextFile(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
}

await emptyDir(dir.out);
await build({
	entryPoints: [
		{
			name: '.',
			path: `${dir.src}/index.ts`,
		},
	],
	outDir: dir.out,
	compilerOptions: {
		lib: ['ES2022'],
		target: 'ES2022',
	},
	shims: {},
	test: false,
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
		peerDependencies: {
			astro: `${ASTRO_VERSION.previous} || ${ASTRO_VERSION.current}`,
		},
	},
	async postBuild() {
		await Promise.all([
			Deno.copyFile('../../LICENSE', `${dir.out}/LICENSE`),
			Deno.copyFile('../../README.md', `${dir.out}/README.md`),
			patchAstroVersion(),
		]);
	},
});
