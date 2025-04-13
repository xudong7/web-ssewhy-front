<template>
	<template v-if="isLoading">
		<p>加载中...</p>
	</template>
	<template v-else>
		<div class="detail-page">
			<ArticleComponent
				:article="article"
				@like="listenLike"
				@mark="listenMark"
			/>
			<CommentComponent />
			<toc-menu :rawContent="article.content" />
		</div>
	</template>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { getArticleById, handleLike } from '@/api/article.js';
import { getUserInfoById, handleCollection } from '@/api/user.js';

import { useUserStore } from '@/store/modules/user.js';

const TocMenu = defineAsyncComponent(() => import('@/components/TocMenu.vue'));

const ArticleComponent = defineAsyncComponent(
	() => import('@/components/ArticleComponent.vue')
);
const CommentComponent = defineAsyncComponent(
	() => import('@/components/CommentComponent.vue')
);

const userStore = useUserStore();

const route = useRoute();
const isLoading = ref(false); // 用于控制加载状态

const articleId = route.params.articleId; // 获取路由参数中的文章ID
const article = ref({}); // 文章数据

const getArticle = async () => {
	isLoading.value = true; // 开始加载状态
	try {
		const res = await getArticleById(articleId);
		// 筛选status为1的文章
		article.value = res.data.data;
		article.value.isLiked =
			article.value.likesCart &&
			article.value.likesCart.includes(`,${this.userStore.userId},`);
		article.value.isMarked =
			user.markCart && user.markCart.includes(`,${this.article.id},`);
	} catch (error) {
		console.error('获取文章失败:', error);
	} finally {
		isLoading.value = false; // 无论成功与否都结束加载状态
	}
};

const listenLike = async () => {
	const userId = userStore.userId;
	const res = await handleLike(articleId, userId);
	if (res.data.data) {
		article.value.isLiked = true;
		ElMessage.success('点赞成功');
	} else {
		article.value.isLiked = false;
		ElMessage.success('取消点赞');
	}
};

const listenMark = async () => {
	const userId = userStore.userId;
	const res = await handleCollection(userId, articleId);
	if (res.data.data) {
		article.value.isMarked = true;
		ElMessage.success('收藏成功');
	} else {
		article.value.isMarked = false;
		ElMessage.success('取消收藏');
	}
};

onMounted(() => {
	console.log('Article ID:', articleId);
	getArticle(); // 组件挂载时获取文章
});
</script>

<style scoped>
.detail-page {
	max-width: 1000px;
	width: 100%;
	margin: 0 auto;
	padding: 20px;
	background-color: var(--bg-secondary);
	min-height: calc(100vh - 52px);
}

.detail-container {
	background-color: var(--bg-secondary);
}

@media screen and (max-width: 768px) {
	.detail-page {
		padding: 0;
		margin: 0;
		width: 100%;
		max-width: 100%;
		overflow-x: hidden; /* 防止水平滚动 */
	}
}

@media screen and (max-width: 480px) {
	.detail-page {
		padding: 0;
	}
}
</style>
