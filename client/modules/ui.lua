local UI = {}
local State = require '@desync-hud/client/modules/state'
local Utils = require '@desync-hud/client/modules/utils'
local Vehicle = require '@desync-hud/client/modules/vehicle'

function UI.init()
    -- Initialize UI and register all events
    AddEventHandler('onResourceStart', function(resourceName)
        if GetCurrentResourceName() == resourceName then
            Wait(1000)
            if State.getDisplay() then
                Utils.debugPrint('NUI frame is already open')
                return
            end
            UI.toggleNuiFrame(true)
        end
    end)

    AddEventHandler('ox:playerLoaded', function()
        if State.getDisplay() then
            Utils.debugPrint('NUI frame is already open')
            return
        end
        UI.toggleNuiFrame(true)
    end)

    RegisterNUICallback('getPlayerHealth', function(_, cb)
        local health = GetEntityHealth(PlayerPedId())
        local normalizedHealth = math.max(0, math.min(100, health - 100))
        cb({ health = normalizedHealth })
    end)

    RegisterNUICallback('getPlayerHunger', function(_, cb)
        local player = Ox.GetPlayer()
        if player then
            local hunger = player.getStatus('hunger')
            cb({ hunger = hunger })
        else
            cb({ hunger = 0 })
        end
    end)

    RegisterNUICallback('getPlayerThirst', function(_, cb)
        local player = Ox.GetPlayer()
        if player then
            local thirst = player.getStatus('thirst')
            cb({ thirst = thirst })
        else
            cb({ thirst = 0 })
        end
    end)

    RegisterNUICallback('getPlayerStamina', function(_, cb)
        local stamina = GetPlayerStamina(PlayerId())
        cb({ stamina = stamina })
    end)

    RegisterNUICallback('getPlayerStress', function(_, cb)
        local player = Ox.GetPlayer()
        if player then
            local stress = player.getStatus('stress')
            cb({ stress = stress })
        else
            cb({ stress = 0 })
        end
    end)

    -- Register commands
    RegisterCommand('show-nui', function()
        if State.getDisplay() then
            Utils.debugPrint('NUI frame is already open')
            return
        end
        UI.toggleNuiFrame(true)
    end)

    -- Register NUI callbacks
    RegisterNUICallback('hideFrame', function(_, cb)
        UI.toggleNuiFrame(false)
        Utils.debugPrint('Hide NUI frame')
        cb({})
    end)

end

function UI.toggleNuiFrame(shouldShow)
    SetNuiFocus(false, false)
    Utils.sendReactMessage('setVisible', shouldShow)
    
    -- Only disable radar if not in vehicle
    if not Vehicle.isInVehicle() then
        DisplayRadar(false)
        State.setDisplayRadar(false)
    end
    
    -- DisplayHud(false)
    State.setDisplay(shouldShow)
end



AddEventHandler("desync-hud:showHudForBennys", function(inBennys)
    State.setBennysHudState(inBennys)
    if inBennys then
        Utils.sendReactMessage('setVisible', false)
    else
        Utils.sendReactMessage('setVisible', true)
    end
end)

return UI
