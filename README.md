## reactNativeP
-  react native v0.57.8 版本增加性能监控，包括方法运行时间监控和增加 Profiler 监控的组件信息

使用方法

```

import React from "react";
const AppContainer = require('AppContainer');
let ReactNativeRender;

/**
 ProfilerSwitch:false,//添加的监控代码
 upperThesholdTime:20,//方法运行时间
 setNotAnalyzeClass,//使用设置监控过滤的方法
 notAnalyzeClass:[],//方法监控过滤的方法
**/

if (\__DEV__) {
&nbsp;&nbsp; ReactNativeRender = require('../../node_modules/react-native/Libraries/Renderer/oss/ReactNativeRenderer-dev');
} else {
&nbsp;&nbsp;ReactNativeRender = require('../../node_modules/react-native/Libraries/Renderer/oss/ReactNativeRenderer-prod');
}

export function AppContainMonitor(){
&nbsp;&nbsp; ReactNativeRender.ProfilerSwitch = true;
&nbsp;&nbsp; ReactNativeRender.upperThesholdTime = 0;
&nbsp;&nbsp; ReactNativeRender.setNotAnalyzeClass = true;
&nbsp;&nbsp; ReactNativeRender.notAnalyzeClass = [];//没有过滤
&nbsp;&nbsp; AppContainer.prototype.render = hookOutput(AppContainer.prototype.render, profilerReturn);
}

function profilerReturn(\_output){
&nbsp;&nbsp; const Profiler = React.unstable_Profiler;
&nbsp;&nbsp; return (<Profiler onRender={this.logProfiler} id="AppContainer">{\_output}</Profiler>);
}

logProfiler = (
 &nbsp;&nbsp; ProfilerId,
 &nbsp;&nbsp; Phase,
 &nbsp;&nbsp; ActualTime,
 &nbsp;&nbsp; Basetime,
 &nbsp;&nbsp; StartTime,
 &nbsp;&nbsp; CommitTime,
 &nbsp;&nbsp; ProfilerComponentNames
 ) => {
 &nbsp;&nbsp; var monitorObj;
 &nbsp;&nbsp; if (ProfilerComponentNames instanceof Array){//避免 react native 没有同步更新的话，获取的参数有问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; monitorObj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; t:Phase,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a:ActualTime,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; b:Basetime,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; p:ProfilerComponentNames
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; };
&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp; else{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; monitorObj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; t:Phase,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a:ActualTime,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; b:Basetime,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; p:""
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; };
&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp; console.log(monitorObj);
 }

//在方法执行之前 hook
function withHookBefore (originalFn, hookFn) {
&nbsp;&nbsp;&nbsp;&nbsp; return function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if (hookFn.apply(this, arguments) === false) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return originalFn.apply(this, arguments);
&nbsp;&nbsp;&nbsp;&nbsp; }
 }

//在方法执行之后 hook
function withHookAfter (originalFn, hookFn) {
&nbsp;&nbsp;&nbsp;&nbsp; return function () {
&nbsp;&nbsp;&nbsp;&nbsp; var output = originalFn.apply(this, arguments);
&nbsp;&nbsp;&nbsp;&nbsp; hookFn.apply(this, arguments)
&nbsp;&nbsp;&nbsp;&nbsp; if (output != undefined)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return output;
&nbsp;&nbsp;&nbsp;&nbsp; else
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return this;
&nbsp;&nbsp;&nbsp;&nbsp; }
 }

//hook 参数
 function hookArgs (originalFn, argsGetter) {
&nbsp;&nbsp;&nbsp;&nbsp; return function () {
&nbsp;&nbsp;&nbsp;&nbsp; var \_args = argsGetter.apply(this, arguments);
&nbsp;&nbsp;&nbsp;&nbsp; if (Array.isArray(\_args)) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; for (var i = 0; i < \_args.length; i++)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; arguments[i] = \_args[i];
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp;&nbsp;&nbsp; return originalFn.apply(this, arguments);
&nbsp;&nbsp;&nbsp;&nbsp; }
 }

//hook return
 function hookOutput (originalFn, outputGetter) {
&nbsp;&nbsp;&nbsp;&nbsp; return function () {
&nbsp;&nbsp;&nbsp;&nbsp; var \_output = originalFn.apply(this, arguments);
&nbsp;&nbsp;&nbsp;&nbsp; return outputGetter(\_output);
&nbsp;&nbsp;&nbsp;&nbsp; }
 }

```
### 在需要监控的项目入口调用 AppContainMonitor()即可。
