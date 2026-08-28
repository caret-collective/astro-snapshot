/**
 * Helpers for setting up and tearing down the Astro fixture used in integration tests.
 *
 * @module
 */
import { info } from 'node:console';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { highlight } from './text.ts';
import type { AstroFixture } from '../constants.ts';
import type { BuildResult } from '../types.ts';

/**
 * Removes the output directory so stale screenshots can't cause a false pass.
 * Silently succeeds if the directory doesn't exist yet.
 *
 * @param absoluteOutputPath - Absolute path to the output directory to remove.
 */
export async function cleanOutput(absoluteOutputPath: string) {
	info(highlight`🧹 Cleaning output directory at ${absoluteOutputPath}...`);

	try {
		await Deno.remove(absoluteOutputPath, { recursive: true });
	} catch (error) {
		// Ignore if the directory doesn't exist yet, but re-throw everything else
		// (ex. missing --allow-write permission)
		if (!(error instanceof Deno.errors.NotFound)) throw error;
	}
}

/**
 * Creates a placeholder text file at `absolutePath`.
 *
 * Used to seed the output directory before overwrite tests so that the
 * integration has an existing file to skip or replace. If the build's
 * overwrite logic works correctly, the placeholder will be replaced with a
 * valid image. If it is skipped, Sharp will fail to read the file as an image,
 * causing the color assertion to fail.
 *
 * @param absolutePath - Absolute path where the placeholder file will be written.
 */
export async function seedFile(absolutePath: string) {
	await mkdir(dirname(absolutePath), { recursive: true });

	return Deno.writeTextFile(absolutePath, 'placeholder');
}

/**
 * Runs `astro build` inside the fixture project for the given scenario.
 *
 * Returns a {@link BuildResult} rather than throwing on failure, so callers
 * can assert on both successful and failing builds.
 *
 * @param scenario - The scenario key to pass as the `SCENARIO` environment variable.
 * @param fixture - Fixture project to run the build in.
 */
export async function runAstroBuildWithScenario(scenario: string, fixture: AstroFixture) {
	info(highlight`🔨 Running \`astro build\` for ${fixture.name} scenario ${scenario}...`);

	const { success, stdout, stderr } = await new Deno.Command(Deno.execPath(), {
		args: ['run', '-A', 'astro', 'build'],
		cwd: fixture.absPath,
		stdout: 'piped',
		stderr: 'piped',
		// Deno merges this with the inherited parent environment
		env: {
			SCENARIO: scenario,
		},
	}).output();

	const decoder = new TextDecoder();
	const result: BuildResult = {
		success,
		stdout: decoder.decode(stdout),
		stderr: decoder.decode(stderr),
	};

	return result;
}
