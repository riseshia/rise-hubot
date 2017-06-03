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

let currentPomodoro = {}

const defaultLength = 25

const userNameFrom = (msg) => {
  if (msg.message && msg.message.user && msg.message.user.name) {
    return `@${msg.message.user.name}`
  }
  return '@Unknown'
}

module.exports = function (robot) {
  robot.hear(/.*/i, function (msg) {
    const userName = userNameFrom(msg)
    const userPomodoro = currentPomodoro[userName]
    if (userPomodoro && !msg.message.text.includes('pomo')) {
      msg.send(`${userName}さん、ポモドーロの最中は集中してください。`)
    }
  })

  robot.respond(/start pomo ?(\d+)?/i, function (msg) {
    const userName = userNameFrom(msg)
    if (currentPomodoro[userName]) {
      msg.send('ポモドーロの途中です。')
      return
    }
    const userPomodoro = {}
    userPomodoro.func = function () {
      msg.send(`${userName}さん、ポモドーロが終わりました。お疲れ様です。`)
      currentPomodoro[userName] = null
    }
    userPomodoro.time = new Date()
    userPomodoro.length = defaultLength
    if (msg.match[1]) {
      userPomodoro.length = parseInt(msg.match[1])
    }
    currentPomodoro[userName] = userPomodoro
    msg.send(`${userName}さんのポモドーロが始まりました。`)

    userPomodoro.timer = setTimeout(userPomodoro.func, userPomodoro.length * 60 * 1000)
    return userPomodoro.timer
  })

  robot.respond(/pomo\?/i, function (msg) {
    let minutes
    const userName = userNameFrom(msg)
    const userPomodoro = currentPomodoro[userName]
    if (!userPomodoro) {
      msg.send(`${userName}さんはポモドーロの途中ではありませんよ？`)
      return
    }
    minutes = userPomodoro.time.getTime() + userPomodoro.length * 60 * 1000
    minutes -= new Date().getTime()
    minutes = Math.round(minutes / 1000 / 60)
    return msg.send(`まだ${minutes}分が残っています。`)
  })

  robot.respond(/stop pomo/i, function (msg) {
    const userName = userNameFrom(msg)
    const userPomodoro = currentPomodoro[userName]
    if (!userPomodoro) {
      msg.send(`${userName}さんはポモドーロの途中ではありませんよ？`)
      return
    }
    clearTimeout(userPomodoro.timer)
    currentPomodoro[userName] = null
    return msg.send('ポモドーロが中止されました。')
  })
}
