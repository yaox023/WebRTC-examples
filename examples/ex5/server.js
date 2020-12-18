var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });

/**
 * 只有两个用户 A 和 B
 */
let userA;
let userB;

wss.on("connection", function (connection) {

  if (!userA) {
    userA = connection;
    console.log("userA connnected");
  } else if (!userB) {
    userB = connection;
    console.log("userB connnected");
  } else {
    connection.send(JSON.stringify({
      type: "fail",
      content: "最多两个用户"
    }));
  }

  connection.on("message", function (message) {

    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.log("json parse error: ", error, message);
      return;
    }

    console.log("got client message: ", data.type);

    switch (data.type) {

      /*
        client 发来 callee 和 offer，表示连接请求
      */
      case "offer":
        if (connection === userA) {
          userB.send(JSON.stringify({
            type: "offer",
            content: data.content
          }));
        } else {
          userA.send(JSON.stringify({
            type: "offer",
            content: data.content
          }));
        }
        break;

      case "answer":
        if (connection === userA) {
          userB.send(JSON.stringify({
            type: "answer",
            content: data.content
          }));
        } else {
          userA.send(JSON.stringify({
            type: "answer",
            content: data.content
          }));
        }
        break;

      case "candidate":
        if (connection === userA) {
          userB.send(JSON.stringify({
            type: "candidate",
            content: data.content
          }));
        } else {
          userA.send(JSON.stringify({
            type: "candidate",
            content: data.content
          }));
        }
        break;

      default:
        connection.send(JSON.stringify({
          type: "unknow message type",
        }));
    }
  });

  connection.on("close", function () {
    if (connection === userA) {
      userA = undefined;
      console.log("userA disconnnected");
    } else {
      userB = undefined;
      console.log("userB disconnnected");
    }
  });
});