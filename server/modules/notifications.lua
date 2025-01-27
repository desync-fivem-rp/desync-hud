RegisterNetEvent('desync-hud:server:ShowNotification')
AddEventHandler('desync-hud:server:ShowNotification', function(source, data, groupName, position, radius)
    if groupName then
        local players = Ox.GetPlayers({groups = groupName})
        for _, player in ipairs(players) do
            local playerId = player.source
            local onDuty = exports['desync-jobs']:getOnDutyStatus(player.charId)
            if onDuty then
                TriggerClientEvent('desync-hud:notifications:showNotification', playerId, data)
            end
        end
    elseif position and radius then
        local nearbyPlayers = lib.getNearbyPlayers(position, radius)
        for _, player in ipairs(nearbyPlayers) do
            local playerId = player.source
            TriggerClientEvent('desync-hud:notifications:show', playerId, data)
        end
    else
        TriggerClientEvent('desync-hud:notifications:show', source, data)
    end
end)

-- exports('ShowNotification', ShowNotification)

-- Test command to send a notification to the "police" group
RegisterCommand('testpolicenotification', function(source, args, raw)
    local notificationData = {
        type = 'info',
        title = 'Police Alert',
        message = 'This is a test notification for the police group.',
        icon = '🚔',
        duration = 5000
    }

    TriggerEvent('desync-hud:server:ShowNotification', source, notificationData, 'police')
end, false)

--[[
    ShowNotification Function

    Sends notifications to players based on specified criteria.

    Parameters:

    - source: number
      Player ID for direct notification if no group or position is specified.

    - data: table
      Notification details:
      - type: string ('success', 'error', 'warning', 'info') - Default: 'info'
      - title: string (optional)
      - message: string (required)
      - icon: string (optional)
      - duration: number (milliseconds) - Default: 5000
      - variant: string ('default', 'compact') - Default: 'default'

    - group: string (optional)
      Sends notification to all players in this group.

    - position: vector3 (optional)
      Center point for radius-based notifications.

    - radius: number (optional)
      Radius for notifications around the position.

    Examples:

    -- To a specific player
    exports['desync-hud']:ShowNotification(source, { type = 'success', message = 'Welcome!' })

    -- To a group
    exports['desync-hud']:ShowNotification(source, { type = 'info', message = 'Group Alert' }, 'groupName')

    -- To players in a radius
    exports['desync-hud']:ShowNotification(source, { type = 'info', message = 'Nearby Alert' }, nil, vector3(100.0, 200.0, 300.0), 50.0)

    Notes:
    - Group takes precedence over position/radius.
    - Implement GetPlayersInGroup and GetPlayersInRadius for group and radius functionality.
]]