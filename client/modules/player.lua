local Player = {}
local Utils = require '@desync-hud/client/modules/utils'
local State = require '@desync-hud/client/modules/state'

function Player.init()
    -- Initialize player related stuff
    CreateThread(function()
        while true do
            Wait(1000) -- Update every second
            if State.getDisplay() then
                
                -- Update player stats
                local player = Ox.GetPlayer()
                if player then
                    -- Health update
                    local health = GetEntityHealth(PlayerPedId())
                    local normalizedHealth = math.max(0, math.min(100, health - 100))
                    Utils.sendReactMessage('updateHealth', { health = normalizedHealth })

                    -- Hunger and thirst updates
                    local hunger = player.getStatus('hunger')
                    local thirst = player.getStatus('thirst')
                    Utils.sendReactMessage('updateHunger', { hunger = hunger })
                    Utils.sendReactMessage('updateThirst', { thirst = thirst })

                    -- Stamina update
                    local stamina = GetPlayerStamina(PlayerId())
                    Utils.sendReactMessage('updateStamina', { stamina = stamina })
                end
            end
        end
    end)
end


return Player