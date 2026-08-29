/**
 * Unified Astro config for all integration tests.
 *
 * The active scenario is selected via the `SCENARIO` environment variable.
 *
 * The 'shared' scenario runs the full shared build used by shared.test.ts.
 * All other scenarios are derived from the isolated test case files and run
 * isolated builds for isolated.test.ts.
 *
 * @module
 */
import { defineConfig } from 'astro/config';
import process from 'node:process';
import type { Config } from '../../packages/astro-snapshot/src/index.ts';
import snapshot from '../../packages/astro-snapshot/src/index.ts';
import type { IsolatedTestCase, TestCase } from '../types.ts';
import { ISOLATED_TEST_CASE_MAP } from '../test-cases/isolated/index.ts';
import { SHARED_TEST_CASE_MAP } from '../test-cases/shared/index.ts';

type SnapshotConfig = Parameters<typeof snapshot>[0];

/**
 * Builds the `pages` map for the shared scenario by grouping all shared test
 * cases by their page route.
 *
 * @param testCases - All shared test case definitions.
 */
function buildSharedPages(testCases: Record<string, TestCase>): Config['pages'] {
	const pages: Config['pages'] = {};

	for (const { page, screenshotConfig } of Object.values(testCases)) {
		(pages[page] ??= []).push(screenshotConfig);
	}

	return pages;
}

/**
 * Builds a single-entry `pages` map for an isolated test case, or an empty
 * map if the test case has no page or screenshotConfig.
 *
 * @param testCase - The isolated test case to build the pages map from.
 */
function buildIsolatedPages(testCase: IsolatedTestCase): Config['pages'] {
	const { page, screenshotConfig } = testCase;

	if (!page || !screenshotConfig) return {};

	return {
		[page]: [screenshotConfig],
	};
}

/**
 * Builds the full scenarios map from the shared and isolated test cases.
 * Each key is a valid SCENARIO env var value.
 *
 * @param sharedTestCases - All shared test case definitions.
 * @param isolatedTestCases - All isolated test case definitions.
 */
function buildScenarios(
	sharedTestCases: Record<string, TestCase>,
	isolatedTestCases: Record<string, IsolatedTestCase>,
): Record<string, SnapshotConfig> {
	const scenarios: Record<string, SnapshotConfig> = {
		shared: {
			pages: buildSharedPages(sharedTestCases),
		},
	};

	for (const [key, testCase] of Object.entries(isolatedTestCases)) {
		scenarios[key] = {
			...testCase.integrationConfig,
			pages: buildIsolatedPages(testCase),
		};
	}

	return scenarios;
}

/**
 * Resolves and validates the active scenario from the SCENARIO environment
 * variable, throwing a descriptive error if it is missing or unrecognized.
 *
 * @param scenarios - The full map of scenario keys to integration configs.
 */
function resolveScenario(scenarios: Record<string, SnapshotConfig>): SnapshotConfig {
	const scenario = process.env.SCENARIO;

	if (!scenario || !(scenario in scenarios)) {
		const valid = Object.keys(scenarios).join(', ');

		throw new Error(`Unknown or missing SCENARIO: '${scenario}'. Valid values: ${valid}`);
	}

	return scenarios[scenario];
}

const SCENARIOS = buildScenarios(SHARED_TEST_CASE_MAP, ISOLATED_TEST_CASE_MAP);

// https://astro.build/config
export default defineConfig({
	integrations: [
		snapshot(resolveScenario(SCENARIOS)),
	],
});
