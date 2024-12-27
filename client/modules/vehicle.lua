local Vehicle = {}
local Utils = require '@desync-hud/client/modules/utils'
local State = require '@desync-hud/client/modules/state'

local hasPlayedWarningSound = false

function Vehicle.init()
    -- Initialize vehicle tracking
    CreateThread(function()
        while true do
            Wait(10) -- Check every 100ms
            Vehicle.updateVehicleState()

            -- Disable exit when seatbelt is on
            if State.getSeatbeltState() then
                DisableControlAction(0, 75, true)
            end

        end
    end)
end

function Vehicle.isInVehicle()
    local ped = PlayerPedId()
    return GetVehiclePedIsIn(ped, false) ~= 0
end

function Vehicle.getVehicleData()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    
    if vehicle ~= 0 then
        local vehicleHealth = math.floor(GetVehicleEngineHealth(vehicle))
        local vehicleSpeed = math.floor(Utils.mpsToMph(GetEntitySpeed(vehicle)))
        local fuel = GetVehicleFuelLevel(vehicle)
        local rpm = GetVehicleCurrentRpm(vehicle)
        local gearArray = Vehicle.getGearArray()
        local engineRunning = GetIsVehicleEngineRunning(vehicle)
        
        -- Get tire burst status for all wheels
        local tires = {}
        for i = 0, 5 do
            tires[i] = IsVehicleTyreBurst(vehicle, i, false)
        end
        
        return {
            show = engineRunning,
            engineHealth = vehicleHealth,
            speed = vehicleSpeed,
            fuel = fuel,
            rpm = rpm,
            tiresBurst = Vehicle.hasAnyBurstTire(),
            gear = Vehicle.getCurrentGear(),
            gearArray = gearArray,
            seatbeltOn = State.getSeatbeltState()
        }
    end
    
    return {
        show = false,
        engineHealth = 0,
        speed = 0,
        fuel = 0,
        rpm = 0,
        tiresBurst = false,
        gear = 0,
        gearArray = {},
        seatbeltOn = false
    }
end

function Vehicle.updateVehicleState()
    local wasInVehicle = State.getLastVehicleState().show
    local vehicleData = Vehicle.getVehicleData()
    
    -- Only update if the state has changed
    if wasInVehicle ~= vehicleData.show or 
       (vehicleData.show and (
           State.getLastVehicleState().health ~= vehicleData.health or
           State.getLastVehicleState().speed ~= vehicleData.speed
       )) then
        
        -- Update state
        State.setLastVehicleState(vehicleData.health, vehicleData.speed, vehicleData.show)
        
        -- Send update to NUI
        Utils.sendReactMessage('updateVehicleHUD', vehicleData)
        
        -- Update HUD visibility based on being in vehicle AND engine running
        if Vehicle.isInVehicle() then
            DisplayRadar(vehicleData.show)
            State.setDisplayRadar(vehicleData.show)
        else
            DisplayRadar(false)
            State.setDisplayRadar(false)
        end
    end
end

function Vehicle.setVehicleHealth(health)
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    
    if vehicle ~= 0 then
        SetVehicleEngineHealth(vehicle, health)
        return true
    end
    
    return false
end

function Vehicle.hasAnyBurstTire()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    
    if vehicle ~= 0 then
        -- Check all wheels (0-5) for burst status
        for i = 0, 5 do
            if IsVehicleTyreBurst(vehicle, i, false) then
                return true
            end
        end
    end
    return false
end

function Vehicle.getCurrentGear()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    
    if vehicle ~= 0 then
        local gear = GetVehicleCurrentGear(vehicle)
        -- Detect reverse by checking if we're moving backwards in gear 0
        local forwardSpeed = GetEntitySpeedVector(vehicle, true).y

        if forwardSpeed < -0.01 then
            gear = -1 -- Set to reverse
        elseif forwardSpeed == 0 then
            gear = 0 -- Set to neutral
        end

        return gear
    end
end

function Vehicle.getGearArray()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)

    local maxGear = GetVehicleHighGear(vehicle)
    
    -- Adjust gear display array based on max gear
    local gearArray = {-1, 0} -- Start with reverse gear
    for i = 1, maxGear do
        table.insert(gearArray, i)
    end
    return gearArray
end

function Vehicle.toggleSeatbelt()
    if not Vehicle.isInVehicle() then return end
    
    local newState = not State.getSeatbeltState()
    State.setSeatbeltState(newState)
    
    
    local volume = Config.seatbeltVolume

    if Config.playSound then
        if newState then
            TriggerEvent('InteractSound_CL:PlayOnOne', 'buckle', volume)
        else
            TriggerEvent('InteractSound_CL:PlayOnOne', 'unbuckle', volume)
        end
    end

    -- Update UI with complete vehicle data
    Utils.sendReactMessage('updateVehicleHUD', Vehicle.getVehicleData())
    
end

function Vehicle.isSeatbeltOn()
    return State.getSeatbeltState()
end



-- -- Add keybinding for seatbelt toggle
RegisterCommand('toggleseatbelt', function()
    Vehicle.toggleSeatbelt()
end, false)
RegisterKeyMapping('toggleseatbelt', 'Toggle Seatbelt', 'keyboard', Config.toggleSeatbeltKey)


RegisterCommand('setvehiclehealth', function(source, args)
    if #args < 1 then
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            args = {'Error', 'Usage: /setvehiclehealth [health 0-1000]'}
        })
        return
    end

    local health = tonumber(args[1])
    if not health or health < 0 or health > 1000 then
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            args = {'Error', 'Health must be a number between 0 and 1000'}
        })
        return
    end

    if Vehicle.setVehicleHealth(health) then
        TriggerEvent('chat:addMessage', {
            color = {0, 255, 0},
            args = {'Success', 'Vehicle health set to ' .. health}
        })
    else
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            args = {'Error', 'You must be in a vehicle'}
        })
    end
end)



return Vehicle