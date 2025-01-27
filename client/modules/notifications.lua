local Notifications = {}

function Notifications.ShowClientNotification(data)
    -- print(json.encode(data))
    SendNUIMessage({
        action = 'notification',
        data = {
            type = data.type or 'info',
            title = data.title,
            message = data.message,
            icon = data.icon,
            duration = data.duration or 5000,
            variant = data.variant or 'default',
            vehicleDescription = data.vehicleDescription,
            pedDescription = data.pedDescription,
            street = data.street
        }
    })

    TriggerEvent('InteractSound_CL:PlayOnOne', data.type, 0.1)
end



RegisterNetEvent('desync-hud:notifications:showNotification')
AddEventHandler('desync-hud:notifications:showNotification', Notifications.ShowClientNotification)





-- Test command for compact notifications
RegisterCommand('testnotification', function(source, args, raw)
    local type = args[1] or 'info'
    local variant = args[2] or 'default'
    
    local notifications = {
        success = {
            type = 'success',
            message = '+$500',
            icon = '💰',
            variant = variant
        },
        error = {
            type = 'error',
            message = '-$100',
            icon = '💸',
            variant = variant
        },
        info = {
            type = 'info',
            message = 'Vehicle locked',
            icon = '🔒',
            variant = variant
        },
        dispatch = {
            type = 'dispatch',
            message = 'Dispatch alert',
            icon = '🚔',
            variant = variant,
            vehicleDescription = 'Vehicle description',
            pedDescription = 'Ped description',
            street = 'Street name'
        }
    }

    if notifications[type] then
        Notifications.ShowClientNotification(notifications[type])
    end
end, false)

exports('ShowClientNotification', Notifications.ShowClientNotification)

return Notifications
