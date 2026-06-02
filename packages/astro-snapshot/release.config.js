/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ['main'],
	repositoryUrl: 'https://github.com/caret-collective/astro-snapshot',
	tagFormat: 'v${version}',
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
			},
		],
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'conventionalcommits',
			},
		],
		[
			'@semantic-release/exec',
			{
				prepareCmd: 'deno task version ${nextRelease.version}',
				// For some reason, `npm publish` fails when run from a Deno task with an ENEEDAUTH error, so we have to run it separately here
				publishCmd: '(deno task build:npm && (cd npm && npm publish)); (deno task publish:jsr)',
			},
		],
		[
			'@semantic-release/git',
			{
				assets: ['deno.json'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		'@semantic-release/github',
	],
};
