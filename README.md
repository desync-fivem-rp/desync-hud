    
    
    
    ------------------- NOTIFICATIONS--------------------
    
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
