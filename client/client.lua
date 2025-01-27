-- Main client file that coordinates all modules
local UI = require '@desync-hud/client/modules/ui'
local Player = require '@desync-hud/client/modules/player'
-- local State = require '@desync-hud/client/modules/state'
local Vehicle = require '@desync-hud/client/modules/vehicle'
-- local Utils = require '@desync-hud/client/modules/utils'
-- local Notifications = require '@desync-hud/client/modules/notifications'

-- Initialize modules
UI.init()
Player.init()
Vehicle.init()

-- RegisterCommand('sendNotification', function(source, args, raw)
--     local data = {
--         title = "Test Notification",
--         message = "This is a test notification",
--         duration = 10000
--     }
--     Desync.Core.SendNotification(source, data, "default")
-- end, false)

-- local isCrawling = false

-- AddEventHandler('desync:playerUnconscious', function()
--     print('desync:playerUnconscious')
--     -- Allow crawling for 15 seconds
--     local crawlTime = 15
--     isCrawling = true
--     -- SetEntityHealth(PlayerPedId(), 20)
--     TriggerEvent('desync:startCrawlingAnimation') -- Start crawling animation

--     CreateThread(function()
--         while crawlTime > 0 do
--             Wait(1000)
--             crawlTime = crawlTime - 1
--             -- Lock player controls while crawling
--             DisableControlAction(0, 21, true) -- Disable sprint
--             DisableControlAction(0, 22, true) -- Disable jump
--             DisableControlAction(0, 23, true) -- Disable enter vehicle
--             -- Add more controls to disable as needed
--         end

--         -- After crawling, show unconscious screen
--         isCrawling = false
--         TriggerEvent('desync:stopCrawlingAnimation') -- Stop crawling animation
--         Utils.sendReactMessage('setUnconscious', true)
--     end)
-- end)

-- RegisterNUICallback('transportToHospital', function(_, cb)
--     -- Handle transport logic here
--     Utils.sendReactMessage('setUnconscious', false)
--     cb({})
-- end)

-- -- Function to start crawling animation
-- AddEventHandler('desync:startCrawlingAnimation', function()
--     ClearPedTasks(PlayerPedId())
--     print('desync:startCrawlingAnimation')
--     local playerPed = PlayerPedId()
--     RequestAnimDict('move_crawl')
--     RequestAnimDict('move_crawlprone2crawlfront')
--     while not HasAnimDictLoaded('move_crawl') do
--         Wait(100)
--     end
--     print('desync:startCrawlingAnimation: TaskPlayAnim')
--     local playerCoords = GetEntityCoords(playerPed)
--     TaskPlayAnimAdvanced(playerPed, 'move_crawlprone2crawlfront', 'left', playerCoords.x, playerCoords.y, playerCoords.z, 0.0, 0.0, GetEntityHeading(playerPed), 2.0, 2.0, -1, 2, 0.1, false, false)
--     -- ChangeHeadingSmooth(playerPed, -10.0, 300)
--     -- TaskPlayAnim(playerPed, 'move_crawl', 'fwd', 8.0, 8.0, -1, 1, 1.0, false, false, false)
-- end)

-- -- Function to stop crawling animation
-- AddEventHandler('desync:stopCrawlingAnimation', function()
--     local playerPed = PlayerPedId()
--     ClearPedTasksImmediately(playerPed)
-- end)


