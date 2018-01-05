// Description:
//   Memo one number
//
// Dependencies:
//   hubot-redis-brain
//
// Configuration:
//   None
//
// Commands:
//   hubot cozeny - return current number
//   hubot cozeny set <number> - set number
//   hubot cozeny add <number> - add number to memo
//   hubot cozeny sub <number> - substract number to memo

const userNameFrom = (msg) => {
  if (msg.message && msg.message.user && msg.message.user.name) {
    return `@${msg.message.user.name}`
  }
  return '@Unknown'
}

const dataForUser = (robot, userName) => {
  const data = robot.brain.data
  if (!data[userName]) {
    data[userName] = {}
  }
  return data[userName]
}

module.exports = function (robot) {
  robot.respond(/cozeny$/i, function (msg) {
    const userName = userNameFrom(msg)
    const data = dataForUser(robot, userName)
    if (data.cozeny) {
      msg.send(`${data.cozeny} です。`)
    } else {
      msg.send(`メモされた数字がないです。`)
    }
  })

  robot.respond(/cozeny set (\d+)/i, function (msg) {
    const userName = userNameFrom(msg)
    const data = dataForUser(robot, userName)
    const newNumber = parseInt(msg.match[1])

    data.cozeny = newNumber
    msg.send('新しい数字を設定しました。')
  })

  robot.respond(/cozeny add (\d+)/i, function (msg) {
    const userName = userNameFrom(msg)
    const data = dataForUser(robot, userName)
    const incNumber = parseInt(msg.match[1])

    data.cozeny += incNumber
    msg.send(`${incNumber}を足しました。現在は${data.cozeny}です。`)
  })

  robot.respond(/cozeny sub (\d+)/i, function (msg) {
    const userName = userNameFrom(msg)
    const data = dataForUser(robot, userName)
    const subNumber = parseInt(msg.match[1])

    data.cozeny -= subNumber
    msg.send(`${subNumber}を引きました。現在は${data.cozeny}です。`)
  })
}
