// Description:
//   Hubot's commute. say hello/goodbye
//
// Dependencies:
//   None
//
// Configuration:
//   None

const room = 'general'

module.exports = function (robot) {
  robot.router.get('/commute/hello', (_req, res) => {
    robot.messageRoom(room, 'おはようございます。今日も元気にいきましょう！')
    res.send('OK')
  })

  robot.router.get('/commute/goodbye', (_req, res) => {
    robot.messageRoom(room, '明日が、今日よりもずっと、ずっと、素敵な日になりますようにって。。。私は、祈ってます。')
    res.send('OK')
  })
}
