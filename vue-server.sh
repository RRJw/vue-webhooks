#!/bin/bash
WORK_PATH='/data/Honor-of-Kings/server/'
cd $WORK_PATH
echo '先清除老代码'
git reset --hard origin/master
git clean -f
echo '拉取最新代码'
git pull origin master
echo '开始执行构建'
docker build -t vue-server .
echo '停止旧容器并删除'
docker stop vue-server-container
docker rm vue-server-container
echo '启动新容器'
docker container run -p 3000:3000 --name vue-server-container -d vue-server