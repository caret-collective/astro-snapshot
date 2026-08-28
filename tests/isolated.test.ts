import { beforeAll, describe, it } from '@std/testing/bdd';
import { resolve } from 'node:path';
import { ASTRO_FIXTURES, ISOLATED_OUTPUT_DIR } from './constants.ts';
import { ISOLATED_TEST_CASE_MAP } from './test-cases/isolated/index.ts';
import { TestSetup } from './types.ts';
import { BuildAsserter, FileAsserter, ImageAsserter } from './utils/assertions.ts';
import { cleanOutput, runAstroBuildWithScenario, seedFile } from './utils/setup.ts';
import { highlight } from './utils/text.ts';

for (const fixture of ASTRO_FIXTURES) {
	const absOutputPath = resolve(fixture.absPath, ISOLATED_OUTPUT_DIR);

	await cleanOutput(absOutputPath);

	describe(`${fixture.name} astro-snapshot isolated builds`, () => {
		for (const [key, testCase] of Object.entries(ISOLATED_TEST_CASE_MAP)) {
			const { screenshotConfig, setup, expected } = testCase;
			const outputPath = screenshotConfig ? resolve(fixture.absPath, screenshotConfig.outputPath) : null;
			const scenarioDir = resolve(absOutputPath, key);
			const { success = true, stdout, stderr } = expected?.build ?? {};
			const { format, width, height, color } = expected?.image ?? {};

			describe(highlight`with ${key}`, () => {
				let build: BuildAsserter;
				let file: FileAsserter;
				let img: ImageAsserter;

				beforeAll(async () => {
					if (setup === TestSetup.Clean) {
						await cleanOutput(scenarioDir);
					}

					if (setup === TestSetup.Seed && outputPath) {
						await seedFile(outputPath);
					}

					const buildResult = await runAstroBuildWithScenario(key, fixture);

					build = new BuildAsserter(buildResult);

					if (success && outputPath) {
						file = new FileAsserter(outputPath);
						img = new ImageAsserter(outputPath);
					}
				});

				// Build outcome is always asserted
				it(`build ${success ? 'succeeds' : 'fails'}`, () => build.assertSuccess(success));

				if (stdout) {
					it(`stdout contains '${stdout}'`, () => build.assertStdoutContains(stdout));
				}

				if (stderr) {
					it(`stderr contains '${stderr}'`, () => build.assertStderrContains(stderr));
				}

				if (!success) return;

				if (!outputPath) {
					it('output directory is not created', () => new FileAsserter(scenarioDir).assertAbsent());

					return;
				}

				it('image exists and is non-empty', () => file.assertExists());

				if (format) {
					it(`image is a ${format}`, () => img.assertFormat(format));
				}

				if (width) {
					it(`image is ${width}px wide`, () => img.assertWidth(width));
				}

				if (height) {
					it(`image is ${height}px tall`, () => img.assertHeight(height));
				}

				if (color) {
					it(`image has correct dominant color (${JSON.stringify(color)})`, () => img.assertDominantColor(color));
				}
			});
		}
	});
}
