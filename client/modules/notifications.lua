local Notifications = {}

function Notifications.ShowNotification(data)
    SendNUIMessage({
        action = 'notification',
        data = {
            type = data.type or 'info',
            title = data.title,
            message = data.message,
            icon = data.icon,
            duration = data.duration or 5000,
            position = data.position or 'top-right',
            variant = data.variant or 'default'
        }
    })
end


-- Work notification into a desync-core handled event to organize it better

exports('ShowNotification', Notifications.ShowNotification)

RegisterNetEvent('desync-hud:notifications:show')
AddEventHandler('desync-hud:notifications:show', Notifications.ShowNotification)


-- Test commands
RegisterCommand('testnotify', function(source, args, raw)
    local type = args[1] or 'info'
    
    local notifications = {
        success = {
            type = 'success',
            title = 'Success',
            message = 'This is a success notification!',
            icon = '✓'
        },
        error = {
            type = 'error',
            title = 'Error',
            message = 'Something went wrong!',
            icon = '❌'
        },
        warning = {
            type = 'warning',
            title = 'Warning',
            message = 'This is a warning message',
            icon = '⚠️'
        },
        info = {
            type = 'info',
            title = 'Information',
            message = 'This is an info notification',
            icon = 'ℹ️'
        }
    }

    if notifications[type] then
        Notifications.ShowNotification(notifications[type])
    else
        Notifications.ShowNotification({
            type = 'error',
            title = 'Invalid Type',
            message = 'Valid types: success, error, warning, info',
            duration = 5000
        })
    end
end, false)

-- Add new test command for compact notifications
RegisterCommand('testcompact', function(source, args, raw)
    local type = args[1] or 'info'
    
    local notifications = {
        success = {
            type = 'success',
            message = '+$500',
            icon = '💰',
            variant = 'compact'
        },
        error = {
            type = 'error',
            message = '-$100',
            icon = '💸',
            variant = 'compact'
        },
        info = {
            type = 'info',
            message = 'Vehicle locked',
            icon = '🔒',
            variant = 'compact'
        }
    }

    if notifications[type] then
        Notifications.ShowNotification(notifications[type])
    end
end, false)

--[[ 
    DOCUMENTATION: How to use notifications in other resources
    -------------------------------------------------------

    There are two ways to trigger notifications from other resources:

    1. Using exports:
    -----------------
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'success',      -- 'success', 'error', 'warning', 'info'
        title = 'Title',       -- Optional for compact notifications
        message = 'Message',   -- Required
        icon = '✓',           -- Optional: emoji or icon character
        duration = 5000,      -- Optional: milliseconds (default: 5000)
        variant = 'default'   -- Optional: 'default' or 'compact' (default: 'default')
    })

    2. Using events:
    ---------------
    TriggerEvent('desync-hud:notifications:show', {
        type = 'success',
        title = 'Title',
        message = 'Message',
        icon = '✓',
        duration = 5000,
        variant = 'default'
    })

    Examples:
    ---------
    -- Default notification
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'success',
        title = 'Money Received',
        message = 'You received $500',
        icon = '💰'
    })

    -- Compact notification
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'success',
        message = '+$500',
        icon = '💰',
        variant = 'compact'
    })

    -- Error notification with custom duration
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'error',
        title = 'Error',
        message = 'Not enough money',
        icon = '❌',
        duration = 3000
    })

    Available Options:
    -----------------
    type: 'success' | 'error' | 'warning' | 'info'
    title: string (optional for compact)
    message: string (required)
    icon: string (optional)
    duration: number (optional, default: 5000ms)
    variant: 'default' | 'compact' (optional, default: 'default')
]]

return Notifications