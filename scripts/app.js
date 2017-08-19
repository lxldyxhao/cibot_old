var WxBot, log, wx, times = 0, ERHA, connection;
var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hubot',
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000
};

WxBot = require('../node_modules/hubot-weixin/src/wxbot');
log = require('../node_modules/hubot-weixin/src/wxLog');
var mysql = require('mysql');
var async = require("async");
var robot2;
module.exports = function (robot) {
    return robot.hear(/update friend list/i, function (msg) {
        robot2 = robot;
        return ERHA(msg);
    });
};
ERHA = function (msg) {
    times++;
    /**
     * 获取并保存微信联系人
     */
    if (true){
        wx = new WxBot();
        wx.getInit();

        wx.updateGroupList();
        wx.updateGroupMemberList();
        wx.updateFriendList();
        /**
         * 发送到微信
         */
        console.log('--------------------------' + wx.json + '----------------------------');
        saveContact(wx.json);
    }
};

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);

    connection.connect(function (err) {
        // The server is either down
        // or restarting
        if (err) {
            // We introduce a delay before attempting to reconnect,
            // to avoid a hot loop, and to allow our node script to
            // process asynchronous requests in the meantime.
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

function _getNewSqlParamEntity(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
}

function execTrans(sqlparamsEntities, callback) {
    // pool.getConnection(function (err, connection) {
    //     if (err) {
    //         return callback(err, null);
    //     }
    handleDisconnect();
    connection.beginTransaction(function (err) {
        if (err) {
            return callback(err, null);
        }
        console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
        var funcAry = [];
        sqlparamsEntities.forEach(function (sql_param) {
            var temp = function (cb) {
                var sql = sql_param.sql;
                var param = sql_param.params;
                connection.query(sql, param, function (tErr, rows, fields) {
                    if (tErr) {
                        connection.rollback(function () {
                            console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                            throw tErr;
                        });
                    } else {
                        return cb(null, 'ok');
                    }
                })
            };
            funcAry.push(temp);
        });

        async.series(funcAry, function (err, result) {
            console.log("transaction error: " + err);
            if (err) {
                connection.rollback(function (err) {
                    console.log("transaction error: " + err);
                    // connection.release();
                    connection.end();
                    return callback(err, null);
                });
            } else {
                connection.commit(function (err, info) {
                    console.log("transaction info: " + JSON.stringify(info));
                    if (err) {
                        console.log("执行事务失败，" + err);
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            // connection.release();
                            connection.end();
                            return callback(err, null);
                        });
                    } else {
                        // connection.release();
                        connection.end();
                        return callback(null, info);
                    }
                })
            }
        })
    });
    // });
}

function saveContact(jsonData) {
    var sqlParamsEntity = [];
    var member, _i, _len, _ref, jsonBody;
    jsonBody = JSON.parse(jsonData);
    if (jsonBody.MemberCount > 0) {
        _ref = jsonBody.MemberList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            member = _ref[_i];
            console.log('---------------------当前' + member['NickName'] + '------------------------------------\n\n');


            sql_0 = 'INSERT  INTO contact ' +
                '(NickName,UserName,HeadImgUrl,ContactFlag,MemberCount,' +
                'MemberList,RemarkName,HideInputBarFlag,Sex,Signature,VerifyFlag,OwnerUin,' +
                'PYInitial,PYQuanPin,RemarkPYInitial,RemarkPYQuanPin,StarFriend,AppAccountFlag,' +
                'Statues,AttrStatus,Province,City,Alias,SnsFlag,UniFriend,DisplayName,ChatRoomId,' +
                'KeyWord,EncryChatRoomId,IsOwner)' +
                'VALUES(?,?,?,?,?      ,?,?,?,?,?,        ?,?,?,?,?       ,?,?,?,?,?      ,?,?,?,?,?       ,?,?,?,?,?)' +
                'on  DUPLICATE KEY ' +
                'UPDATE ' +
                'UserName=?,HeadImgUrl=?,ContactFlag=?,MemberCount=?,' +
                'MemberList=?,RemarkName=?,HideInputBarFlag=?,Sex=?,Signature=?,VerifyFlag=?,OwnerUin=?,' +
                'PYInitial=?,PYQuanPin=?,RemarkPYInitial=?,RemarkPYQuanPin=?,StarFriend=?,AppAccountFlag=?,' +
                'Statues=?,AttrStatus=?,Province=?,City=?,Alias=?,SnsFlag=?,UniFriend=?,DisplayName=?,ChatRoomId=?,' +
                'KeyWord=?,EncryChatRoomId=?,IsOwner=? ';

            arr_0 = [
                // insert
                member['NickName'],member['UserName'], member['HeadImgUrl'], member['ContactFlag'], member['MemberCount'],
                member['MemberList'].toString(), member['RemarkName'], member['HideInputBarFlag'], member['Sex'], member['Signature'],
                member['VerifyFlag'], member['OwnerUin'], member['PYInitial'], member['PYQuanPin'], member['RemarkPYInitial'],
                member['RemarkPYQuanPin'], member['StarFriend'], member['AppAccountFlag'], member['Statues'], member['AttrStatus'],
                member['Province'], member['City'], member['Alias'], member['SnsFlag'],
                member['UniFriend'], member['DisplayName'], member['ChatRoomId'], member['KeyWord'], member['EncryChatRoomId'],
                member['IsOwner'],
                // update
                member['UserName'], member['HeadImgUrl'], member['ContactFlag'], member['MemberCount'],
                member['MemberList'].toString(), member['RemarkName'], member['HideInputBarFlag'], member['Sex'], member['Signature'],
                member['VerifyFlag'], member['OwnerUin'], member['PYInitial'], member['PYQuanPin'], member['RemarkPYInitial'],
                member['RemarkPYQuanPin'], member['StarFriend'], member['AppAccountFlag'], member['Statues'], member['AttrStatus'],
                member['Province'], member['City'], member['Alias'], member['SnsFlag'],
                member['UniFriend'], member['DisplayName'], member['ChatRoomId'], member['KeyWord'], member['EncryChatRoomId'],
                member['IsOwner']
            ];
            sqlParamsEntity.push(_getNewSqlParamEntity(sql_0, arr_0));

        }
    }


    execTrans(sqlParamsEntity, function (err, info) {
        if (err) {
            console.log(err);
            console.error("事务执行失败");
            console.log('result:', '主人,我搞砸了');

            return false;
        } else {
            console.log("done.");
            console.log('result', '主人,我做好了');
            send_to_user(robot2, "梁旭磊", "主人我完成了");
            return true;
        }
    })


}

function send_to_user(robot2, nickname, msg) {
    var sql = "SELECT UserName FROM contact WHERE NickName = ? ";
    var arr = [nickname];
    handleDisconnect();

    connection.query(sql, arr, function (err, rows, fields) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
        }
        usr = rows[0];
        // data = usr.UserName;
        console.log('--------------------------send_to_user----------------------------');
        console.log(usr.UserName);
        console.log('------------------------------------------------------------\n\n');

        var response = new robot.Response(robot2, {user: {name: usr.UserName, room: null}}, []);
        response.send(msg);


    });


    connection.end();


}
