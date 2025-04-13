<template>
	<div class="article-container">
		<div class="article-content">
			<div
				v-if="article.cover"
				class="cover-container"
			>
				<img
					:src="article.cover"
					alt="cover"
					class="article-cover"
					@click="showImagePreview(article.cover)"
				/>
			</div>
			<h1 class="article-title">{{ article.title }}</h1>
			<div class="article-info">
				<el-avatar
					:src="author.avatar"
					@click="goToAuthor(author.id)"
					class="author-avatar"
					style="width: var(--spacing-lg); height: var(--spacing-lg)"
				/>
				<span
					class="author-name"
					@click="goToAuthor(author.id)"
					>作者：{{ author.username }}</span
				>
				<span class="create-time"
					>创建时间：{{ processDate(article.createTime) }}</span
				>
				<span class="update-time"
					>更新时间：{{ processDate(article.updateTime) }}</span
				>
			</div>
			<MarkdownContainer :rawContent="article.content" />
		</div>

		<!-- 图片预览组件 -->
		<el-image-viewer
			v-if="showViewer"
			:url-list="[previewUrl]"
			@close="closeViewer"
		/>

		<!-- 赞同按钮和收藏按钮 -->
		<div class="action-buttons">
			<div
				class="action-button"
				:class="{ active: article.isLiked }"
				@click="$emit('like')"
			>
				<el-icon class="action-icon like-icon"><Star /></el-icon>
				<span class="action-text">{{
					article.isLiked ? '已喜欢' : '喜欢'
				}}</span>
			</div>
			<div
				class="action-button"
				:class="{ active: article.isMarked }"
				@click="$emit('mark')"
			>
				<el-icon class="action-icon collect-icon"
					><Collection
				/></el-icon>
				<span class="action-text">{{
					article.isMarked ? '已收藏' : '收藏'
				}}</span>
			</div>
		</div>

		<!-- 返回顶部按钮 -->
		<el-backtop
			:right="40"
			:bottom="80"
			:visibility-height="300"
			class="back-to-top"
		>
			<div class="back-top-content">
				<el-icon><CaretTop /></el-icon>
				<span>顶部</span>
			</div>
		</el-backtop>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user.js';
import { Star, Collection, CaretTop } from '@element-plus/icons-vue';
import MarkdownContainer from './MarkdownContainer.vue';

defineEmits(['like', 'mark'])

const props = defineProps({
	article: {
		type: Object,
		required: true,
	},
});

const router = useRouter();

const showViewer = ref(false);
const previewUrl = ref('');
const author = ref({});
const userStore = useUserStore();

const goToAuthor = (authorId) => {
	if (authorId == userStore.userId) {
		router.push(`/home`);
	} else {
		router.push(`/user/${authorId}`);
	}
};

const processDate = (date) => {
	return new Date(date).toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
};

const showImagePreview = (url) => {
	previewUrl.value = url;
	showViewer.value = true;
};

const closeViewer = () => {
	showViewer.value = false;
};



onMounted(() => {
	window.previewImage = (url) => {
		showImagePreview(url);
	};
});

onUnmounted(() => {
	// 清理全局方法
	window.previewImage = null;
});
</script>

<style scoped>
.article-container {
	max-width: 100%;
	margin: var(--spacing-lg) auto;
	padding: var(--spacing-lg);
	background: var(--bg-primary);
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-sm);
	position: relative;
}

.article-content {
	padding: var(--spacing-lg);
	min-width: 0;
}

.cover-container {
	width: 100%;
	margin-bottom: var(--spacing-lg);
}

.author-avatar {
	cursor: pointer;
}

.author-avatar:hover {
	transform: scale(1.1);
}

.author-name {
	cursor: pointer;
}

.author-name:hover {
	color: var(--primary-color);
}

.article-cover {
	width: 100%;
	max-height: 400px;
	object-fit: cover;
	border-radius: var(--radius-md);
	display: block;
	cursor: pointer;
}

.article-title {
	font-size: 28px;
	font-weight: bold;
	color: var(--text-primary);
	margin-bottom: var(--spacing-lg);
}

.article-info {
	display: flex;
	gap: var(--spacing-lg);
	color: var(--text-secondary);
	font-size: 14px;
	margin-bottom: 30px;
}

.action-buttons {
	display: flex;
	align-items: center;
	gap: var(--spacing-lg);
	padding: 12px 20px;
	margin-top: 40px;
	border-top: 1px solid var(--border-light);
}

.action-button {
	display: flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	padding: 8px 12px;
	border-radius: var(--radius-sm);
	transition: var(--transition-all);
	color: var(--text-secondary);
	background: transparent;
}

.action-button:hover {
	background-color: var(--bg-hover);
	color: var(--text-primary);
}

.action-icon {
	font-size: 16px;
	transition: var(--transition-all);
}

.action-text {
	font-size: 14px;
	font-weight: 500;
}

.like-icon {
	color: inherit;
}

.collect-icon {
	color: inherit;
}

.action-button.active {
	color: var(--primary-color);
	background-color: var(--primary-bg);
}

.action-button.active:hover {
	background-color: var(--primary-hover);
	color: var(--primary-color);
}

.action-button.active .like-icon {
	color: var(--primary-color);
}

.action-button.active .collect-icon {
	color: var(--primary-color);
}

@media (max-width: 1650px) {

}

@media (max-width: 768px) {
	.article-info {
		flex-direction: column;
		align-items: flex-start;
	}

	.action-buttons {
		gap: var(--spacing-sm);
	}

	.back-to-top {
		display: none;
	}
}

@media (max-width: 480px) {
	.article-container {
		padding: var(--spacing-md);
	}

	.cover-container {
		margin-bottom: var(--spacing-sm);
	}

	.article-cover {
		max-height: 300px;
	}

	.action-buttons {
		gap: var(--spacing-xs);
	}

	.article-info {
		font-size: 12px;
		gap: var(--spacing-xs);
	}
}

.back-to-top {
	--el-backtop-bg-color: var(--bg-primary);
	--el-backtop-hover-bg-color: var(--bg-hover);
}

.back-top-content {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	color: var(--text-secondary);
}

.back-top-content .el-icon {
	font-size: 16px;
	margin-bottom: 2px;
}

:deep(.el-backtop) {
	width: 56px;
	height: 56px;
	box-shadow: var(--shadow-sm);
	transition: var(--transition-all);
}

:deep(.el-backtop:hover) {
	transform: translateY(-2px);
	box-shadow: var(--shadow-hover);
}
</style>
