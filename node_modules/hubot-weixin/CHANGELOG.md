* 2016-03-12: add new script for reminding actions
  - TODO: store the actions of brain to redis
* 2016-04-11: add higher accuracy timer for webSync, syncCheck
  - Notice some time the native setInterval is not accuracy
  - Use the nanotimer to replace setInterval
* 2016-05-09: Refactor websync to async, boost performance
* 2016-05-28: Fix the upload media interface change in Weixin
  - minor code refactor
  - add fileMd5 in the upload media request
  - emphasize the upload server url(file/file2)
  - publish to NPM as v1.0.5
* 2016-05-29: Support send media to specific person instead of only to group
  - minor code refactor
  - publish to NPM as v1.0.6