<template>
  <div class="code-editor-container">
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
      <div ref="monacoEditorContainer" class="monaco-editor-container"></div>
      <div v-if="showResult" class="result-container">
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

// 编辑器实例
let editor = null;

// DOM引用
const monacoEditorContainer = ref(null);

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

// 示例题目数据
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

// 根据难度返回对应的CSS类
const difficultyClass = computed(() => {
  switch (problem.difficulty.toLowerCase()) {
    case "简单":
      return "easy";
    case "中等":
      return "medium";
    case "困难":
      return "hard";
    default:
      return "";
  }
});

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
.code-editor-container {
  display: flex;
  height: calc(100vh - 100px);
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.problem-description {
  flex: 0 0 40%;
  overflow-y: auto;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.problem-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.problem-title {
  margin: 0;
  font-size: 1.6rem;
}

.problem-difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.problem-difficulty.easy {
  background-color: #00af9b;
  color: white;
}

.problem-difficulty.medium {
  background-color: #ffb800;
  color: white;
}

.problem-difficulty.hard {
  background-color: #ff2d55;
  color: white;
}

.problem-content {
  margin-bottom: 20px;
  line-height: 1.6;
}

.problem-examples {
  margin-bottom: 20px;
}

.example {
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
}

.example-header {
  font-weight: bold;
  margin-bottom: 8px;
}

.example-content {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  line-height: 1.5;
}

.problem-constraints {
  background-color: #f0f7ff;
  border-radius: 4px;
  padding: 12px;
}

.constraints-header {
  font-weight: bold;
  margin-bottom: 8px;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #333333;
  color: white;
}

.monaco-editor-container {
  flex: 1;
  width: 100%;
}

.result-container {
  background-color: #282828;
  color: white;
  padding: 10px 15px;
  height: 150px;
  overflow-y: auto;
  border-top: 1px solid #444;
}

.result-header {
  margin-bottom: 10px;
  font-weight: bold;
}

.success {
  color: #52c41a;
}

.error {
  color: #ff4d4f;
}

.result-output,
.result-expected,
.result-error {
  margin-bottom: 10px;
}

.result-output pre,
.result-expected pre,
.result-error pre {
  background-color: #333;
  padding: 5px;
  border-radius: 3px;
  margin: 5px 0;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  white-space: pre-wrap;
}

.result-stats {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #999;
}
</style>