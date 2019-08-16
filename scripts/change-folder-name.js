'use strict';

var fs=require('fs');
const path = require('path');
const process = require('process');
var currentPath = process.cwd();
function copyDirs(srcDir, dstDir){
    var fileCount = 0;//统计所有的文件个数，写的个数应该跟读的个数一样
    fs.readdir(srcDir, function(err,paths){
        if(!err){//如果没有错误，则copy
            paths.forEach(function(path){
                fileCount=fileCount+1;
                fs.stat(srcDir+"/"+path, function(err, stats) {
                    if(stats.isDirectory()){
                        //创建目录,如果err，则返回错误
                        fs.mkdir(dstDir+"/"+path, { recursive: true }, (err) => {
                            if(err){
                                return false;
                            }
                        });
                        //拷贝文件夹到react-native
                        if(!copyDirs(srcDir+"/"+path, dstDir+"/"+path)){
                            return false;
                        }
                    }
                    else{//文件
                        fs.copyFile(srcDir+"/"+path, dstDir+"/"+path,function(err){
                            if(err)
                                return false;
                        });
                    }
                  });
            });
        }
        else
            return false;
    });
    return true;
}

function replaceRenderFile(srcFile, dstFile){
    fs.copyFileSync(dstFile, dstFile+".bak");//备份
    fs.copyFileSync(srcFile, dstFile);//拷贝失败不会造成其它影响，就是不会有监控数据
}

function copyToReactNative(srcDir, dstDir){
    console.log(currentPath);
    const packageName = 'package.json';
    var count = 0;
    if(!fs.existsSync(dstDir)){
        while(!fs.existsSync(srcDir) && count < 100000){
        count = count + 1;
        }
        if(fs.existsSync(srcDir)){
            fs.mkdir(dstDir, { recursive: true }, (err) => {
            if(!err){//react-native dir create success
                if(!copyDirs(srcDir, dstDir)){
                    if(fs.existsSync(dstDir))
                        fs.rmdirSync(dstDir);//回滚
                }
            }
            else
                console.log("nothing to do")
            });
        }
    }
    else{//react-native dir is already exist
        var packageObj = require(dstDir+'/'+packageName);
        if(packageObj.name!=='react-native-p'){
            if(packageObj.version.indexOf('0.57.8')>-1){
                var renderFiles = ['/Libraries/Renderer/oss/ReactNativeRenderer-dev.js','/Libraries/Renderer/oss/ReactNativeRenderer-prod.js'];
                renderFiles.forEach(function(eachRenderFile){
                    fs.readFile(eachRenderFile, function(err, data){
                        fs.readFile(dstDir+eachRenderFile, (err, data) => {
                            if(!err){//err为null
                                if(data.indexOf('ProfilerSwitch:false')<0){//没有找到
                                    //备份文件、删除文件、copy文件，失败回滚
                                    replaceRenderFile(srcDir+'/'+eachRenderFile, dstDir+'/'+eachRenderFile);
                                }
                                else
                                    console.log(eachRenderFile+ ":nothing to do")
                            }
                        });
                    });
                });
            }
            else
                console.log("nothing to do")
        }
        else
            console.log("nothing to do")
    }
}

copyToReactNative(currentPath, currentPath + '/../react-native')