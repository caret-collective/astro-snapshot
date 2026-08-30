/**
 * Utilities for forcing fixture builds to resolve Astro runtime imports from
 * the Astro version selected by each fixture's `deno.json`.
 *
 * @module
 */
import { join, resolve } from 'node:path';

/**
 * Package export target shapes used by Astro's `package.json`.
 */
type AstroExportTarget = string | { default?: string };

/**
 * Minimal Astro `package.json` shape needed to build Vite aliases.
 */
type AstroPackageJson = { exports: Record<string, AstroExportTarget> };

/**
 * Minimal fixture `deno.json` shape needed to find the fixture's Astro import.
 */
type DenoConfig = { imports?: Record<string, string> };

/**
 * Minimal Deno lockfile shape needed to resolve an npm specifier to its installed package id.
 */
type DenoLock = { specifiers?: Record<string, string> };

/**
 * Vite resolve alias entry.
 *
 * This local interface avoids importing Vite types into fixture config files,
 * while preserving the shape accepted by `vite.resolve.alias`.
 */
export interface Alias {
	/**
	 * Import specifier or regular expression to match.
	 */
	find: string | RegExp;

	/**
	 * Absolute replacement path for the matched import.
	 */
	replacement: string;
}

/**
 * Escapes regular expression metacharacters in a literal string.
 *
 * @param value - Literal string to use inside a regular expression.
 * @returns The escaped string.
 */
function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks whether a path exists and is a directory.
 *
 * @param path - Filesystem path to inspect.
 * @returns `true` when the path exists and is a directory, otherwise `false`.
 * @throws Re-throws filesystem errors other than a missing path.
 */
function dirExists(path: string) {
	try {
		return Deno.statSync(path).isDirectory;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return false;

		throw error;
	}
}

/**
 * Finds the installed Astro package directory for the current fixture.
 *
 * The fixture's `deno.json` declares the desired Astro import specifier, while
 * the root `deno.lock` records the concrete npm package id installed in
 * `node_modules/.deno`. The returned directory is used to force Vite to bundle
 * Astro runtime imports from that fixture's Astro version instead of the root
 * `node_modules/astro` symlink.
 *
 * @returns Absolute path to the installed Astro package directory.
 * @throws If the current fixture does not declare an Astro import, the lockfile
 * does not contain that specifier, or no matching package directory exists.
 */
export function findAstroPackageDir() {
	const rootDir = resolve(Deno.cwd(), '../../..');
	const denoPackageDir = resolve(rootDir, 'node_modules/.deno');
	const denoConfig = JSON.parse(Deno.readTextFileSync(resolve(Deno.cwd(), 'deno.json'))) as DenoConfig;
	const lock = JSON.parse(Deno.readTextFileSync(resolve(rootDir, 'deno.lock'))) as DenoLock;
	const astroSpecifier = denoConfig.imports?.astro;
	const astroPackageId = astroSpecifier ? lock.specifiers?.[astroSpecifier] : undefined;

	if (!astroPackageId) {
		throw new Error('Unable to find fixture Astro specifier in deno.lock.');
	}

	const exactPackageDir = join(denoPackageDir, `astro@${astroPackageId}`);

	if (dirExists(exactPackageDir)) return join(exactPackageDir, 'node_modules/astro');

	const version = astroPackageId.split('_')[0];
	const prefix = `astro@${version}`;
	const versionPackageDir = join(denoPackageDir, prefix);

	if (dirExists(versionPackageDir)) return join(versionPackageDir, 'node_modules/astro');

	for (const entry of Deno.readDirSync(denoPackageDir)) {
		if (entry.isDirectory && entry.name.startsWith(`${prefix}_`)) {
			return join(denoPackageDir, entry.name, 'node_modules/astro');
		}
	}

	throw new Error(`Unable to find installed Astro ${version} package.`);
}

/**
 * Builds Vite aliases for every public Astro package export.
 *
 * Each alias points `astro` and `astro/*` imports at absolute files inside the
 * fixture's installed Astro package. This keeps Astro's build-time generated
 * bundles on the same Astro major as the fixture that launched the build.
 *
 * @param astroPackageDir - Absolute path returned by {@link findAstroPackageDir}.
 * @returns Vite-compatible aliases for Astro package exports.
 */
export function buildAstroAliases(astroPackageDir: string): Alias[] {
	const { exports } = JSON.parse(
		Deno.readTextFileSync(join(astroPackageDir, 'package.json')),
	) as AstroPackageJson;
	const aliases: Alias[] = [];

	for (const [key, target] of Object.entries(exports)) {
		const replacement = typeof target === 'string' ? target : target.default;

		if (!replacement) continue;

		const specifier = key === '.' ? 'astro' : `astro/${key.slice(2)}`;
		const find = specifier.includes('*')
			? new RegExp(`^${escapeRegExp(specifier).replace('\\*', '(.*)')}$`)
			: new RegExp(`^${escapeRegExp(specifier)}$`);

		aliases.push({
			find,
			replacement: join(astroPackageDir, replacement.replace(/^\.\//, '').replaceAll('*', '$1')),
		});
	}

	return aliases;
}
