local State = {
    display = false,
    displayRadar = false,
    seatbeltOn = false
}

function State.getDisplay()
    return State.display
end

function State.setDisplay(value)
    State.display = value
end

function State.getDisplayRadar()
    return State.displayRadar
end

function State.setDisplayRadar(value)
    State.displayRadar = value
end

function State.setLastVehicleState(health, speed, show)
    State.lastVehicleHealth = health
    State.lastVehicleSpeed = speed
    State.inVehicle = show or false
end

function State.getLastVehicleState()
    return {
        health = State.lastVehicleHealth or 0,
        speed = State.lastVehicleSpeed or 0,
        show = State.inVehicle or false
    }
end

function State.getSeatbeltState()
    return State.seatbeltOn
end

function State.setSeatbeltState(value)
    State.seatbeltOn = value
end

return State