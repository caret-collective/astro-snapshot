import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightChangelogs, { makeChangelogsSidebarLinks } from 'starlight-changelogs';
import starlightContextualMenu from 'starlight-contextual-menu';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightMarkdown from 'starlight-markdown';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightThemeNova from 'starlight-theme-nova';
import starlightTypedoc from 'starlight-typedoc';
import snapshot from '../../packages/astro-snapshot/src/index.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-snapshot.johng.io',
	integrations: [
		snapshot({
			pages: {
				'/resources/demo': [
					{
						outputPath: `src/assets/demo.png`,
						width: 1280,
						height: 720,
						overwrite: false,
					},
				],
				'https://johng.io/funding': [
					{
						outputPath: `src/assets/demo-external.png`,
						width: 1280,
						height: 720,
						overwrite: false,
					},
				],
			},
		}),
		starlight({
			title: 'Astro Snapshot',
			// This has to be relative to the public/ dir :(
			favicon: '/icon.svg',
			logo: {
				src: '../icon.svg',
			},
			lastUpdated: true,
			credits: true,
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/caret-collective/astro-snapshot',
				},
				{
					icon: 'jsr',
					label: 'JSR',
					href: 'https://jsr.io/@twocaretcat/astro-snapshot',
				},
				{
					icon: 'npm',
					label: 'npm',
					href: 'https://www.npmjs.com/package/@twocaretcat/astro-snapshot',
				},
			],
			components: {
				Footer: './src/components/Footer.astro',
			},
			plugins: [
				starlightTypedoc({
					entryPoints: ['../../packages/astro-snapshot/src/index.ts'],
					tsconfig: '../../packages/astro-snapshot/tsconfig.json',
					output: 'api-reference',
					typeDoc: {
						name: 'astro-snapshot',
						plugin: [
							'typedoc-plugin-rename-defaults',
							'typedoc-plugin-frontmatter',
							'./src/plugins/frontmatter.ts',
						],
					},
				}),
				starlightChangelogs(),
				starlightMarkdown(),
				starlightThemeNova(),
				starlightLlmsTxt(),
				starlightContextualMenu({
					actions: ['copy', 'view', 'chatgpt', 'claude'],
					injectMarkdownRoutes: false,
				}),
				starlightSidebarTopics([
					{
						label: 'Guide',
						link: '/guide/getting-started/installation',
						icon: 'open-book',
						// It would be epic if we could generate this recursively, but when we do this, lowercase folder names are used
						// We could use `starlight-auto-sidebar` to rename sidebar groups, but this seems to be incompatible with `starlight-sidebar-topics` :(
						items: [
							{
								label: 'Guide',
								items: [
									{
										label: 'Getting Started',
										autogenerate: {
											directory: 'guide/getting-started',
										},
									},
									{
										label: 'Recipes',
										autogenerate: {
											directory: 'guide/recipes',
										},
									},
									{
										label: 'Troubleshooting',
										slug: 'guide/troubleshooting',
									},
									{
										label: 'How it Works',
										slug: 'guide/how-it-works',
									},
								],
							},
						],
					},
					{
						id: 'api-reference',
						label: 'API Reference',
						link: '/api-reference/readme',
						icon: 'seti:json',
						// Sidebar groups are lowercase. Ideally we would use `typeDocSidebarGroup` from `starlight-typedoc` here, but it seems to be incompatible with `starlight-sidebar-topics` :(
						items: [
							{
								label: 'API Reference',
								autogenerate: {
									directory: 'api-reference',
								},
							},
						],
					},
					{
						id: 'changelog',
						label: 'Changelog',
						link: '/changelog',
						icon: 'list-format',
						items: [
							{
								label: 'Changelog',
								items: [
									...makeChangelogsSidebarLinks([
										{
											type: 'all',
											base: 'changelog',
											label: 'Overview',
										},
									]),
									{
										label: 'Versions',
										items: [
											...makeChangelogsSidebarLinks([
												{
													type: 'recent',
													base: 'changelog',
													count: 10,
												},
											]),
										],
									},
								],
							},
						],
					},
					{
						label: 'Resources',
						link: '/resources/demo',
						icon: 'seti:svg',
						items: [
							{
								label: 'Resources',
								autogenerate: {
									directory: 'resources',
								},
							},
						],
					},
				], {
					topics: {
						changelog: ['/changelog/**/*'],
						'api-reference': ['/api-reference/**/*'],
					},
				}),
				starlightLinksValidator({
					exclude: [
						'/changelog{,/**/*}',
					],
				}),
			],
			customCss: [
				'@fontsource/dela-gothic-one',
				'./src/styles/global.css',
			],
			editLink: {
				baseUrl: 'https://github.com/caret-collective/astro-snapshot/edit/main/docs/site',
			},
		}),
	],
});
