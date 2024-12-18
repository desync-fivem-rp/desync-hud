local function ShowNotification(source, data)
    TriggerClientEvent('desync-hud:notifications:show', source, data)
end

local function ShowNotificationToAll(data)
    TriggerClientEvent('desync-hud:notifications:show', -1, data)
end

exports('ShowNotification', ShowNotification)
exports('ShowNotificationToAll', ShowNotificationToAll)