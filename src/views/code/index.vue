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
  submitCodeRun,
  getCodeRunResult,
  getLanguageId,
  compareOutputs,
} from "@/api/code";
import { getAllProblems } from "@/api/problem";
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
import { ElMessage } from "element-plus";

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

// 运行代码状态
const isRunning = ref(false);
const isSubmitting = ref(false);

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
const problemList = reactive([]);

// 当前选中的题目
const problem = reactive({
  id: 1,
  title: "",
  difficulty: "",
  description: "",
  examples: [],
  constraints: [],
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
const runCode = async () => {
  if (isRunning.value) return;

  const code = editor.getValue();
  const languageId = getLanguageId(selectedLanguage.value);
  resultCollapsed.value = false;
  showResult.value = true;
  isRunning.value = true;

  // 重置测试结果
  Object.assign(testResult, {
    status: "pending",
    output: "运行中...",
    expected: "",
    error: "",
    runtime: 0,
    memory: 0,
  });

  try {
    // 获取预期输出
    const expectedOutput = problem.examples[0].output.trim();

    // 提交代码运行请求
    const submitData = {
      source_code: code,
      language_id: languageId,
      stdin: problem.examples[0].input.split("=")[1].trim(), // 使用第一个示例的输入
      expected_output: expectedOutput, // 设置预期输出
    };

    // 发送提交请求
    const { data: submitResponse } = await submitCodeRun(submitData);
    const token = submitResponse.token;

    if (!token) {
      throw new Error("提交代码失败，未获取到任务ID");
    }

    // 等待并获取结果
    let retries = 0;
    let resultData = null;

    while (retries < 10) {
      // 等待1秒后查询结果
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 获取运行结果
      const { data } = await getCodeRunResult(token);
      resultData = data;

      // 如果状态不是处理中，则结束等待
      if (data.status && data.status.id !== 1 && data.status.id !== 2) {
        break;
      }

      retries++;
    }

    if (!resultData) {
      throw new Error("获取运行结果超时");
    }

    // 获取实际输出
    const actualOutput = resultData.stdout || "";

    // 使用compareOutputs比较输出
    const outputMatches = compareOutputs(actualOutput, expectedOutput);

    // 处理结果
    testResult.status =
      resultData.status.id === 3 && outputMatches ? "success" : "error";
    testResult.output = actualOutput;
    testResult.expected = expectedOutput;
    testResult.runtime = resultData.time * 1000; // 转换为毫秒
    testResult.memory = resultData.memory / 1024; // 转换为MB
    testResult.error =
      resultData.stderr ||
      resultData.compile_output ||
      resultData.message ||
      "";

    // 如果编译和运行都成功，但输出不匹配
    if (resultData.status.id === 3 && !outputMatches) {
      testResult.error += "\n输出结果与预期不匹配";
    }
  } catch (error) {
    console.error("代码运行错误:", error);
    ElMessage.error(error.message || "运行代码失败，请稍后重试");
    testResult.status = "error";
    testResult.error = error.message || "未知错误";
  } finally {
    isRunning.value = false;
  }
};

// 提交代码
const submitCode = async () => {
  if (isSubmitting.value) return;

  const code = editor.getValue();
  const languageId = getLanguageId(selectedLanguage.value);
  resultCollapsed.value = false;
  showResult.value = true;
  isSubmitting.value = true;

  // 重置测试结果
  Object.assign(testResult, {
    status: "pending",
    output: "提交中...",
    expected: "",
    error: "",
    runtime: 0,
    memory: 0,
  });

  try {
    // 提交全部测试用例
    const promises = problem.examples.map(async (example, index) => {
      const input = example.input.split("=")[1].trim();
      const expectedOutput = example.output.trim();

      // 提交代码
      const submitData = {
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: expectedOutput,
      };

      // 发送请求
      const { data: submitResponse } = await submitCodeRun(submitData);
      const token = submitResponse.token;

      if (!token) {
        throw new Error(`测试用例 ${index + 1} 提交失败`);
      }

      // 等待并获取结果
      let retries = 0;
      let resultData = null;

      while (retries < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { data } = await getCodeRunResult(token);
        resultData = data;

        if (data.status && data.status.id !== 1 && data.status.id !== 2) {
          break;
        }

        retries++;
      }

      if (!resultData) {
        throw new Error(`测试用例 ${index + 1} 运行超时`);
      }

      // 比较输出与预期输出
      const actualOutput = resultData.stdout || "";
      const outputMatches = compareOutputs(actualOutput, expectedOutput);

      return {
        index,
        result: resultData,
        expected: expectedOutput,
        actual: actualOutput,
        outputMatches: outputMatches,
        isSuccess: resultData.status.id === 3 && outputMatches, // 只有状态正确且输出匹配才算通过
      };
    });

    // 等待所有测试用例完成
    const results = await Promise.all(promises);

    // 检查是否全部通过
    const allPassed = results.every((r) => r.isSuccess);

    // 更新结果
    testResult.status = allPassed ? "success" : "error";

    // 详细结果
    const totalRuntime = results.reduce(
      (acc, r) => acc + parseFloat(r.result.time || 0),
      0
    );
    const maxMemory = Math.max(...results.map((r) => r.result.memory || 0));

    testResult.output = results
      .map(
        (r) =>
          `测试用例 ${r.index + 1}: ${r.isSuccess ? "通过" : "失败"}\n${
            r.actual
          }`
      )
      .join("\n\n");

    testResult.expected = results
      .map((r) => `测试用例 ${r.index + 1}: ${r.expected}`)
      .join("\n\n");

    testResult.runtime = totalRuntime * 1000; // 转换为毫秒
    testResult.memory = maxMemory / 1024; // 转换为MB

    const errors = results
      .filter((r) => !r.isSuccess)
      .map((r) => {
        if (r.result.status.id !== 3) {
          // 运行出错或编译错误
          return `测试用例 ${r.index + 1} 失败:\n${
            r.result.stderr || r.result.compile_output || r.result.message || ""
          }`;
        } else if (!r.outputMatches) {
          // 运行成功但输出不匹配
          return `测试用例 ${r.index + 1} 失败: 输出结果与预期不匹配\n预期: ${
            r.expected
          }\n实际: ${r.actual}`;
        }
        return `测试用例 ${r.index + 1} 失败: 未知错误`;
      });

    testResult.error = errors.join("\n\n");

    if (allPassed) {
      ElMessage.success("所有测试用例通过！");
    } else {
      ElMessage.warning(
        `${results.filter((r) => r.isSuccess).length}/${
          results.length
        } 个测试用例通过`
      );
    }
  } catch (error) {
    console.error("代码提交错误:", error);
    ElMessage.error(error.message || "提交代码失败，请稍后重试");
    testResult.status = "error";
    testResult.error = error.message || "未知错误";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  initEditor();
  try {
    // 获取题目列表
    const response = await getAllProblems();
    if (response.data && response.data.code === 1 && response.data.data) {
      // 将API返回的数据数组添加到问题列表
      const problems = response.data.data;

      // 处理每个问题的数据格式
      problems.forEach((p) => {
        // 处理难度显示
        switch (p.difficulty) {
          case 1:
            p.difficulty = "简单";
            break;
          case 2:
            p.difficulty = "中等";
            break;
          case 3:
            p.difficulty = "困难";
            break;
          default:
            p.difficulty = "简单";
        }

        // 将sample数组转换为examples数组格式
        if (p.sample && Array.isArray(p.sample) && p.sample.length > 0) {
          p.examples = p.sample.map((s) => ({
            input: s.input || "",
            output: s.output || "",
            explanation: s.explanation || "",
          }));
        } else {
          p.examples = [];
        }

        // 将constraint数组转换为constraints数组格式
        if (
          p.constraint &&
          Array.isArray(p.constraint) &&
          p.constraint.length > 0
        ) {
          p.constraints = p.constraint.map((c) => c.constraintText);
        } else {
          p.constraints = [];
        }
      });

      // 添加处理后的题目到题目列表
      problemList.push(...problems);

      // 默认选择第一道题
      if (problems.length > 0) {
        Object.assign(problem, problems[0]);
      }
    } else {
      throw new Error(response.data.msg || "获取题目列表失败");
    }
  } catch (error) {
    console.error("获取题目列表失败:", error);
    ElMessage.error(error.message || "获取题目列表失败，请稍后重试");
  }
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