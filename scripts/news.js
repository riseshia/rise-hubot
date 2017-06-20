// Description:
//   Hubot's news. scrap news from 'news.erogame-tokuten.com'
//
// Dependencies:
//   None
//
// Configuration:
//   None

const $ = require('cheerio')

const room = 'general'

// Return history url 1 day ago
const targetUrl = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1) // need to get date manipulation support
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `http://news.erogame-tokuten.com/history/${year}-${month}-${day}`
}

const parsePerNews = (_i, news) => {
  const $news = $(news)
  const textRemovedCite = $news.html().replace('<cite>', ' *').replace('</cite>', '* ')
  const contents = $news.html(textRemovedCite).text()

  return '- ' + contents
}

const parseHtmlToAttachments = (htmlText) => {
  const $html = $(htmlText)
  const nodes = $html.find('.whats_new div:last-child')
  if (nodes.length === 0) {
    return '機能は新しいニュースがありませんでした。'
  }

  return nodes.map((_i, el) => {
    const $el = $(el)
    const newsText = $el.find('li').map(parsePerNews).get().join('\n')

    return {
      title: $el.find('a').text(),
      title_link: $el.find('a').attr('href'),
      text: newsText
    }
  }).get()
}

module.exports = function (robot) {
  robot.router.get('/news', (_req, res) => {
    robot.http(targetUrl()).get()((err, res, body) => {
      if (err || res.statusCode !== 200) {
        robot.messageRoom(room, `ニュースの処理中にエラーが発生しました。\n${err}`)
      } else {
        const data = {
          text: '昨日のニュースまとめです。',
          attachments: parseHtmlToAttachments(body)
        }
        robot.messageRoom(room, data)
      }
    })

    res.send('OK')
  })
}
