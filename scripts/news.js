// Description:
//   Hubot's news. scrap news from 'news.erogame-tokuten.com'
//
// Dependencies:
//   None
//
// Configuration:
//   None

const cheerio = require('cheerio')

const room = 'general'

const targetUrl = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1) // need to get date manipulation support
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `http://news.erogame-tokuten.com/history/${year}-${month}-${day}`
}

const parseHtml = (htmlText) => {
  const $ = cheerio.load(htmlText)
  const nodes = $('.whats_new div:last-child')
  if (nodes.length === 0) {
    return '機能は新しいニュースがありませんでした。'
  }

  return nodes.map((_i, el) => {
    const $el = $(el)
    const companyName = $el.find('a').text()
    const newsText = $el.find('li').map((_i, news) => {
      const textRemovedCite = $(news).html().replace('<cite>', '*').replace('</cite>', '*')
      const contents = $(news).html(textRemovedCite).text()

      return '- ' + contents
    }).get().join('\n')
    return `${companyName}\n${newsText}`
  }).get().join('\n')
}

module.exports = function (robot) {
  robot.router.get('/news', (_req, res) => {
    console.log(targetUrl())
    robot.http(targetUrl()).get()((err, res, body) => {
      if (err || res.statusCode !== 200) {
        robot.messageRoom(
          room,
          `ニュースの処理中にエラーが発生しました。\n${err}`
        )
      } else {
        robot.messageRoom(room, parseHtml(body))
      }
    })
    res.send('OK')
  })
}
