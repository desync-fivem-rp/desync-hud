local Player = {}
local Utils = require '@desync-hud/client/modules/utils'
local State = require '@desync-hud/client/modules/state'

local isDead = false
local isUnconscious = false

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
                    -- print(health)

                    -- Unconscious logic, work on later 

                    -- if health <= 105 and not isUnconscious then
                    --     isUnconscious = true
                    --     TriggerEvent('desync:playerUnconscious')
                    -- elseif health > 105 and isUnconscious then
                    --     isUnconscious = false
                    -- end
                    

                    -- Hunger and thirst updates
                    local hunger = player.getStatus('hunger')
                    local thirst = player.getStatus('thirst')
                    Utils.sendReactMessage('updateHunger', { hunger = hunger })
                    Utils.sendReactMessage('updateThirst', { thirst = thirst })

                    -- Stamina update
                    local stamina = GetPlayerStamina(PlayerId())
                    Utils.sendReactMessage('updateStamina', { stamina = stamina })

                    -- Stress update
                    local stress = player.getStatus('stress')
                    Utils.sendReactMessage('updateStress', { stress = stress })


                    local isArmed = IsPedArmed(PlayerPedId(), 4)

                    -- Hide ammo when not armed
                    if not isArmed then
                        Utils.sendReactMessage('updateAmmo', { ammoInClip = 0, totalAmmo = 0, isArmed = 0 })
                    end
                    -- Show ammo when armed
                    if isArmed ~= 0 then
                        local Weapon = exports.ox_inventory:getCurrentWeapon()
                        if Weapon then
                            local ammoInClip = Weapon.metadata.ammo
                            local totalAmmo = exports.ox_inventory:Search('count', Weapon.ammo)

                            -- Weapon ammo update
                            Utils.sendReactMessage('updateAmmo', { ammoInClip = ammoInClip, totalAmmo = totalAmmo, isArmed = isArmed })
                        end
                    end
                end
            end
        end
    end)
end

AddEventHandler('desync:playerDeath', function()
    -- Trigger the crawling and unconscious sequence
    TriggerEvent('desync:playerUnconscious')
end)


return Player