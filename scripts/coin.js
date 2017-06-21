// Description:
//   Help decide between two things
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot coin - Gives you heads or tails

const thecoin = ['表面が出ました。', '裏面が出ました。']

module.exports = robot => {
  robot.respond(/coin/i, (msg) => {
    msg.reply(msg.random(thecoin))
  })
}
