-- Main client file that coordinates all modules
local UI = require '@desync-hud/client/modules/ui'
local Player = require '@desync-hud/client/modules/player'
local State = require '@desync-hud/client/modules/state'
local Vehicle = require '@desync-hud/client/modules/vehicle'
local Utils = require '@desync-hud/client/modules/utils'
local Notifications = require '@desync-hud/client/modules/notifications'

-- Initialize modules
UI.init()
Player.init()
Vehicle.init()


