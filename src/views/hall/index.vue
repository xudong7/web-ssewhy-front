<template>
  <el-container class="homepage">
    <el-aside></el-aside>
    <!-- Main Content -->
    <el-main class="main-content">
      <div class="left-column">
        <div
            class="topic"
            v-for="topic in topics"
            :key="topic.id"
            @click="handleClick(topic.id)"
        >
          <div class="topic-header">
            <h2 class="topic-title">{{ topic.title }}</h2>
            <p class="topic-description">{{ topic.description }}</p>
          </div>
          <div class="topic-footer">
            <span>{{ topic.likes }} 赞同</span>
            <span>{{ topic.comments }} 评论</span>
            <span>分享</span>
            <span>收藏</span>
            <span>喜欢</span>
          </div>
        </div>
      </div>
    </el-main>
    <!-- Right Column -->
    <el-aside>
      <div class="right-column">
        <div class="recommended-follows">
          <h3>推荐关注</h3>
          <div class="user" v-for="user in recommendedUsers" :key="user.id">
            <img :src="user.avatar" alt="用户头像"/>
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <span class="user-description">{{ user.description }}</span>
              <button>关注</button>
            </div>
          </div>
        </div>
      </div>
    </el-aside>

  </el-container>
</template>

<script>
export default {
  data() {
    return {
      topics: [
        {
          id: 1,
          title: "如何评价vue作者尤雨溪？",
          description:
              "南方以南：有一次看他的直播片段，他去面试，被问到原型链，不会，面试挂了。",
          likes: 2367,
          comments: 233,
        },
        {
          id: 2,
          title: "数学系和计算机系学生编写代码的风格是否有差异？",
          description: "豫西：正好现身说法。我是计算机背景，组里另外一位是数学背景。",
          likes: 144,
          comments: 28,
        },
        {
          id: 3,
          title: "既然有些人喜欢开挂，为啥不开发一款网游？",
          description: "路：真有这种游戏啊，《Screeps》，允许玩家用各种软件。",
          likes: 14000,
          comments: 378,
        },
        {
          id: 4,
          title: "演员知道自己正在拍一部烂片吗？",
          description: "向导：你不知道自己写的毕业论文是垃圾吗？",
          likes: 0,
          comments: 0,
        },
      ],
      recommendedUsers: [
        {
          id: 1,
          avatar: "https://via.placeholder.com/40",
          username: "徐斌",
          description: "你关注的「寻尘客」也关注...",
        },
        {
          id: 2,
          avatar: "https://via.placeholder.com/40",
          username: "贾明子",
          description: "你关注的「自然科学」领域答主",
        },
        {
          id: 3,
          avatar: "https://via.placeholder.com/40",
          username: "rq cen",
          description: "你关注的「教育」领域答主",
        },
        {
          id: 4,
          avatar: "https://via.placeholder.com/40",
          username: "Azul",
          description: "",
        },
      ],
    };
  },
  methods: {
    handleClick(topicId) {
      // Navigate to the topic details page
      this.$router.push(`/topics/${topicId}`);
    },
  },
};
</script>

<style scoped>
/* General Styles */
.homepage {
  font-family: Arial, sans-serif;
  width: 80%;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  justify-content: center;
}

.nav span {
  margin-right: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 8px 12px;
  margin-left: 5px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-actions img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 15px;
}

/* Main Layout */
.main-content {
  display: flex;
  padding: 20px;
  background-color: #f9f9f9;
  justify-content: center;
  align-items: stretch; /* 添加这行让子元素等高 */
  width: 80%; /* 添加宽度，可根据实际需求调整 */
  margin: 0 auto; /* 使其在水平方向上居中 */
}

.left-column {
  flex: 3;
  margin-right: 20px;
  align-items: center; /* 让左列内部元素水平居中 */
}

.right-column {
  flex: 1;
}

.topic {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-left: 30%;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  width: 70%; /* 添加这行让话题元素占满左列宽度 */
  box-sizing: border-box; /* 确保内边距等不撑大元素宽度 */
}

.topic:hover {
  background-color: #f0f8ff;
}

.topic-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.topic-description {
  font-size: 16px;
  color: #555;
}

.topic-footer span {
  margin-right: 15px;
  font-size: 14px;
  color: #999;
}

/* Sidebar */
.card {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommended-follows.user {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.recommended-follows img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info button {
  background-color: #007aff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>