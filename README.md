FingerBangWebApp
================

### 关于solr的命令行操作

* 生成新的配置文件 rails generate sunspot_rails:install
* 开发模式下启动solr bundle exec rake sunspot:solr:start
* 开发模式下关闭solr bundle exec rake sunspot:solr:stop


### 评论功能方法的使用

项目中有一个Reply的model，这张数据表就是作为记录评论数据的。若需要为某个模块创建评论，有两种方式：

1. 直接调用Web借口

    ```JavaScript
        $http({
            url: "/replies",
            method: "POST",
            data: {
                item_id: $routeParams.topic_id,
                reply_body: $scope.reply_body,
                replier: User.get_current_user(),
                type:"Topic"
            }
        })
    ```
2. 在服务端代码中直接掉用Reply model 下的创建方法

    ```ruby
        Reply.create_reply_for_item(user,reply_body,item_topic_id,type)
    ```

评论信息查询：

1. 查找回复的评论

    ```ruby
        Reply.find_all_replies_for(item_topic_id,type,num)
        #num为数量，最新的num条信息，若为nil则返回所有的回复信息
    ```
    
    或者调用Web接口
    
    ```JavaScript
        $http({
            url: "/replies.json?type=Topic&item_id=" + $routeParams.topic_id,
            method: "GET"
        })
    ```

2. 评论信息

    ```ruby
        Reply.find_reply_info_for_item(type,item_id)
        #其返回值为Hash,如下示：
        {
              last_user_id:replies.first()[:replier],
              last_reply_date:replies.first()[:created_at],
              total_number:replies.length
          }

    ```
具体使用可参考吐槽模块
