# Description:
#   None
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   right, hubot
#
# Author:
#   maxgoedjen

import os

from scripts.hubot_script import *

class RightHubot1(HubotScript):
    
    @hear('right1(,)? hubot')
    def right1(self, message, matches):
        return 'Yep1.'
