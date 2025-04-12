<template>
  <div class="code-editor-page">
    <!-- 题目列表侧边栏 -->
    <div class="problem-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h3>题目列表</h3>
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目"
          prefix-icon="el-icon-search"
          clearable
          size="small"
        />
        <div class="filter-options">
          <el-select
            v-model="difficultyFilter"
            placeholder="难度"
            size="small"
            style="width: 100%"
          >
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </div>
      </div>
      <div class="problem-list">
        <div
          v-for="prob in filteredProblems"
          :key="prob.id"
          class="problem-item"
          :class="{ active: prob.id === problem.id }"
          @click="selectProblem(prob.id)"
        >
          <div class="problem-item-id">{{ prob.id }}</div>
          <div class="problem-item-title">{{ prob.title }}</div>
          <div
            class="problem-item-difficulty"
            :class="getDifficultyClass(prob.difficulty)"
          >
            {{ prob.difficulty }}
          </div>
        </div>
      </div>
    </div>

    <!-- 切换按钮 -->
    <div
      class="sidebar-toggle"
      @click="toggleSidebar"
      :class="{ 'sidebar-open': !sidebarCollapsed }"
    >
      <el-icon size="20">
        <ArrowLeft v-if="!sidebarCollapsed" />
        <ArrowRight v-else />
      </el-icon>
    </div>

    <!-- 主内容区 -->
    <div
      class="code-editor-container"
      :class="{ 'with-sidebar': !sidebarCollapsed }"
    >
      <div class="problem-description">
        <div class="problem-header">
          <h2 class="problem-title">{{ problem.title }}</h2>
          <div class="problem-difficulty" :class="difficultyClass">
            {{ problem.difficulty }}
          </div>
        </div>
        <div class="problem-content" v-html="problem.description"></div>
        <div class="problem-examples">
          <div
            v-for="(example, index) in problem.examples"
            :key="index"
            class="example"
          >
            <div class="example-header">示例 {{ index + 1 }}:</div>
            <div class="example-content">
              <div><strong>输入:</strong> {{ example.input }}</div>
              <div><strong>输出:</strong> {{ example.output }}</div>
              <div v-if="example.explanation">
                <strong>解释:</strong> {{ example.explanation }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="problem.constraints" class="problem-constraints">
          <div class="constraints-header">提示:</div>
          <ul>
            <li v-for="(constraint, index) in problem.constraints" :key="index">
              {{ constraint }}
            </li>
          </ul>
        </div>
      </div>

      <div class="editor-container">
        <div class="editor-header">
          <div class="language-selector">
            <el-select
              v-model="selectedLanguage"
              placeholder="选择编程语言"
              size="small"
            >
              <el-option
                v-for="lang in languages"
                :key="lang.id"
                :label="lang.name"
                :value="lang.id"
              ></el-option>
            </el-select>
          </div>
          <div class="editor-actions">
            <el-button type="primary" @click="runCode" size="small"
              >运行代码</el-button
            >
            <el-button type="success" @click="submitCode" size="small"
              >提交</el-button
            >
          </div>
        </div>
        <div
          ref="monacoEditorContainer"
          class="monaco-editor-container"
          :class="{ expanded: resultCollapsed }"
        ></div>

        <!-- 结果区域切换按钮 -->
        <div class="result-toggle" @click="toggleResult">
          <el-icon size="16">
            <ArrowUp v-if="resultCollapsed" />
            <ArrowDown v-else />
          </el-icon>
          <!-- <span>{{ resultCollapsed ? "显示结果" : "隐藏结果" }}</span> -->
        </div>

        <div
          v-if="showResult"
          class="result-container"
          :class="{ collapsed: resultCollapsed }"
        >
          <div class="result-header">
            执行结果:
            <span
              :class="{
                success: testResult.status === 'success',
                error: testResult.status === 'error',
              }"
            >
              {{ testResult.status === "success" ? "通过" : "失败" }}
            </span>
          </div>
          <div v-if="testResult.output" class="result-output">
            <div>输出:</div>
            <pre>{{ testResult.output }}</pre>
          </div>
          <div v-if="testResult.expected" class="result-expected">
            <div>预期:</div>
            <pre>{{ testResult.expected }}</pre>
          </div>
          <div v-if="testResult.error" class="result-error">
            <div>错误:</div>
            <pre>{{ testResult.error }}</pre>
          </div>
          <div v-if="testResult.runtime" class="result-stats">
            <div>运行时间: {{ testResult.runtime }}ms</div>
            <div>内存消耗: {{ testResult.memory }}MB</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  reactive,
  computed,
  watch,
} from "vue";
import * as monaco from "monaco-editor";
import "@vscode/codicons/dist/codicon.css";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "@element-plus/icons-vue";

// 编辑器实例
let editor = null;

// DOM引用
const monacoEditorContainer = ref(null);

// 侧边栏状态
const sidebarCollapsed = ref(false);
const searchQuery = ref("");
const difficultyFilter = ref("");

// 结果区域状态
const resultCollapsed = ref(true);

// 当前选中的语言
const selectedLanguage = ref("javascript");

// 编程语言列表
const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
];

// 默认代码模板
const codeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // 请在这里编写你的代码
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # 请在这里编写你的代码
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 请在这里编写你的代码
        return null;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // 请在这里编写你的代码
        return {};
    }
};`,
};

// 模拟题库数据
const problemList = reactive([
  {
    id: 1,
    title: "两数之和",
    difficulty: "简单",
    description: `<p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值</strong> <code>target</code> 的那 <strong>两个</strong> 整数，并返回它们的数组下标。</p>
<p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>
<p>你可以按任意顺序返回答案。</p>`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "因为 nums[0] + nums[1] == 9 ，返回 [0, 1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "只会存在一个有效答案",
    ],
  },
  {
    id: 2,
    title: "无重复字符的最长子串",
    difficulty: "中等",
    description: `<p>给定一个字符串 <code>s</code> ，请你找出其中不含有重复字符的 <strong>最长子串</strong> 的长度。</p>`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: '因为无重复字符的最长子串是 "abc"，所以其长度为 3。',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: '因为无重复字符的最长子串是 "b"，所以其长度为 1。',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation:
          '因为无重复字符的最长子串是 "wke"，所以其长度为 3。请注意，你的答案必须是子串的长度，"pwke" 是一个子序列，不是子串。',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s 由英文字母、数字、符号和空格组成",
    ],
  },
  {
    id: 3,
    title: "寻找两个正序数组的中位数",
    difficulty: "困难",
    description: `<p>给定两个大小分别为 <code>m</code> 和 <code>n</code> 的正序（从小到大）数组 <code>nums1</code> 和 <code>nums2</code>。请你找出并返回这两个正序数组的 <strong>中位数</strong> 。</p>
<p>算法的时间复杂度应该为 <code>O(log (m+n))</code> 。</p>`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "合并数组 = [1,2,3] ，中位数 2",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
  },
  {
    id: 4,
    title: "回文数",
    difficulty: "简单",
    description: `<p>给你一个整数 <code>x</code> ，如果 <code>x</code> 是一个回文整数，返回 <code>true</code> ；否则，返回 <code>false</code> 。</p>
<p>回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。</p>
<ul>
<li>例如，<code>121</code> 是回文，而 <code>123</code> 不是。</li>
</ul>`,
    examples: [
      {
        input: "x = 121",
        output: "true",
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "从右向左读, 为 01 。因此它不是一个回文数。",
      },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
  },
  {
    id: 5,
    title: "合并两个有序链表",
    difficulty: "简单",
    description: `<p>将两个升序链表合并为一个新的 <strong>升序</strong> 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。</p>`,
    examples: [
      {
        input: "l1 = [1,2,4], l2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      {
        input: "l1 = [], l2 = []",
        output: "[]",
      },
      {
        input: "l1 = [], l2 = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "两个链表的节点数目范围是 [0, 50]",
      "-100 <= Node.val <= 100",
      "l1 和 l2 均按 非递减顺序 排列",
    ],
  },
]);

// 当前选中的题目
const problem = reactive({
  id: 1,
  title: "两数之和",
  difficulty: "简单",
  description: `<p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值</strong> <code>target</code> 的那 <strong>两个</strong> 整数，并返回它们的数组下标。</p>
<p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>
<p>你可以按任意顺序返回答案。</p>`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "因为 nums[0] + nums[1] == 9 ，返回 [0, 1]",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "只会存在一个有效答案",
  ],
});

// 执行结果
const showResult = ref(false);
const testResult = reactive({
  status: "",
  output: "",
  expected: "",
  error: "",
  runtime: 0,
  memory: 0,
});

// 过滤题目列表
const filteredProblems = computed(() => {
  return problemList.filter((prob) => {
    // 标题搜索
    const matchesTitle = prob.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // 难度过滤
    const matchesDifficulty = difficultyFilter.value
      ? prob.difficulty === difficultyFilter.value
      : true;

    return matchesTitle && matchesDifficulty;
  });
});

// 根据难度返回对应的CSS类
const difficultyClass = computed(() => {
  return getDifficultyClass(problem.difficulty);
});

// 难度对应的类名
const getDifficultyClass = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "简单":
      return "easy";
    case "中等":
      return "medium";
    case "困难":
      return "hard";
    default:
      return "";
  }
};

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

// 切换结果区域
const toggleResult = () => {
  resultCollapsed.value = !resultCollapsed.value;
};

// 选择题目
const selectProblem = (problemId) => {
  const selectedProblem = problemList.find((p) => p.id === problemId);
  if (selectedProblem) {
    // 更新当前题目
    Object.assign(problem, selectedProblem);
    // 重置执行结果
    showResult.value = false;
    // 根据题目更新代码模板（实际中可能需要从服务器获取题目对应的模板）
    if (editor) {
      editor.setValue(codeTemplates[selectedLanguage.value]);
    }
  }
};

// 初始化Monaco编辑器
const initEditor = () => {
  if (monacoEditorContainer.value) {
    editor = monaco.editor.create(monacoEditorContainer.value, {
      value: codeTemplates[selectedLanguage.value],
      language: selectedLanguage.value,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: true },
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      fontSize: 14,
    });
  }
};

// 销毁编辑器
const disposeEditor = () => {
  if (editor) {
    editor.dispose();
    editor = null;
  }
};

// 当语言改变时，更新编辑器内容和语言
watch(selectedLanguage, (newLang) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newLang);
    editor.setValue(codeTemplates[newLang]);
  }
});

// 运行代码
const runCode = () => {
  const code = editor.getValue();
  resultCollapsed.value = false;
  showResult.value = true;

  // 模拟代码运行结果
  // 实际项目中，这里应该是发送请求到后端API执行代码
  setTimeout(() => {
    testResult.status = Math.random() > 0.3 ? "success" : "error";
    testResult.output = "[0, 1]";
    testResult.expected = "[0, 1]";
    testResult.runtime = Math.floor(Math.random() * 100);
    testResult.memory = (Math.random() * 40 + 30).toFixed(1);

    if (testResult.status === "error") {
      testResult.error = "执行超时或输出结果不符合预期";
    } else {
      testResult.error = "";
    }
  }, 1000);
};

// 提交代码
const submitCode = () => {
  const code = editor.getValue();
  showResult.value = true;

  // 模拟提交结果
  // 实际项目中，这里应该是发送请求到后端API提交代码
  setTimeout(() => {
    testResult.status = "success";
    testResult.output = "[0, 1]";
    testResult.expected = "[0, 1]";
    testResult.runtime = Math.floor(Math.random() * 100);
    testResult.memory = (Math.random() * 40 + 30).toFixed(1);
    testResult.error = "";
  }, 1000);
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  disposeEditor();
});
</script>

<style scoped>
.code-editor-page {
  display: flex;
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: var(--bg-secondary);
}

/* 题目列表侧边栏 */
.problem-sidebar {
  position: absolute;
  width: 300px;
  height: 100%;
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-md);
  z-index: 99;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.problem-sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.filter-options {
  margin-top: 10px;
}

.problem-list {
  height: calc(100% - 140px);
  overflow-y: auto;
}

.problem-item {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
}

.problem-item:hover {
  background-color: var(--bg-hover);
}

.problem-item.active {
  background-color: var(--primary-light);
  border-right: 3px solid var(--primary-color);
}

.problem-item-id {
  width: 30px;
  font-weight: bold;
  color: var(--text-secondary);
}

.problem-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}

.problem-item-difficulty {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
  color: white;
}

.problem-item-difficulty.easy {
  background-color: var(--success-color);
}

.problem-item-difficulty.medium {
  background-color: var(--warning-color);
}

.problem-item-difficulty.hard {
  background-color: var(--error-color);
}

/* 侧边栏切换按钮 */
.sidebar-toggle {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: var(--bg-primary);
  width: 24px;
  height: 60px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 99;
  transition: left 0.3s ease;
  color: var(--text-primary);
}

.sidebar-toggle.sidebar-open {
  left: 300px;
}

/* 主内容区 */
.code-editor-container {
  display: flex;
  flex: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
  margin-left: 0;
}

.code-editor-container.with-sidebar {
  margin-left: 300px;
  width: calc(100% - 300px);
}

.problem-description {
  flex: 0 0 40%;
  overflow-y: auto;
  padding: 20px;
  border-right: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

@media (max-width: 1200px) {
  .problem-description {
    flex: 0 0 50%;
  }
}

.problem-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.problem-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-primary);
}

.problem-difficulty {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: bold;
}

.problem-difficulty.easy {
  background-color: var(--success-color);
  color: white;
}

.problem-difficulty.medium {
  background-color: var(--warning-color);
  color: white;
}

.problem-difficulty.hard {
  background-color: var(--error-color);
  color: white;
}

.problem-content {
  margin-bottom: 20px;
  line-height: 1.6;
  color: var(--text-primary);
}

.problem-content :deep(p),
.problem-content :deep(li),
.problem-content :deep(ul) {
  color: var(--text-primary);
}

.problem-content :deep(code) {
  background-color: var(--bg-tertiary);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  color: var(--primary-color);
}

.problem-examples {
  margin-bottom: 20px;
}

.example {
  margin-bottom: 15px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 12px;
}

.example-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.example-content {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  line-height: 1.5;
  color: var(--text-primary);
}

.problem-constraints {
  background-color: var(--primary-bg);
  border-radius: var(--radius-sm);
  padding: 12px;
}

.constraints-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.problem-constraints ul li {
  color: var(--text-primary);
}

.editor-container {
  flex: 1;
  display: flex;
  margin-left: auto;
  max-width: 57%;
  flex-direction: column;
  background-color: var(--bg-tertiary);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.monaco-editor-container {
  flex: 1;
  width: 100%;
  max-height: 55%;
  transition: max-height 0.3s ease;
}

.monaco-editor-container.expanded {
  max-height: calc(100% - 50px);
}

.result-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background-color: var(--bg-primary);
  cursor: pointer;
  color: var(--text-primary);
  border-top: 1px solid var(--border-dark);
  transition: background-color 0.2s ease;
  user-select: none;
}

.result-toggle:hover {
  background-color: var(--bg-hover);
}

.result-container {
  background-color: var(--bg-disabled);
  color: var(--text-primary);
  padding: 10px 15px;
  height: 100%;
  overflow-y: auto;
  border-top: 1px solid var(--border-dark);
}

.result-container.collapsed {
  display: none;
}

.result-header {
  margin-bottom: 10px;
  font-weight: bold;
}

.success {
  color: var(--success-color);
}

.error {
  color: var(--error-color);
}

.result-output,
.result-expected,
.result-error {
  margin-bottom: 10px;
}

.result-output pre,
.result-expected pre,
.result-error pre {
  background-color: var(--bg-secondary);
  padding: 5px;
  border-radius: var(--radius-sm);
  margin: 5px 0;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  white-space: pre-wrap;
  color: var(--text-primary);
}

.result-stats {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: var(--text-tertiary);
}
</style>