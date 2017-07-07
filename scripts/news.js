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
const blacklist = (() => {
  const env = process.env.NEWS_BLACKLIST
  if (env) {
    return env.split('|')
  } else {
    return []
  }
})()

const yesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1) // need to get date manipulation support
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

// Return history url 1 day ago
const targetUrl = () => {
  return `http://news.erogame-tokuten.com/history/${yesterday()}`
}

const parsePerNews = (_i, news) => {
  const $news = $(news)
  const textRemovedCite = $news.html().replace('<cite>', ' *').replace('</cite>', '* ')
  const contents = $news.html(textRemovedCite).text()

  return '- ' + contents
}

const parseHtmlToAttachments = (nodes) => {
  return nodes.map((_i, el) => {
    const $el = $(el)
    const newsText = $el.find('li').map(parsePerNews).get().join('\n')
    const companyName = $el.find('a').text()
    if (blacklist.indexOf(companyName) !== -1) {
      return null
    }

    return {
      title: companyName,
      title_link: $el.find('a').attr('href'),
      text: newsText,
      mrkdwn_in: ['text']
    }
  }).get().filter(el => el !== null)
}

module.exports = function (robot) {
  robot.router.get('/news', (_req, res) => {
    robot.http(targetUrl()).get()((err, rres, body) => {
      if (err || rres.statusCode !== 200) {
        robot.messageRoom(room, `ニュースの処理中にエラーが発生しました。\n${err}`)
        return
      }

      const $html = $(body)
      const nodes = $html.find('.whats_new div:last-child')
      if (nodes.length === 0) {
        robot.messageRoom(room, '昨日は新しいニュースがありませんでした。')
        return
      }

      const data = {
        text: `昨日のニュースまとめです。\n${targetUrl()}`,
        attachments: parseHtmlToAttachments(nodes)
      }
      robot.messageRoom(room, data)
    })
    res.send('OK')
  })
}
