<script setup>
import { computed, nextTick } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';

const props = defineProps({
	rawContent: {
		type: String,
		default: '',
	},
});

const addHeadingIds = (content) => {
	return content.replace(
		/<h([1-6])(.*?)>(.*?)<\/h\1>/g,
		(match, level, attrs, text) => {
			const id = text.toLowerCase().replace(/\s+/g, '-');
			return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
		}
	);
};

const processContent = (content) => {
	if (!content) return '';

	// 配置 marked 选项
	marked.setOptions({
		highlight: function (code, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(code, { language: lang }).value;
				} catch (err) {
					console.error(err);
				}
			}
			return hljs.highlightAuto(code).value;
		},
		breaks: true,
		gfm: true,
	});

	// 转换 Markdown 为 HTML
	let htmlContent = marked(content);
	// 为标题添加id
	htmlContent = addHeadingIds(htmlContent);
	// 将图片标签替换为带有div包裹的形式,并添加点击事件
	nextTick(()=>{
		hljs.highlightAll();
	})
	return htmlContent.replace(
		/<img(.*?)src="(.*?)"(.*?)>/g,
		'<div class="image-wrapper"><img$1src="$2"$3 onclick="window.previewImage(\'$2\')"></div>'
	);
};

const markdownContent = computed(() => {
	return processContent(props.rawContent);
});
</script>

<template>
	<div
		class="article-body markdown-body"
		v-html="markdownContent"
	></div>
</template>

<style scoped lang="scss">
.article-body {
	font-size: 16px;
	line-height: 1.8;
	color: var(--text-primary);
	white-space: pre-wrap;
	word-wrap: break-word;
}

.article-body :deep(.image-wrapper) {
	margin: var(--spacing-lg) 0;
	text-align: center;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
}

.article-body :deep(.image-wrapper img) {
	width: 100%;
	height: auto;
	border-radius: var(--radius-md);
	display: block;
	cursor: pointer;
}

@media (max-width: 480px) {
	.article-body {
		font-size: 12px;
	}
}

@media (max-width: 768px) {
	.article-body {
		font-size: 14px;
	}
}
/* Markdown 样式 */
.markdown-body pre {
	background-color: var(--bg-primary);
	border-radius: 6px;
	padding: 16px;
	overflow: auto;
	margin: 16px 0;
	position: relative;
}

.markdown-body pre code {
	display: block;
	padding: 16px;
	font-family: Consolas, 'Liberation Mono', Monaco, 'Courier New', monospace;
	font-size: 13px;
	line-height: 1.5;
	color: var(--text-primary);
	background: none;
	border-radius: 0;
	overflow-x: auto;
	letter-spacing: 0;
	font-weight: normal;
}

/* 内联代码样式 */
.markdown-body code:not(pre code) {
	padding: 2px 6px;
	margin: 0 2px;
	font-size: 0.9em;
	font-family: Consolas, 'Liberation Mono', Monaco, 'Courier New', monospace;
	background-color: var(--bg-tertiary);
	border-radius: 4px;
	color: var(--primary-color);
}

/* 优化滚动条样式 */
.markdown-body pre code::-webkit-scrollbar {
	height: 6px;
}

.markdown-body pre code::-webkit-scrollbar-thumb {
	background: var(--bg-tertiary);
	border-radius: 3px;
}

.markdown-body pre code::-webkit-scrollbar-track {
	background: transparent;
}

/* 其他 Markdown 样式 */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
	margin-top: 24px;
	margin-bottom: 16px;
	font-weight: 600;
	line-height: 1.25;
}

.markdown-body h1,
.markdown-body h2 {
	padding-bottom: 0.3em;
	border-bottom: 1px solid var(--border-color);
}

.markdown-body img {
	max-width: 100%;
	height: auto;
	display: block;
	margin: 16px auto;
	border-radius: 8px;
}

.markdown-body blockquote {
	padding: 0 1em;
	color: var(--text-secondary);
	border-left: 0.25em solid var(--border-color);
	margin: 16px 0;
}

.markdown-body ul,
.markdown-body ol {
	padding-left: 2em;
	margin: 16px 0;
}

.markdown-body table {
	display: block;
	width: 100%;
	overflow: auto;
	margin: 16px 0;
	border-spacing: 0;
	border-collapse: collapse;
}

.markdown-body table th,
.markdown-body table td {
	padding: 6px 13px;
	border: 1px solid var(--border-color);
}

.markdown-body table tr {
	background-color: var(--bg-primary);
	border-top: 1px solid var(--border-color);
}

.markdown-body table tr:nth-child(2n) {
	background-color: var(--bg-secondary);
}
</style>
