    
    
    
    ------------------- NOTIFICATIONS--------------------
    
    There are two ways to trigger notifications from other resources:

    1. Using exports:
    -----------------
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'success',      -- 'success', 'error', 'warning', 'info', 'dispatch'
        title = 'Title',       -- Optional for compact notifications
        message = 'Message',   -- Required
        icon = '✓',           -- Optional: emoji or icon character
        duration = 5000,      -- Optional: milliseconds (default: 5000)
        variant = 'default',   -- Optional: 'default' or 'compact' (default: 'default')
        vehicleDescription = 'Vehicle Description', -- Optional: for dispatch notifications
        pedDescription = 'Ped Description',       -- Optional: for dispatch notifications
        street = 'Street Name'                    -- Optional: for dispatch notifications
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

    -- Dispatch notification
    exports['fivem-react-boilerplate']:ShowNotification({
        type = 'dispatch',
        title = 'Police Alert',
        message = 'Robbery in progress',
        icon = '🚔',
        vehicleDescription = 'Black Sultan',
        pedDescription = 'Male wearing black mask',
        street = 'Grove Street'
    })

    Available Options:
    -----------------
    type: 'success' | 'error' | 'warning' | 'info' | 'dispatch'
    title: string (optional for compact)
    message: string (required)
    icon: string (optional)
    duration: number (optional, default: 5000ms)
    variant: 'default' | 'compact' (optional, default: 'default')
    vehicleDescription: string (optional, for dispatch notifications)
    pedDescription: string (optional, for dispatch notifications)
    street: string (optional, for dispatch notifications)
