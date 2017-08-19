# node.js deps
fs   = require 'fs'

# app deps
yaml = require 'js-yaml'

config = fs.readFileSync './node_modules/hubot-weixin/config.yaml' , 'utf8'
module.exports = yaml.load config