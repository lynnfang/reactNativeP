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

if (__DEV__) {
  ReactNativeRender = require('../../node_modules/react-native/Libraries/Renderer/oss/ReactNativeRenderer-dev');
} else {
  ReactNativeRender = require('../../node_modules/react-native/Libraries/Renderer/oss/ReactNativeRenderer-prod');
}

export function AppContainMonitor(){
  ReactNativeRender.ProfilerSwitch = true;
  ReactNativeRender.upperThesholdTime = 0;
  ReactNativeRender.setNotAnalyzeClass = true;
  ReactNativeRender.notAnalyzeClass = [];//没有过滤
  AppContainer.prototype.render = hookOutput(AppContainer.prototype.render, profilerReturn);
}

function profilerReturn(_output){
  const Profiler = React.unstable_Profiler;
  return (<Profiler onRender={this.logProfiler} id="AppContainer">{_output}</Profiler>);
}

logProfiler = (
  ProfilerId,
  Phase,
  ActualTime,
  Basetime,
  StartTime,
  CommitTime,
  ProfilerComponentNames
) => {
  var monitorObj;
  if (ProfilerComponentNames instanceof Array){//避免 react native 没有同步更新的话，获取的参数有问题
    monitorObj = {
      t:Phase,
      a:ActualTime,
      b:Basetime,
      p:ProfilerComponentNames
    };
  }
  else{
     monitorObj = {
       t:Phase,
       a:ActualTime,
       b:Basetime,
       p:""
     };
   }
   console.log(monitorObj);
}

//在方法执行之前 hook
function withHookBefore (originalFn, hookFn) {
   return function () {
     if (hookFn.apply(this, arguments) === false) {
        return;
     }
     return originalFn.apply(this, arguments);
    }
}

//在方法执行之后 hook
function withHookAfter (originalFn, hookFn) {
    return function () {
       var output = originalFn.apply(this, arguments);
       hookFn.apply(this, arguments)
       if (output != undefined)
         return output;
       else
         return this;
     }
}

//hook 参数
function hookArgs (originalFn, argsGetter) {
   return function () {
     var _args = argsGetter.apply(this, arguments);
     if (Array.isArray(_args)) {
       for (var i = 0; i < _args.length; i++)
          arguments[i] = \_args[i];
     }
     return originalFn.apply(this, arguments);
   }
}

//hook return
 function hookOutput (originalFn, outputGetter) {
    return function () {
      var _output = originalFn.apply(this, arguments);
      return outputGetter(_output);
    }
}

```
### 在需要监控的项目入口调用 AppContainMonitor()即可。
