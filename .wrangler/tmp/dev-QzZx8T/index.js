var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error3) => {
      for (const issue of error3.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error3 = new ZodError(issues);
  return error3;
};
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
var ParseStatus = class _ParseStatus {
  static {
    __name(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
__name(__classPrivateFieldSet, "__classPrivateFieldSet");
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error3 = new ZodError(ctx.common.issues);
        this._error = error3;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ __name((data) => this["~validate"](data), "validate")
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
__name(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, "isValidCidr");
var ZodString = class _ZodString extends ZodType {
  static {
    __name(this, "ZodString");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
__name(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class _ZodNumber extends ZodType {
  static {
    __name(this, "ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  static {
    __name(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  static {
    __name(this, "ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  static {
    __name(this, "ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
var ZodObject = class _ZodObject extends ZodType {
  static {
    __name(this, "ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: /* @__PURE__ */ __name((issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...augmentation
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  static {
    __name(this, "ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  static {
    __name(this, "ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  static {
    __name(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  static {
    __name(this, "ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  static {
    __name(this, "ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error3) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error3
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error3) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error3
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error3 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error3.addIssue(makeArgsIssue(args, e));
          throw error3;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error3.addIssue(makeReturnsIssue(result, e));
          throw error3;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
var ZodEnum = class _ZodEnum extends ZodType {
  static {
    __name(this, "ZodEnum");
  }
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  static {
    __name(this, "ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
__name(cleanParams, "cleanParams");
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a2, _b2;
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) !== null && _a2 !== void 0 ? _a2 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name((arg) => ZodString.create({ ...arg, coerce: true }), "string"),
  number: /* @__PURE__ */ __name((arg) => ZodNumber.create({ ...arg, coerce: true }), "number"),
  boolean: /* @__PURE__ */ __name((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }), "boolean"),
  bigint: /* @__PURE__ */ __name((arg) => ZodBigInt.create({ ...arg, coerce: true }), "bigint"),
  date: /* @__PURE__ */ __name((arg) => ZodDate.create({ ...arg, coerce: true }), "date")
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// server/kpop-data-kr.ts
var kpopGroupsData = {
  groups: [
    {
      name: "BTS",
      agency: "\uBE45\uD788\uD2B8 \uBBA4\uC9C1",
      members: [
        { name: "RM", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uC9C4", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC288\uAC00", position: ["\uB9AC\uB4DC \uB798\uD37C"] },
        {
          name: "\uC81C\uC774\uD649",
          position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"]
        },
        { name: "\uC9C0\uBBFC", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBDD4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        {
          name: "\uC815\uAD6D",
          position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uB798\uD37C", "\uC13C\uD130", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "BLACKPINK",
      agency: "YG \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C0\uC218", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC81C\uB2C8", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB85C\uC81C", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        {
          name: "\uB9AC\uC0AC",
          position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "IVE",
      agency: "\uC2A4\uD0C0\uC27D \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC548\uC720\uC9C4", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uAC00\uC744", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB808\uC774", position: ["\uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        {
          name: "\uC7A5\uC6D0\uC601",
          position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uC13C\uD130"]
        },
        { name: "\uB9AC\uC988", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC774\uC11C", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "aespa",
      agency: "SM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uCE74\uB9AC\uB098",
          position: [
            "\uB9AC\uB354",
            "\uBA54\uC778 \uB304\uC11C",
            "\uB9AC\uB4DC \uB798\uD37C",
            "\uC11C\uBE0C \uBCF4\uCEEC",
            "\uBE44\uC8FC\uC5BC",
            "\uC13C\uD130"
          ]
        },
        { name: "\uC9C0\uC824", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC708\uD130", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB2DD\uB2DD", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "(G)I-DLE",
      agency: "\uD050\uBE0C \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uC18C\uC5F0",
          position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uC13C\uD130", "\uC11C\uBE0C \uBCF4\uCEEC"]
        },
        { name: "\uBBFC\uB2C8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC6B0\uAE30", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC288\uD654", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"] },
        { name: "\uBBF8\uC5F0", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] }
      ]
    },
    {
      name: "KIIRAS",
      agency: "LeanBranding",
      members: [
        { name: "\uB9C1\uB9C1", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uCFE0\uB8E8\uBBF8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD558\uB9B0", position: ["\uC13C\uD130"] },
        { name: "\uCE74\uC77C\uB9AC", position: ["\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uB3C4\uC5F0", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB85C\uC544", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "KickFlip",
      agency: "JYP \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uACC4\uD6C8", position: ["\uB9AC\uB354", "\uC5D0\uC774\uC2A4"] },
        { name: "\uC544\uB9C8\uB8E8", position: ["\uBCF4\uCEEC", "\uB7A9"] },
        { name: "\uB3D9\uD654", position: ["\uB304\uC2A4"] },
        { name: "\uC8FC\uC655", position: ["\uBCF4\uCEEC"] },
        { name: "\uBBFC\uC81C", position: ["\uBE44\uC8FC\uC5BC", "\uB7A9"] },
        { name: "\uCF00\uC774\uC8FC", position: ["\uB304\uC2A4"] },
        { name: "\uB3D9\uD604", position: ["\uB9C9\uB0B4", "\uBCF4\uCEEC"] }
      ]
    },
    {
      name: "Hearts2Hearts",
      agency: "SM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C0\uC6B0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uCE74\uB974\uBA58", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC720\uD558", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC2A4\uD154\uB77C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC900", position: ["\uBA54\uC778 \uB304\uC11C", "\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC544\uB098", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        {
          name: "\uC774\uC548",
          position: ["\uC13C\uD130", "\uBE44\uC8FC\uC5BC", "\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"]
        },
        { name: "\uC608\uC628", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ifeye",
      agency: "\uD558\uC774\uD587 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uCE74\uC2DC\uC544", position: ["\uB9AC\uB354", "\uB798\uD37C"] },
        { name: "\uC6D0\uD654\uC5F0", position: ["\uBCF4\uCEEC", "\uC13C\uD130"] },
        { name: "\uD0DC\uB9B0", position: ["\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uB77C\uD76C", position: ["\uC62C\uB77C\uC6B4\uB354"] },
        { name: "\uBBA4", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB304\uC11C"] },
        { name: "\uC0AC\uC0E4", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "Stray Kids",
      agency: "JYP \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uBC29\uCC2C",
          position: ["\uB9AC\uB354", "\uD504\uB85C\uB4C0\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uB798\uD37C"]
        },
        { name: "\uB9AC\uB178", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uCC3D\uBE48", position: ["\uBA54\uC778 \uB798\uD37C", "\uD504\uB85C\uB4C0\uC11C", "\uBCF4\uCEEC"] },
        {
          name: "\uD604\uC9C4",
          position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"]
        },
        { name: "\uD55C", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uD504\uB85C\uB4C0\uC11C"] },
        { name: "\uD544\uB9AD\uC2A4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC2B9\uBBFC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC544\uC774\uC5D4", position: ["\uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ATEEZ",
      agency: "KQ \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uD64D\uC911", position: ["\uB9AC\uB354", "\uB798\uD37C", "\uC791\uACE1\uAC00"] },
        { name: "\uC131\uD654", position: ["\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC724\uD638", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC5EC\uC0C1", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC0B0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uBBFC\uAE30", position: ["\uBA54\uC778 \uB798\uD37C", "\uD37C\uD3EC\uBA38"] },
        { name: "\uC6B0\uC601", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC", "\uD37C\uD3EC\uBA38"] },
        { name: "\uC885\uD638", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "LOONA",
      agency: "\uBE14\uB85D\uBCA0\uB9AC \uD06C\uB9AC\uC5D0\uC774\uD2F0\uBE0C",
      members: [
        { name: "\uD76C\uC9C4", position: ["\uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD604\uC9C4", position: ["\uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD558\uC2AC", position: ["\uB9AC\uB354", "\uBCF4\uCEEC"] },
        { name: "\uC5EC\uC9C4", position: ["\uBCF4\uCEEC", "\uB9C9\uB0B4"] },
        { name: "\uBE44\uBE44", position: ["\uBCF4\uCEEC"] },
        { name: "\uAE40\uB9BD", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB304\uC11C"] },
        { name: "\uC9C4\uC194", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uCD5C\uB9AC", position: ["\uB798\uD37C", "\uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC774\uBE0C", position: ["\uBCF4\uCEEC", "\uB304\uC11C"] },
        { name: "\uCE04", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uADF8\uB8F9 \uC5BC\uAD74"] },
        { name: "\uACE0\uC6D0", position: ["\uB798\uD37C", "\uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC62C\uB9AC\uBE44\uC544 \uD61C", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB304\uC11C", "\uBCF4\uCEEC"] }
      ]
    },
    {
      name: "THE BOYZ",
      agency: "IST \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC0C1\uC5F0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC81C\uC774\uCF65", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC601\uD6C8", position: ["\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD604\uC7AC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC8FC\uC5F0", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uCF00\uBE48", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB274", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD050", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC8FC\uD559\uB144", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC120\uC6B0", position: ["\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uC5D0\uB9AD", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] },
        { name: "\uD65C", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uB798\uD37C"] }
      ]
    },
    {
      name: "Golden Child",
      agency: "\uC6B8\uB9BC \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB300\uC5F4", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC640\uC774", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC7A5\uC900", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD0DC\uADF8", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC2B9\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC7AC\uD604", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB3D9\uD604", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC8FC\uCC2C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC9C0\uBC94", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        {
          name: "\uBCF4\uBBFC",
          position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4", "\uBE44\uC8FC\uC5BC"]
        }
      ]
    },
    {
      name: "Weki Meki",
      agency: "\uD310\uD0C0\uC9C0\uC624",
      members: [
        { name: "\uC218\uC5F0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC5D8\uB9AC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC720\uC815", position: ["\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        {
          name: "\uB3C4\uC5F0",
          position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uBE44\uC8FC\uC5BC", "\uC13C\uD130"]
        },
        { name: "\uC138\uC774", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB8E8\uC544", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB798\uD37C"] },
        { name: "\uB9AC\uB098", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB8E8\uC2DC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ONF",
      agency: "WM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uD6A8\uC9C4", position: ["\uB9AC\uB354(ON\uD300)", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC774\uC158", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        {
          name: "\uC81C\uC774\uC5B4\uC2A4",
          position: ["\uB9AC\uB354(OFF\uD300)", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"]
        },
        { name: "\uC640\uC774\uC5C7", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC5E0\uCF00\uC774", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC720", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC", "\uB9C9\uB0B4"] },
        { name: "\uB77C\uC6B4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] }
      ]
    },
    {
      name: "Dreamcatcher",
      agency: "\uB4DC\uB9BC\uCE90\uCCD0 \uCEF4\uD37C\uB2C8",
      members: [
        { name: "\uC9C0\uC720", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC218\uC544", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC2DC\uC5F0", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD55C\uB3D9", position: ["\uBCF4\uCEEC"] },
        { name: "\uC720\uD604", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB2E4\uBBF8", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uAC00\uD604", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "fromis_9",
      agency: "\uC624\uD504\uB354\uB808\uCF54\uB4DC \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC0C8\uB86C", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD558\uC601", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uADDC\uB9AC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC9C0\uC6D0", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC9C0\uC120", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uC13C\uD130"] },
        { name: "\uC11C\uC5F0", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uCC44\uC601", position: ["\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uB098\uACBD", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC9C0\uD5CC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "NATURE",
      agency: "n.CH \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB8E8", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC0C8\uBD04", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC624\uB85C\uB77C", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uCC44\uBE48", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD558\uB8E8", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uB85C\uD558", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC720\uCC44", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC120\uC0E4\uC778", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC18C\uD76C", position: ["\uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "D-CRUNCH",
      agency: "\uC62C\uC5D0\uC2A4 \uCEF4\uD37C\uB2C8",
      members: [
        { name: "\uC624\uBE0C\uC774", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uD604\uC6B1", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD604\uD638", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uD604\uC624", position: ["\uBCF4\uCEEC"] },
        { name: "\uD604\uC6B0", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uBBFC\uD601", position: ["\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uCC2C\uC601", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC815\uC2B9", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB51C\uB7F0", position: ["\uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "DreamNote",
      agency: "\uC544\uC774\uBBF8 \uCF54\uB9AC\uC544",
      members: [
        { name: "\uC218\uBBFC", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC740\uC870", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uB77C\uB77C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBBF8\uC18C", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC720\uC774", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uBCF4\uB2C8", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uD558\uBE48", position: ["\uBA54\uC778 \uB304\uC11C", "\uB798\uD37C"] },
        { name: "\uD55C\uBCC4", position: ["\uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "IZ*ONE",
      agency: "\uC624\uD504\uB354\uB808\uCF54\uB4DC \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC740\uBE44", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC0AC\uCFE0\uB77C", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD61C\uC6D0", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC720\uB9AC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC608\uB098", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uCC44\uC5F0", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uBBFC\uC8FC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB098\uCF54", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uD788\uD1A0\uBBF8", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC720\uC9C4", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uC13C\uD130"] },
        {
          name: "\uC6D0\uC601",
          position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"]
        },
        { name: "\uCC44\uC6D0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] }
      ]
    },
    {
      name: "PRISTIN",
      agency: "\uD50C\uB808\uB514\uC2A4 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB098\uC601", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uB85C\uC544", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC720\uD558", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC740\uC6B0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB808\uB098", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uACB0\uACBD", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC608\uD558\uB098", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC131\uC5F0", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uBA54\uC778 \uD504\uB85C\uB4C0\uC11C"] },
        { name: "\uC2DC\uC5F0", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uCE74\uC77C\uB77C", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ELRIS",
      agency: "\uD734\uB2C8\uC2A4 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uBCA8\uB77C", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uD61C\uC131", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uC720\uACBD", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC18C\uD76C", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uADF8\uB8F9 \uC5BC\uAD74"] },
        { name: "\uAC00\uB9B0", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "IN2IT",
      agency: "MMO \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C0\uC548", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC5F0\uD0DC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC778\uD45C", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC544\uC774\uC791", position: ["\uBCF4\uCEEC"] },
        { name: "\uC778\uD638", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uD604\uC6B1", position: ["\uBA54\uC778 \uB304\uC11C", "\uB798\uD37C"] },
        { name: "\uC9C4\uC12D", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC131\uD604", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "The Rose",
      agency: "J&Star \uCEF4\uD37C\uB2C8",
      members: [
        { name: "\uC6B0\uC131", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC", "\uC77C\uB809 \uAE30\uD0C0"] },
        { name: "\uB3C4\uC900", position: ["\uD0A4\uBCF4\uB4DC", "\uC5B4\uCFE0\uC2A4\uD2F1 \uAE30\uD0C0", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD558\uC900", position: ["\uB4DC\uB7EC\uBA38", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB798\uD37C"] },
        {
          name: "\uC7AC\uD615",
          position: ["\uBCA0\uC774\uC2DC\uC2A4\uD2B8", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "ITZY",
      agency: "JYP \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uC608\uC9C0",
          position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"]
        },
        { name: "\uB9AC\uC544", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        {
          name: "\uB958\uC9C4",
          position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uC13C\uD130", "\uC11C\uBE0C \uBCF4\uCEEC"]
        },
        { name: "\uCC44\uB839", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        {
          name: "\uC720\uB098",
          position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "TXT (Tomorrow X Together)",
      agency: "\uBE45\uD788\uD2B8 \uBBA4\uC9C1",
      members: [
        { name: "\uC218\uBE48", position: ["\uB9AC\uB354", "\uBCF4\uCEEC", "\uB798\uD37C"] },
        { name: "\uC5F0\uC900", position: ["\uB798\uD37C", "\uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uBC94\uADDC", position: ["\uBCF4\uCEEC", "\uB304\uC11C", "\uB798\uD37C", "\uC13C\uD130", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD0DC\uD604", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB304\uC11C"] },
        { name: "\uD734\uB2DD\uCE74\uC774", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB304\uC11C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "TREASURE",
      agency: "YG \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uCD5C\uD604\uC11D", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uC9C0\uD6C8", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC694\uC2DC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC900\uADDC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB9C8\uC2DC\uD638", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC724\uC7AC\uD601", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC544\uC0AC\uD788", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uBC29\uC608\uB2F4", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB3C4\uC601", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD558\uB8E8\uD1A0", position: ["\uBA54\uC778 \uB798\uD37C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uBC15\uC815\uC6B0", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC18C\uC815\uD658", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "CRAVITY",
      agency: "\uC2A4\uD0C0\uC27D \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC138\uB9BC", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC568\uB7F0", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC815\uBAA8", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC6B0\uBE48", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC6D0\uC9C4", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uBBFC\uD76C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD615\uC900", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD0DC\uC601", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC131\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "MCND",
      agency: "\uD2F0\uC624\uD53C\uBBF8\uB514\uC5B4",
      members: [
        { name: "\uCE90\uC2AC\uC81C\uC774", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uBE45", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uBBFC\uC7AC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD718\uC900", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC708", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "cignature",
      agency: "J9 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uCC44\uC194", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC9C0\uC6D0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC140\uB9B0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uD074\uB85C\uC774", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC138\uBBF8", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB3C4\uD76C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBCA8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] }
      ]
    },
    {
      name: "STAYC",
      agency: "\uD558\uC774\uC5C5 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC218\uBBFC", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C", "\uB798\uD37C"] },
        { name: "\uC2DC\uC740", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC544\uC774\uC0AC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC138\uC740", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC724", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC7AC\uC774", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "Weeekly",
      agency: "IST \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC218\uC9C4", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC9C0\uC724", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBA3C\uB370\uC774", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uC18C\uC740", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC7AC\uD76C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC9C0\uD55C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uADF8\uB8F9 \uC5BC\uAD74"] },
        { name: "\uC870\uC544", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ENHYPEN",
      agency: "\uBE4C\uB9AC\uD504\uB7A9 (\uD558\uC774\uBE0C \xD7 CJ ENM)",
      members: [
        { name: "\uC815\uC6D0", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB798\uD37C"] },
        { name: "\uD76C\uC2B9", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uC13C\uD130", "\uB304\uC11C"] },
        { name: "\uC81C\uC774", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC81C\uC774\uD06C", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC131\uD6C8", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC120\uC6B0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB2C8\uD0A4", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "E'LAST",
      agency: "\uC774 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB77C\uB178", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uCD5C\uC778", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC2B9\uC5FD", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBC31\uACB0", position: ["\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB85C\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC6D0\uD601", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC6D0\uC900", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC608\uC900", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "DRIPPIN",
      agency: "\uC6B8\uB9BC \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC724\uC131", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD611", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCC3D\uC6B1", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB3D9\uC724", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uBBFC\uC11C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] },
        { name: "\uC900\uD638", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC54C\uB809\uC2A4", position: ["\uB798\uD37C", "\uBCF4\uCEEC", "\uB9C9\uB0B4(2019~2022 \uD65C\uB3D9)"] }
      ]
    },
    {
      name: "Secret Number",
      agency: "\uBC14\uC778 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB808\uC544", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB514\uD0C0", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC9C4\uD76C", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uBBFC\uC9C0", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC218\uB2F4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC8FC", position: ["\uC11C\uBE0C \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] }
      ]
    },
    {
      name: "BDC (Boys Da Capo)",
      agency: "\uBE0C\uB79C\uB274\uBBA4\uC9C1",
      members: [
        { name: "\uC131\uC900", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC2DC\uD6C8", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC815\uD658", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "BOTOPASS",
      agency: "WKS ENE / JMG",
      members: [
        { name: "\uBBF8\uD76C", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC11C\uC724", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB9AC\uC544", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC2DC\uC5F0", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uD558\uB9B0", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC9C0\uC6D0", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC2DC\uC548", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC544\uC724", position: ["\uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "LE SSERAFIM",
      agency: "\uC3D8\uC2A4\uBBA4\uC9C1 / \uD558\uC774\uBE0C",
      members: [
        { name: "\uCC44\uC6D0", position: ["\uB9AC\uB354", "\uBCF4\uCEEC", "\uB304\uC11C"] },
        { name: "\uC0AC\uCFE0\uB77C", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC724\uC9C4", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCE74\uC988\uD558", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC740\uCC44", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "NewJeans",
      agency: "\uC5B4\uB3C4\uC5B4 (\uD558\uC774\uBE0C)",
      members: [
        { name: "\uBBFC\uC9C0", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uD558\uB2C8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB2E4\uB2C8\uC5D8", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD574\uB9B0", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uD61C\uC778", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "Kep1er",
      agency: "\uC6E8\uC774\uD06C\uC6D0 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8 / \uC2A4\uC719 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uC720\uC9C4",
          position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"]
        },
        { name: "\uB9C8\uC2DC\uB85C", position: ["\uACF5\uB3D9 \uB9AC\uB354", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC0E4\uC624\uD305", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uCC44\uD604", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB2E4\uC5F0", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uD788\uCE74\uB8E8", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD734\uB2DD \uBC14\uD788\uC5D0", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC601\uC740", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC608\uC11C", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "NMIXX",
      agency: "JYP \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uD574\uC6D0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB9B4\uB9AC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC124\uC724", position: ["\uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uBC30\uC774", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC9C0\uC6B0", position: ["\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uADDC\uC9C4", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "XG",
      agency: "XGALX",
      members: [
        { name: "\uC8FC\uB9B0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uCE58\uC0AC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD558\uBE44", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD788\uB098\uD0C0", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC8FC\uB9AC\uC544", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB9C8\uC57C", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uCF54\uCF54\uB098", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "TNX",
      agency: "\uD53C\uB124\uC774\uC158",
      members: [
        { name: "\uD0DC\uD6C8", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uACBD\uC900", position: ["\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uD604\uC218", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC900\uD601", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD718", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC131\uC900", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "BAE173",
      agency: "\uD3EC\uCF13\uB3CC \uC2A4\uD29C\uB514\uC624",
      members: [
        { name: "\uC81C\uC774\uBBFC", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uD55C\uACB0", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC720\uC900", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uBB34\uC9C4", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC900\uC11C", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC601\uC11C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB3C4\uD558", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uBE5B", position: ["\uC11C\uBE0C \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uB3C4\uD604", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "BOYNEXTDOOR",
      agency: "\uCF54\uC988 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8 (\uD558\uC774\uBE0C)",
      members: [
        { name: "\uC7AC\uD604", position: ["\uB9AC\uB354", "\uBCF4\uCEEC", "\uB798\uD37C"] },
        { name: "\uC131\uD638", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB9AC\uC6B0", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD0DC\uC0B0", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uB9AC\uD55C", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC6B4\uD559", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ZEROBASEONE (ZB1)",
      agency: "\uC6E8\uC774\uD06C\uC6D0 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC131\uD55C\uBE48", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uAE40\uC9C0\uC6C5", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC7A5\uD558\uC624", position: ["\uC13C\uD130", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC11D\uB9E4\uD29C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uAE40\uD0DC\uB798", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB9AC\uD0A4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uAE40\uADDC\uBE48", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uBC15\uAC74\uC6B1", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD55C\uC720\uC9C4", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "RIIZE",
      agency: "SM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC1FC\uD0C0\uB85C", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC740\uC11D", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC131\uCC2C", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC6D0\uBE48", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC18C\uD76C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC564\uD1A4", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "KISS OF LIFE",
      agency: "\uC5D0\uC2A4\uD22C \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC904\uB9AC", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uB098\uB760", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBCA8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uD558\uB298", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "PLAVE",
      agency: "\uBE0C\uC774\uB798\uC2A4\uD2B8",
      members: [
        { name: "\uC608\uC900", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uB178\uC544", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uBC24\uBE44", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC740\uD638", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uD558\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "BABYMONSTER",
      agency: "YG \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB8E8\uCE74", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD30C\uB9AC\uD0C0", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC544\uC0AC", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC544\uD604", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uB77C\uBBF8(\uD558\uB78C)", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCE58\uD0A4\uD0C0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] },
        { name: "\uB85C\uB77C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] }
      ]
    },
    {
      name: "ILLIT",
      agency: "\uBE4C\uB9AC\uD504\uB7A9 (\uD558\uC774\uBE0C)",
      members: [
        { name: "\uC720\uB098", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBBFC\uC8FC", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uBAA8\uCE74", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC6D0\uD76C", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uC13C\uD130"] },
        { name: "\uC774\uB85C\uD558", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "UNIS",
      agency: "F&F \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8 / \uCE74\uCE74\uC624 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C4\uD604\uC8FC", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC784\uC724\uC11C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB098\uB098\uBBF8", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uCF54\uD1A0\uB124", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC5D8\uB9AC\uC2DC\uC544", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC624\uC608\uC6D0", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uCE74\uBC00\uB77C", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC784\uC11C\uC6D0", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "TWS",
      agency: "\uD50C\uB808\uB514\uC2A4 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8 (\uD558\uC774\uBE0C)",
      members: [
        { name: "\uC2E0\uC720", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB3C4\uD6C8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC601\uC7AC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uACBD\uBBFC", position: ["\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uD55C\uC9C4", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC9C0\uD6C8", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "KATSEYE",
      agency: "\uD558\uC774\uBE0C \xD7 \uAC8C\uD39C \uB808\uCF54\uC988",
      members: [
        { name: "\uB77C\uB77C \uB77C\uC790\uACE0\uD314", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC18C\uD53C\uC544 \uB77C\uD3EC\uB974\uD14C\uC790", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uB2E4\uB2C8\uC5D8\uB77C \uC544\uBC18\uC9C0\uB2C8", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB9C8\uB18D \uBC30\uB108\uBA3C", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uBA54\uAC74 \uC2A4\uD0A4\uC5D4\uC9C0\uC5D8", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC815\uC724\uCC44", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "RESCENE",
      agency: "\uADF8\uB808\uC774\uD2B8\uC5E0 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC6D0\uC774", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uB9AC\uBE0C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBBF8\uB098\uBBF8", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB9C8\uC720", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC720\uC988", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "ALL(H)OURS",
      agency: "\uC774\uB4E0 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uBBFC\uADDC", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC815\uBBFC", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uD604\uC6B0", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC724\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC9C4\uC131", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC2DC\uC628", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "AMPERS&ONE",
      agency: "FNC \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uCEA0\uB4E0", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uBE0C\uB77C\uC774\uC5B8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC9C0\uD638", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC2B9\uBAA8", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uCE74\uC774\uB810", position: ["\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC0C1\uBBFC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uACBD\uBBFC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "NOWADAYS",
      agency: "\uD050\uBE0C \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C4\uD601", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC6B0\uD601", position: ["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC11D\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC720\uC9C4", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uD604\uC11C", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "EXO",
      agency: "SM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC218\uD638", position: ["\uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC2DC\uC6B0\uBBFC", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uB808\uC774", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uBC31\uD604", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCCB8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCC2C\uC5F4", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uB514\uC624", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        {
          name: "\uCE74\uC774",
          position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uB798\uD37C", "\uBE44\uC8FC\uC5BC", "\uC13C\uD130"]
        },
        {
          name: "\uC138\uD6C8",
          position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uB798\uD37C", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "Red Velvet",
      agency: "SM \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        {
          name: "\uC544\uC774\uB9B0",
          position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB304\uC11C", "\uBE44\uC8FC\uC5BC"]
        },
        { name: "\uC2AC\uAE30", position: ["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC6EC\uB514", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC870\uC774", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC608\uB9AC", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "SEVENTEEN",
      agency: "\uD50C\uB808\uB514\uC2A4 \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8 (\uD558\uC774\uBE0C)",
      members: [
        { name: "\uC5D0\uC2A4\uCFF1\uC2A4", position: ["\uB9AC\uB354", "\uD799\uD569\uD300 \uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uC815\uD55C", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC870\uC288\uC544", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC900", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        {
          name: "\uD638\uC2DC",
          position: ["\uD37C\uD3EC\uBA3C\uC2A4\uD300 \uB9AC\uB354", "\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uBCF4\uCEEC"]
        },
        { name: "\uC6D0\uC6B0", position: ["\uB9AC\uB4DC \uB798\uD37C"] },
        { name: "\uC6B0\uC9C0", position: ["\uBCF4\uCEEC\uD300 \uB9AC\uB354", "\uB9AC\uB4DC \uBCF4\uCEEC", "\uD504\uB85C\uB4C0\uC11C"] },
        { name: "\uB3C4\uACB8", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBBFC\uADDC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uB514\uC5D0\uC787", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC2B9\uAD00", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBC84\uB17C", position: ["\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uB514\uB178", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "TWICE",
      agency: "JYP \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uB098\uC5F0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uC13C\uD130"] },
        { name: "\uC815\uC5F0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uBAA8\uBAA8", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uC11C\uBE0C \uB798\uD37C"] },
        { name: "\uC0AC\uB098", position: ["\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC9C0\uD6A8", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBBF8\uB098", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uB2E4\uD604", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uCC44\uC601", position: ["\uBA54\uC778 \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        {
          name: "\uCBD4\uC704",
          position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC", "\uB9C9\uB0B4"]
        }
      ]
    },
    {
      name: "GFRIEND",
      agency: "\uC3D8\uC2A4\uBBA4\uC9C1",
      members: [
        { name: "\uC18C\uC6D0", position: ["\uB9AC\uB354", "\uC11C\uBE0C \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uC608\uB9B0", position: ["\uB9AC\uB4DC \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC740\uD558", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uC720\uC8FC", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uC2E0\uBE44", position: ["\uBA54\uC778 \uB304\uC11C", "\uC11C\uBE0C \uBCF4\uCEEC"] },
        { name: "\uC5C4\uC9C0", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "MAMAMOO",
      agency: "RBW \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC194\uB77C", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uBB38\uBCC4", position: ["\uBA54\uC778 \uB798\uD37C", "\uBA54\uC778 \uB304\uC11C"] },
        { name: "\uD718\uC778", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uD654\uC0AC", position: ["\uB9AC\uB4DC \uB798\uD37C", "\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "iKON",
      agency: "YG \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uBE44\uC544\uC774", position: ["\uB9AC\uB354", "\uBA54\uC778 \uB798\uD37C"] },
        { name: "\uBC14\uBE44", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC9C4\uD658", position: ["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uB304\uC11C"] },
        { name: "\uC724\uD615", position: ["\uB9AC\uB4DC \uBCF4\uCEEC"] },
        { name: "\uB3D9\uD601", position: ["\uBA54\uC778 \uB304\uC11C", "\uBCF4\uCEEC"] },
        { name: "\uC900\uD68C", position: ["\uBA54\uC778 \uBCF4\uCEEC"] },
        { name: "\uCC2C\uC6B0", position: ["\uC11C\uBE0C \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    },
    {
      name: "WINNER",
      agency: "YG \uC5D4\uD130\uD14C\uC778\uBA3C\uD2B8",
      members: [
        { name: "\uC9C4\uC6B0", position: ["\uB9AC\uB4DC \uBCF4\uCEEC", "\uBE44\uC8FC\uC5BC"] },
        { name: "\uD6C4\uB2C8", position: ["\uBA54\uC778 \uB304\uC11C", "\uB798\uD37C"] },
        { name: "\uBBFC\uD638", position: ["\uBA54\uC778 \uB798\uD37C", "\uBCF4\uCEEC"] },
        { name: "\uC2B9\uC724", position: ["\uB9AC\uB354", "\uBA54\uC778 \uBCF4\uCEEC", "\uB9C9\uB0B4"] }
      ]
    }
  ]
};

// worker/index.ts
var quizAnswersSchema = z.object({
  stagePresence: z.enum(["center", "leader", "performer", "charisma"]),
  friendsDescribe: z.enum(["mood_maker", "serious", "creative", "responsible"]),
  newProject: z.enum(["execute", "plan", "discuss", "think"]),
  stageImportant: z.enum(["expression", "accuracy", "vocal", "teamwork"]),
  practiceStyle: z.enum(["vocal", "dance", "direction", "care"]),
  danceStyle: z.enum(["hiphop", "contemporary", "powerful", "cute"]),
  fashionStyle: z.enum(["street", "chic", "lovely", "trendy"]),
  makeupStyle: z.enum(["natural", "bold", "retro", "elegant"])
});
function createAnalysisPrompt(answers, language = "kr") {
  const questionMapping = language === "kr" ? {
    stagePresence: {
      center: "\uC911\uC2EC\uC5D0\uC11C \uBE5B\uB098\uB294 \uD0C0\uC785",
      leader: "\uD300\uC744 \uC774\uB044\uB294 \uB9AC\uB354\uD615",
      performer: "\uC5F4\uC815\uC801\uC778 \uD37C\uD3EC\uBA38",
      charisma: "\uC870\uC6A9\uD55C \uCE74\uB9AC\uC2A4\uB9C8"
    },
    friendsDescribe: {
      mood_maker: "\uBD84\uC704\uAE30 \uBA54\uC774\uCEE4",
      serious: "\uC9C4\uC9C0\uD558\uACE0 \uC2E0\uC911\uD568",
      creative: "\uCC3D\uC758\uC801\uC774\uACE0 \uC608\uC220\uC801",
      responsible: "\uACC4\uD68D\uC801\uC774\uACE0 \uCC45\uC784\uAC10"
    },
    newProject: {
      execute: "\uBC14\uB85C \uB530\uB77C\uD558\uBA70 \uBAB8\uC73C\uB85C \uC775\uD78C\uB2E4",
      plan: "\uBA3C\uC800 \uAD6C\uC870\uB97C \uBD84\uC11D\uD558\uACE0 \uACC4\uD68D\uD55C\uB2E4",
      discuss: "\uBA64\uBC84\uB4E4\uACFC \uD568\uAED8 \uC758\uACAC \uB098\uB208\uB2E4",
      think: "\uD63C\uC790 \uCC28\uADFC\uCC28\uADFC \uC774\uD574\uD55C\uB2E4"
    },
    stageImportant: {
      expression: "\uD45C\uC815\uACFC \uB208\uBE5B",
      accuracy: "\uC548\uBB34 \uC815\uD655\uB3C4",
      vocal: "\uC74C\uC815\uACFC \uAC10\uC815 \uC804\uB2EC",
      teamwork: "\uC804\uCCB4\uC801\uC778 \uD300\uC6CC\uD06C"
    },
    practiceStyle: {
      vocal: "\uACE0\uC74C \uCC98\uB9AC\uB098 \uAC10\uC815 \uC804\uB2EC",
      dance: "\uCE7C\uAD70\uBB34\uC640 \uB3D9\uC791 \uC815\uB9AC",
      direction: "\uBB34\uB300 \uC5F0\uCD9C/\uAD6C\uC131 \uC544\uC774\uB514\uC5B4",
      care: "\uBA64\uBC84\uB4E4 \uCF00\uC5B4 \uBC0F \uC18C\uD1B5"
    },
    danceStyle: {
      hiphop: "\uB9AC\uB4EC\uAC10 \uB118\uCE58\uB294 \uD799\uD569",
      contemporary: "\uBD80\uB4DC\uB7EC\uC6B4 \uCEE8\uD15C\uD3EC\uB7EC\uB9AC",
      powerful: "\uD30C\uC6CC\uD480\uD55C \uD37C\uD3EC\uBA3C\uC2A4",
      cute: "\uD0A4\uCE58\uD558\uACE0 \uADC0\uC5EC\uC6B4 \uC548\uBB34"
    },
    fashionStyle: {
      street: "\uC2A4\uD2B8\uB9BF, \uCE90\uC8FC\uC5BC",
      chic: "\uC2DC\uD06C\uD558\uACE0 \uBAA8\uB358",
      lovely: "\uB7EC\uBE14\uB9AC\uD558\uACE0 \uCEEC\uB7EC\uD480",
      trendy: "\uD2B8\uB80C\uB514\uD558\uACE0 \uC720\uB2C8\uD06C"
    },
    makeupStyle: {
      natural: "\uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uB0B4\uCD94\uB7F4",
      bold: "\uAC15\uB82C\uD55C \uD3EC\uC778\uD2B8 \uCEEC\uB7EC",
      retro: "\uB808\uD2B8\uB85C \uAC10\uC131",
      elegant: "\uAE54\uB054\uD558\uACE0 \uACE0\uAE09\uC9C4 \uC2A4\uD0C0\uC77C"
    }
  } : {
    stagePresence: {
      center: "Shining at the center",
      leader: "Leading the team",
      performer: "Passionate performer",
      charisma: "Quiet charisma"
    },
    friendsDescribe: {
      mood_maker: "Mood maker",
      serious: "Serious and careful",
      creative: "Creative and artistic",
      responsible: "Planned and responsible"
    },
    newProject: {
      execute: "Learn by doing immediately",
      plan: "Analyze structure and plan first",
      discuss: "Share opinions with members",
      think: "Understand step by step alone"
    },
    stageImportant: {
      expression: "Facial expressions and eyes",
      accuracy: "Choreography accuracy",
      vocal: "Pitch and emotion delivery",
      teamwork: "Overall teamwork"
    },
    practiceStyle: {
      vocal: "High notes and emotion delivery",
      dance: "Synchronized choreography",
      direction: "Stage direction/composition ideas",
      care: "Member care and communication"
    },
    danceStyle: {
      hiphop: "Rhythmic hip-hop",
      contemporary: "Smooth contemporary",
      powerful: "Powerful performance",
      cute: "Cute and playful choreography"
    },
    fashionStyle: {
      street: "Street, casual",
      chic: "Chic and modern",
      lovely: "Lovely and colorful",
      trendy: "Trendy and unique"
    },
    makeupStyle: {
      natural: "Natural style",
      bold: "Bold point colors",
      retro: "Retro vibes",
      elegant: "Clean and sophisticated style"
    }
  };
  const prompt = language === "kr" ? `\uB2E4\uC74C\uC740 KPOP \uC544\uC774\uB3CC \uC801\uC131 \uBD84\uC11D\uC744 \uC704\uD55C 8\uAC1C \uC9C8\uBB38\uC5D0 \uB300\uD55C \uB2F5\uBCC0\uC785\uB2C8\uB2E4:

1. \uBB34\uB300 \uC704\uC5D0\uC11C\uC758 \uBAA8\uC2B5: ${questionMapping.stagePresence[answers.stagePresence]}
2. \uCE5C\uAD6C\uB4E4\uC774 \uB9D0\uD558\uB294 \uC131\uACA9: ${questionMapping.friendsDescribe[answers.friendsDescribe]}  
3. \uC0C8\uB85C\uC6B4 \uD504\uB85C\uC81D\uD2B8 \uC811\uADFC\uBC95: ${questionMapping.newProject[answers.newProject]}
4. \uBB34\uB300\uC5D0\uC11C \uC911\uC694\uD558\uAC8C \uC0DD\uAC01\uD558\uB294 \uAC83: ${questionMapping.stageImportant[answers.stageImportant]}
5. \uC5F0\uC2B5 \uC911 \uC9D1\uC911\uD558\uB294 \uBD80\uBD84: ${questionMapping.practiceStyle[answers.practiceStyle]}
6. \uC120\uD638\uD558\uB294 \uCDA4 \uC2A4\uD0C0\uC77C: ${questionMapping.danceStyle[answers.danceStyle]}
7. \uD328\uC158 \uC2A4\uD0C0\uC77C: ${questionMapping.fashionStyle[answers.fashionStyle]}
8. \uBA54\uC774\uD06C\uC5C5 \uC2A4\uD0C0\uC77C: ${questionMapping.makeupStyle[answers.makeupStyle]}

\uC774 \uB2F5\uBCC0\uC744 \uBC14\uD0D5\uC73C\uB85C \uB2E4\uC74C JSON \uD615\uC2DD\uC73C\uB85C KPOP \uC544\uC774\uB3CC \uBD84\uC11D \uACB0\uACFC\uB97C \uC0DD\uC131\uD574\uC8FC\uC138\uC694:

{
  "groupName": "\uC2E4\uC81C KPOP \uADF8\uB8F9\uBA85",
  "position": "\uBA54\uC778 \uD3EC\uC9C0\uC158 (\uC608: Leader, Main Vocalist, Main Dancer, Main Rapper, Visual)",
  "subPosition": "\uC11C\uBE0C \uD3EC\uC9C0\uC158 (\uC120\uD0DD\uC0AC\uD56D)",
  "character": "\uADF8\uB8F9\uBA85 + \uBA64\uBC84\uBA85 + \uC2A4\uD0C0\uC77C",
  "characterDesc": "\uD574\uB2F9 \uBA64\uBC84\uC758 \uD2B9\uC9D5\uC744 \uBC18\uC601\uD55C \uC131\uACA9 \uC124\uBA85",
  "styleTags": ["#\uADF8\uB8F9\uC2A4\uD0C0\uC77C", "#\uD3EC\uC9C0\uC158\uD0DC\uADF8", "#\uBA64\uBC84\uD615"],
  "memberName": "\uC2E4\uC81C \uBA64\uBC84 \uC774\uB984",
  "agency": "\uC18C\uC18D\uC0AC\uBA85"
}

\uB2F5\uBCC0\uC740 \uBC18\uB4DC\uC2DC \uC720\uD6A8\uD55C JSON \uD615\uC2DD\uC73C\uB85C\uB9CC \uC81C\uACF5\uD574\uC8FC\uC138\uC694.` : `Here are the answers to 8 KPOP idol aptitude analysis questions:

1. Stage presence: ${questionMapping.stagePresence[answers.stagePresence]}
2. Personality described by friends: ${questionMapping.friendsDescribe[answers.friendsDescribe]}
3. Approach to new projects: ${questionMapping.newProject[answers.newProject]}
4. What's important on stage: ${questionMapping.stageImportant[answers.stageImportant]}
5. Focus during practice: ${questionMapping.practiceStyle[answers.practiceStyle]}
6. Preferred dance style: ${questionMapping.danceStyle[answers.danceStyle]}
7. Fashion style: ${questionMapping.fashionStyle[answers.fashionStyle]}
8. Makeup style: ${questionMapping.makeupStyle[answers.makeupStyle]}

Based on these answers, generate a KPOP idol analysis result in the following JSON format:

{
  "groupName": "Actual KPOP group name",
  "position": "Main position (e.g., Leader, Main Vocalist, Main Dancer, Main Rapper, Visual)",
  "subPosition": "Sub position (optional)",
  "character": "Group name + Member name + Style",
  "characterDesc": "Personality description reflecting the member's characteristics",
  "styleTags": ["#GroupStyle", "#PositionTag", "#MemberType"],
  "memberName": "Actual member name",
  "agency": "Agency name"
}

Please provide the answer only in valid JSON format.`;
  return prompt;
}
__name(createAnalysisPrompt, "createAnalysisPrompt");
async function callLLMAnalysis(prompt) {
  try {
    console.log("\n=== LLM API \uD638\uCD9C ===");
    console.log("\u{1F4E4} \uC804\uC1A1\uD558\uB294 \uD504\uB86C\uD504\uD2B8:");
    console.log(prompt);
    console.log("=====================\n");
    const response = await fetch("https://icy-sun-4b5d.heroskyt87.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a KPOP expert analyst who knows all idol groups and members. Always respond with valid JSON format only." },
          { role: "user", content: prompt }
        ]
      })
    });
    console.log("\u{1F4E5} LLM API \uC751\uB2F5 \uC0C1\uD0DC:", response.status);
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("\u{1F4E5} LLM API \uC751\uB2F5 \uB370\uC774\uD130:");
    console.log(JSON.stringify(data, null, 2));
    let result;
    let responseText;
    if (data?.response) {
      responseText = data.response;
    } else if (typeof data === "object" && data !== null && data.groupName) {
      result = data;
    } else {
      throw new Error("Invalid LLM response format");
    }
    if (!result && responseText) {
      const jsonMatch = typeof responseText === "string" ? responseText.match(/\{[\s\S]*\}/) : null;
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else if (typeof responseText === "object") {
        result = responseText;
      } else {
        throw new Error("No valid JSON found in LLM response");
      }
    }
    if (!result) {
      throw new Error("Invalid LLM response format");
    }
    console.log("\u2705 \uD30C\uC2F1\uB41C LLM \uACB0\uACFC:");
    console.log(JSON.stringify(result, null, 2));
    console.log("===================\n");
    return result;
  } catch (error3) {
    console.error("\n\u274C LLM Analysis \uC624\uB958:", error3);
    console.log("\u{1F504} Fallback \uC2DC\uC2A4\uD15C \uD65C\uC131\uD654 \uC911...\n");
    throw error3;
  }
}
__name(callLLMAnalysis, "callLLMAnalysis");
function generateAnalysisResultFallback(quizAnswers) {
  let leaderScore = 0;
  let vocalScore = 0;
  let danceScore = 0;
  let rapScore = 0;
  let visualScore = 0;
  switch (quizAnswers.stagePresence) {
    case "center":
      visualScore += 3;
      break;
    case "leader":
      leaderScore += 3;
      break;
    case "performer":
      danceScore += 3;
      break;
    case "charisma":
      rapScore += 3;
      break;
  }
  switch (quizAnswers.friendsDescribe) {
    case "mood_maker":
      danceScore += 2;
      break;
    case "serious":
      leaderScore += 2;
      break;
    case "creative":
      vocalScore += 2;
      break;
    case "responsible":
      leaderScore += 2;
      break;
  }
  switch (quizAnswers.newProject) {
    case "execute":
      danceScore += 2;
      break;
    case "plan":
      leaderScore += 2;
      break;
    case "discuss":
      vocalScore += 2;
      break;
    case "think":
      visualScore += 2;
      break;
  }
  switch (quizAnswers.stageImportant) {
    case "expression":
      visualScore += 3;
      break;
    case "accuracy":
      danceScore += 3;
      break;
    case "vocal":
      vocalScore += 3;
      break;
    case "teamwork":
      leaderScore += 3;
      break;
  }
  switch (quizAnswers.practiceStyle) {
    case "vocal":
      vocalScore += 3;
      break;
    case "dance":
      danceScore += 3;
      break;
    case "direction":
      leaderScore += 3;
      break;
    case "care":
      leaderScore += 2;
      visualScore += 1;
      break;
  }
  switch (quizAnswers.danceStyle) {
    case "hiphop":
      rapScore += 3;
      break;
    case "contemporary":
      vocalScore += 2;
      break;
    case "powerful":
      danceScore += 3;
      break;
    case "cute":
      visualScore += 3;
      break;
  }
  switch (quizAnswers.fashionStyle) {
    case "street":
      rapScore += 1;
      break;
    case "chic":
      leaderScore += 1;
      break;
    case "lovely":
      visualScore += 1;
      break;
    case "trendy":
      danceScore += 1;
      break;
  }
  switch (quizAnswers.makeupStyle) {
    case "bold":
      rapScore += 1;
      break;
    case "elegant":
      leaderScore += 1;
      break;
    case "natural":
      visualScore += 1;
      break;
    case "retro":
      vocalScore += 1;
      break;
  }
  const scores = { leaderScore, vocalScore, danceScore, rapScore, visualScore };
  const maxScore = Math.max(...Object.values(scores));
  let positionType = "";
  let matchedMember = null;
  let matchedGroup = "";
  const getAllMembersWithPosition = /* @__PURE__ */ __name((positionKeywords) => {
    const allMatches = [];
    kpopGroupsData.groups.forEach((group3) => {
      group3.members.forEach((member) => {
        const hasPosition = member.position.some(
          (pos) => positionKeywords.some((keyword) => pos.includes(keyword))
        );
        if (hasPosition) {
          allMatches.push({ member, group: group3.name });
        }
      });
    });
    return allMatches;
  }, "getAllMembersWithPosition");
  if (scores.leaderScore === maxScore) {
    positionType = "Leader";
    const leaderMembers = getAllMembersWithPosition(["\uB9AC\uB354"]);
    if (leaderMembers.length > 0) {
      const selected = leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.vocalScore === maxScore) {
    positionType = "Main Vocalist";
    const vocalistMembers = getAllMembersWithPosition(["\uBA54\uC778 \uBCF4\uCEEC", "\uB9AC\uB4DC \uBCF4\uCEEC"]);
    if (vocalistMembers.length > 0) {
      const selected = vocalistMembers[Math.floor(Math.random() * vocalistMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.danceScore === maxScore) {
    positionType = "Main Dancer";
    const dancerMembers = getAllMembersWithPosition(["\uBA54\uC778 \uB304\uC11C", "\uB9AC\uB4DC \uB304\uC11C"]);
    if (dancerMembers.length > 0) {
      const selected = dancerMembers[Math.floor(Math.random() * dancerMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.rapScore === maxScore) {
    positionType = "Main Rapper";
    const rapperMembers = getAllMembersWithPosition(["\uBA54\uC778 \uB798\uD37C", "\uB9AC\uB4DC \uB798\uD37C"]);
    if (rapperMembers.length > 0) {
      const selected = rapperMembers[Math.floor(Math.random() * rapperMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else {
    positionType = "Visual";
    const visualMembers = getAllMembersWithPosition(["\uBE44\uC8FC\uC5BC", "\uC13C\uD130"]);
    if (visualMembers.length > 0) {
      const selected = visualMembers[Math.floor(Math.random() * visualMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  }
  if (!matchedMember || !matchedGroup) {
    matchedMember = kpopGroupsData.groups[0].members[0];
    matchedGroup = "BTS";
    positionType = "Leader";
  }
  const characterDescriptions = {
    "Leader": `${matchedMember?.name || "\uB9AC\uB354"}\uCC98\uB7FC \uD300\uC744 \uC774\uB044\uB294 \uCE74\uB9AC\uC2A4\uB9C8\uC640 \uB9AC\uB354\uC2ED\uC744 \uAC00\uC9C4 \uD0C0\uC785`,
    "Main Vocalist": `${matchedMember?.name || "\uBA54\uC778\uBCF4\uCEEC"}\uCC98\uB7FC \uC644\uBCBD\uD55C \uC74C\uC815\uACFC \uAC10\uC815 \uC804\uB2EC\uB85C \uCCAD\uC911\uC744 \uC0AC\uB85C\uC7A1\uB294 \uD0C0\uC785`,
    "Main Dancer": `${matchedMember?.name || "\uBA54\uC778\uB304\uC11C"}\uCC98\uB7FC \uB6F0\uC5B4\uB09C \uB304\uC2A4 \uC2E4\uB825\uACFC \uBB34\uB300 \uC7A5\uC545\uB825\uC744 \uAC00\uC9C4 \uD0C0\uC785`,
    "Main Rapper": `${matchedMember?.name || "\uBA54\uC778\uB798\uD37C"}\uCC98\uB7FC \uAC15\uB82C\uD55C \uB7A9\uACFC \uCE74\uB9AC\uC2A4\uB9C8\uB85C \uBB34\uB300\uB97C \uC9C0\uBC30\uD558\uB294 \uD0C0\uC785`,
    "Visual": `${matchedMember?.name || "\uBE44\uC8FC\uC5BC"}\uCC98\uB7FC \uB6F0\uC5B4\uB09C \uC678\uBAA8\uC640 \uB3C5\uD2B9\uD55C \uB9E4\uB825\uC744 \uAC00\uC9C4 \uD0C0\uC785`
  };
  const styleTags = [
    `#${matchedGroup}\uC2A4\uD0C0\uC77C`,
    `#${positionType.replace(" ", "")}`,
    `#${matchedMember?.name || "KPOP"}\uD615`
  ];
  return {
    groupName: matchedGroup,
    position: matchedMember?.position[0] || positionType,
    subPosition: matchedMember?.position[1] || "",
    character: `${matchedGroup} ${matchedMember?.name} \uC2A4\uD0C0\uC77C`,
    characterDesc: characterDescriptions[positionType] || "",
    styleTags,
    memberName: matchedMember?.name,
    agency: kpopGroupsData.groups.find((g) => g.name === matchedGroup)?.agency || ""
  };
}
__name(generateAnalysisResultFallback, "generateAnalysisResultFallback");
async function generateAnalysisResult(quizAnswers, language = "kr") {
  try {
    const prompt = createAnalysisPrompt(quizAnswers, language);
    const llmResult = await callLLMAnalysis(prompt);
    return {
      groupName: llmResult.groupName || "NewJeans",
      position: llmResult.position || "Main Vocalist",
      subPosition: llmResult.subPosition || "",
      character: llmResult.character || "NewJeans Hanni \uC2A4\uD0C0\uC77C",
      characterDesc: llmResult.characterDesc || "\uBC1D\uACE0 \uCE5C\uADFC\uD55C \uB9E4\uB825\uC73C\uB85C \uD32C\uB4E4\uC744 \uC0AC\uB85C\uC7A1\uB294 \uD0C0\uC785",
      styleTags: llmResult.styleTags || ["#NewJeans\uC2A4\uD0C0\uC77C", "#MainVocalist", "#Hanni\uD615"],
      memberName: llmResult.memberName || "Hanni",
      agency: llmResult.agency || "ADOR"
    };
  } catch (error3) {
    console.log("\u{1F4CB} Fallback \uBD84\uC11D \uC2DC\uC2A4\uD15C \uC0AC\uC6A9");
    return generateAnalysisResultFallback(quizAnswers);
  }
}
__name(generateAnalysisResult, "generateAnalysisResult");
var worker_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }
    try {
      if (path === "/api/stats" && request.method === "GET") {
        const result = await env2.DB.prepare(
          "SELECT COUNT(*) as count FROM analysis_results"
        ).first();
        const count3 = result?.count || 0;
        return new Response(JSON.stringify({ totalAnalyses: count3 }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/api/analyze" && request.method === "POST") {
        const formData = await request.formData();
        const sessionId = formData.get("sessionId") || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const quizAnswersRaw = formData.get("quizAnswers");
        const language = formData.get("language") || "kr";
        if (!quizAnswersRaw || quizAnswersRaw === "undefined") {
          throw new Error("Quiz answers are missing or undefined");
        }
        const quizAnswers = quizAnswersSchema.parse(JSON.parse(quizAnswersRaw));
        let photoData = null;
        const photoFile = formData.get("photo");
        if (photoFile && photoFile.size > 0) {
          console.log(`Photo received: ${photoFile.name}, size: ${photoFile.size} bytes`);
        }
        const result = await generateAnalysisResult(quizAnswers, language);
        const analysisData = {
          sessionId,
          photoData,
          quizAnswers: JSON.stringify(quizAnswers),
          language,
          groupName: result.groupName,
          position: result.position,
          subPosition: result.subPosition || null,
          character: result.character,
          characterDesc: result.characterDesc,
          styleTags: JSON.stringify(result.styleTags),
          memberName: result.memberName || null,
          agency: result.agency || null
        };
        const stmt = env2.DB.prepare(`
          INSERT INTO analysis_results (session_id, photo_data, quiz_answers, language, group_name, position, sub_position, character, character_desc, style_tags, member_name, agency, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        await stmt.bind(
          analysisData.sessionId,
          analysisData.photoData,
          analysisData.quizAnswers,
          analysisData.language,
          analysisData.groupName,
          analysisData.position,
          analysisData.subPosition,
          analysisData.character,
          analysisData.characterDesc,
          analysisData.styleTags,
          analysisData.memberName,
          analysisData.agency
        ).run();
        const response = {
          sessionId: analysisData.sessionId,
          ...result
        };
        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/api/results/") && request.method === "GET") {
        const sessionId = path.split("/").pop();
        if (!sessionId) {
          return new Response(JSON.stringify({ error: "Session ID is required" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const result = await env2.DB.prepare(
          `SELECT * FROM analysis_results WHERE session_id = ?`
        ).bind(sessionId).first();
        if (!result) {
          return new Response(JSON.stringify({ error: "Result not found" }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const parsedResult = {
          ...result,
          quizAnswers: result.quiz_answers ? JSON.parse(result.quiz_answers) : null,
          styleTags: result.style_tags ? JSON.parse(result.style_tags) : []
        };
        return new Response(JSON.stringify(parsedResult), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    } catch (error3) {
      console.error("Worker error:", error3);
      return new Response(JSON.stringify({
        error: "Internal server error",
        message: error3 instanceof Error ? error3.message : String(error3)
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-scheduled.ts
var scheduled = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  const url = new URL(request.url);
  if (url.pathname === "/__scheduled") {
    const cron = url.searchParams.get("cron") ?? "";
    await middlewareCtx.dispatch("scheduled", { cron });
    return new Response("Ran scheduled event");
  }
  const resp = await middlewareCtx.next(request, env2);
  if (request.headers.get("referer")?.endsWith("/__scheduled") && url.pathname === "/favicon.ico" && resp.status === 500) {
    return new Response(null, { status: 404 });
  }
  return resp;
}, "scheduled");
var middleware_scheduled_default = scheduled;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-y9Xass/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_scheduled_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-y9Xass/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
