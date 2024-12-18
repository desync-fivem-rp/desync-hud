local Utils = {}

function Utils.sendReactMessage(action, data)
    -- Convert any non-serializable data to strings
    local sanitizedData = {}
    if type(data) == 'table' then
        for k, v in pairs(data) do
            if type(v) == 'function' then
                sanitizedData[k] = 'function'
            elseif type(v) == 'table' then
                -- Handle nested tables
                local success, result = pcall(json.encode, v)
                if success then
                    sanitizedData[k] = v
                else
                    sanitizedData[k] = tostring(v)
                end
            else
                sanitizedData[k] = v
            end
        end
    else
        sanitizedData = data
    end

    SendNUIMessage({
        action = action,
        data = sanitizedData
    })
end

local currentResourceName = GetCurrentResourceName()
local debugIsEnabled = GetConvarInt(('%s-debugMode'):format(currentResourceName), 0) == 1

function Utils.debugPrint(...)
    if not debugIsEnabled then return end
    local args <const> = { ... }

    local appendStr = ''
    for _, v in ipairs(args) do
        appendStr = appendStr .. ' ' .. tostring(v)
    end
    local msgTemplate = '^3[%s]^0%s'
    local finalMsg = msgTemplate:format(currentResourceName, appendStr)
    print(finalMsg)
end

-- Vehicle speed conversions
function Utils.mpsToMph(mps)
  return mps * 2.236936 -- Convert meters per second to miles per hour
end


return Utils