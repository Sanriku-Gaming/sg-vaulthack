local PendingPromises = {}

------------------------
--      Functions     --
------------------------
local function HackActive()
    return next(PendingPromises) ~= nil
end

---@class HackParams
---@field difficulty "easy"|"medium"|"hard"|"ultra"
---@field targets number
---@field speed number
---@field totalTime number
---@field lossTIme number
local function StartHack(data)
    data.action = "startHack"
    data.id = ("%s%s"):format(GetGameTimer(), math.random(100000, 999999))

    if HackActive() then return false end

    PendingPromises[data.id] = promise.new()

    SetNuiFocus(true, true)
    SendNUIMessage(data)

    Citizen.Await(PendingPromises[data.id])

    local success = PendingPromises[data.id].value
    PendingPromises[data.id] = nil

    return success
end

------------------------
--    NUI Callbacks   --
------------------------
RegisterNUICallback('hackFinish', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
    if data.id then
        local Promise = PendingPromises[data.id]
        if Promise then
            Promise:resolve(data.success)
        end
    end
end)

------------------------
--      Commands      --
------------------------
if Config.Debug then
    RegisterCommand('vaultHackTest', function(source, args)
        local data = {}
        data.difficulty = 'easy'
        data.targets = 3
        data.speed = 4
        data.totalTime = 3
        data.lossTIme = 1

        local success = exports['sg-vaulthack']:StartHack(data)
        print('Client, Hack Complete. Success: ', success)
    end, false)
end

------------------------
--       Events       --
------------------------
AddEventHandler('onResourceStart', function(resource)
    if resource ~= GetCurrentResourceName() then return end

    Wait(1000)
    if Config.Debug then print('Debug Mode Enabled!') end
    SendNUIMessage({
        action = 'setDebug',
        debug = Config.Debug
    })
end)

------------------------
--      Exports     --
------------------------
exports('StartHack', StartHack)
exports('InProgress', HackActive)

------------------------
--       Example      --
------------------------
--[[
    local success = exports['sg-vaulthack']:StartHack({
        difficulty = 'medium',      -- string to match the config.js settings
        targets = 4,                -- number of targets to correctly hit
        speed = 3,                  -- speed of the needle (1-10)
        totalTime = 40,             -- time in seconds before failure
        lossTIme = 2,               -- time in seconds to lose on miss (or wrong key)
    })
]]