// Description:
//   Hubot's pomodoro timer
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot start pomo - start a new pomodoro
//   hubot start pomo <time> - start a new pomodoro with a duration of <time> minutes
//   hubot stop pomo - stop a pomodoro
//   hubot pomo? - shows the details of the current pomodoro
//   hubot total pomos - shows the number of the total completed pomodoros
//
// Author:
//   mcollina

let currentPomodoro = null;

const defaultLength = 25;

module.exports = function(robot) {
  var base;
  (base = robot.brain.data).pomodoros || (base.pomodoros = 0);
  robot.respond(/start pomo ?(\d+)?/i, function(msg) {
    if (currentPomodoro != null) {
      msg.send("ポモドーロの途中です。");
      return;
    }
    currentPomodoro = {};
    currentPomodoro.func = function() {
      msg.send("ポモドーロが終わりました。お疲れ様です。");
      currentPomodoro = null;
      return robot.brain.data.pomodoros += 1;
    };
    currentPomodoro.time = new Date();
    currentPomodoro.length = defaultLength;
    if (msg.match[1] != null) {
      currentPomodoro.length = parseInt(msg.match[1]);
    }
    msg.send("ポモドーロが始まりました。");
    return currentPomodoro.timer = setTimeout(currentPomodoro.func, currentPomodoro.length * 60 * 1000);
  });
  robot.respond(/pomo\?/i, function(msg) {
    var minutes;
    if (currentPomodoro == null) {
      msg.send("ポモドーロの途中ではありません。");
      return;
    }
    minutes = currentPomodoro.time.getTime() + currentPomodoro.length * 60 * 1000;
    minutes -= new Date().getTime();
    minutes = Math.round(minutes / 1000 / 60);
    return msg.send("まだ" + minutes + "分が残っています。");
  });
  robot.respond(/stop pomo/i, function(msg) {
    if (currentPomodoro == null) {
      msg.send("ポモドーロの途中ではありません。");
      return;
    }
    clearTimeout(currentPomodoro.timer);
    currentPomodoro = null;
    return msg.send("ポモドーロが中止されました。");
  });

  return robot.respond(/total pomos/i, function(msg) {
    return msg.send("You have completed " + robot.brain.data.pomodoros + " pomodoros");
  });
};
