<script setup>
import { marked } from 'marked';
import { onMounted, ref } from 'vue';

const props = defineProps({
	rawContent: {
		type: String,
		required: true,
	},
});

const activeHeading = ref('');

// const scrollToHeading = (id) => {
// 	const element = document.getElementById(id);
// 	if (element) {
// 		element.scrollIntoView({ behavior: 'smooth' });
// 		activeHeading.value = id;
// 	}
// };

const toc = ref([]);

const generateToc = (content) => {
	if (!content) return '';
	// 先将markdown转换为HTML
	const htmlContent = marked(content);
	const headings = htmlContent.match(/<h([1-6])(.*?)>(.*?)<\/h\1>/g) || [];

	headings.forEach((heading) => {
		const level = heading.match(/<h([1-6])/)[1];
		const text = heading.replace(/<[^>]+>/g, '');
		const id = text.toLowerCase().replace(/\s+/g, '-');

		console.log(id, text, level);
		toc.value.push({ id, level });
	});
};

onMounted(() => {
	generateToc(props.rawContent);
});
</script>

<template>
	<div class="toc-container">
		<div class="toc-title">
			<i class="el-icon-menu"></i>
			目录
		</div>
		<div class="toc-content">
			<div
				v-for="item in toc"
				:class="`toc-item ${activeHeading === item.id ? 'active' : ''}`"
				:style="{ paddingLeft: `${(item.level - 1) * 20}px` }"
			>
				<a :href="`#${item.id}`">
					<span class="toc-dot"></span>
					{{ item.id }}
				</a>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.toc-container {
	position: fixed;
	right: 5%;
	top: 12vh;
	width: 200px;
	max-height: 80vh;
	overflow-y: auto;
	background: var(--bg-primary);
	padding: var(--spacing-lg) var(--spacing-md);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-md);
	transition: var(--transition-all);
	z-index: 10;
}

@media (max-width: 1650px) {
	.toc-container {
		display: none;
	}
}

@media (max-width: 480px) {
	.toc-container {
		width: 160px;
		top: 8vh;
	}
}

.toc-title {
	font-size: 22px;
	font-weight: 700;
	margin-bottom: var(--spacing-lg);
	padding-bottom: 14px;
	border-bottom: 3px solid var(--border-light);
	color: var(--text-primary);
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
}

.toc-title i {
	font-size: 24px;
	color: var(--primary-color);
}

.toc-content {
	font-size: 16px;
	line-height: 1.6;
	color: var(--text-secondary);
	letter-spacing: 0.5px;
	text-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.1);
}

.toc-item {
	margin: var(--spacing-xs) 0;
	position: relative;
}

.toc-item a {
	color: var(--text-secondary);
	text-decoration: none;
	display: flex;
	align-items: center;
	padding: 10px 0;
	font-size: 16px;
	transition: var(--transition-all);
	border-left: 3px solid transparent;
	font-family: 'Arial', sans-serif;
	font-weight: 500;
}

.toc-item a:hover {
	color: var(--primary-color);
	padding-left: 10px;
	border-left-color: var(--primary-color);
	font-weight: 600;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toc-item a:hover .toc-dot {
	background: var(--primary-color);
	transform: scale(1.4);
}

.toc-item.active a {
	color: var(--primary-color);
	font-weight: 600;
}

.toc-item.active .toc-dot {
	background: var(--primary-color);
	transform: scale(1.4);
}

.toc-dot {
	width: 8px;
	height: 8px;
	background: var(--text-tertiary);
	border-radius: 50%;
	margin-right: var(--spacing-sm);
	transition: var(--transition-all);
}
</style>
