"use strict";

((state, timeLeftFn) => {
    const targeting = getTargetingEnemies(state.arena)

    const hp = state.arena[3][3].contents.hp

    const orientation = state.arena[3][3].contents.orientation

    let command = {}
    // If our health is low, find food
    if (hp > 20) {
        // If there are wombats in range
        // If we're facing the wombat OR zakano
            // Shoot him
        // If we're not facing any wombats OR Zakano
            // Turn
            // Then shoot him
        command = attack(state)
    } else {
        command = findFood(state.arena)
    }

    if (isSafeMove(command.action, orientation)) {
        return command
    } else {
        return {
            command: {
                action: 'turn',
                metadata: { direction: 'right'}},
            state: {}
        }
    }
});

const isSafeMove = (command, arena) => {
    if (command !== 'move') {
        return !getTargetingEnemies(arena).length
    }

    const orientation = arena[3][3].contents.orientation

    const targetCoords =
        orientation === 'n' ? [2, 3] :
        orientation === 's' ? [4, 3] :
        orientation === 'e' ? [3, 4] :
        [3, 2]

    const targetType = arena[targetCoords[0], targetCoords[1]].contents.type
    if (targetType && targetType !== 'food' && targetType !== 'smoke') {
        return false
    }

    return true
}

const attack = (arena, orientation) => {

    // If enemy is in line of sight, shoot
    // Get Orientation
    const orientation = arena[3][3].contents.orientation

    const row = target[0]
    const column = target[1]

    const target = getClosestEnemy(arena)

    if (orientation === 'n') {
        // Shoot if we're facing the enemy and in the same column
        if (column === 3 && row < 3) {
            return shoot()
        } else {
            return moveToward(target, orientation)
        }

    } else if (orientation === 's') {

        if (column === 3 && row > 3) {
            return shoot()
        } else {
            return moveToward(target, orientation)
        }

    } else if (orientation === 'e') {

        if (row === 3 && column > 3) {
            return shoot()
        } else {
            return moveToward(target, orientation)
        }

    } else if (orientation === 'w') {

        if (row === 3 && column < 3) {
            return shoot()
        } else {
            return moveToward(target, orientation)
        }
    }
}

const shoot = () => {
    return {
     'command': { action: 'shoot', metadata: {} },
     'state': {}
    }
}

const findFood = (arena) => {
    const food = getClosestFood(arena)

    if (!food || !food.length) {
        return {
            command: { action: 'move', metadata: {} },
            state: {}
        }
    }

    const orientation = arena[3][3].contents.orientation

    return moveToward(food, orientation)
}

const moveToward = (coords, orientation) => {
    if (orientation === 'n') {
        if (coords[0] < 3) {
            return {
                command: { action: 'move', metadata: {} },
                state: {}
            }
        }
        if (coords[0] > 3) {
            return {
                command: {
                    action: 'turn',
                    metadata: { direction: 'about-face' },
                },
                state: {}
            }
        }
        if (coords[0] === 3) {
            let cmd = {
                command: { action: 'turn', metadata: {} },
                state: {},
            }
            if (coords[1] < 3) {
                cmd.command.metadata.direction = 'left'
            } else {
                cmd.command.metadata.direction = 'right'
            }
            return cmd
        }
    } else if (orientation === 's') {
        if (coords[0] > 3) {
            return {
                command: { action: 'move', metadata: {} },
                state: {},
            }
        }
        if (coords[0] < 3) {
            return {
                command: {
                    action: 'turn',
                    metadata: { direction: 'about-face' }
                }
            }
        }
        if (coords[0] === 3) {
            let cmd = {
                command: { action: 'turn', metadata: {} },
                state: {}
            }
            if (coords[1] < 3) {
                cmd.command.metadata.direction = 'right'
            } else {
                cmd.command.metadata.direction = 'left'
            }
            return cmd
        }
    } else if (orientation === 'e') {
        if (coords[1] > 3) {
            return {
                command: { action: 'move', metadata: {} },
                state: {}
            }
        }
        if (coords[1] < 3) {
            return {
                command: {
                    action: 'turn',
                    metadata: { direction: 'about-face' }
                }
            }
        }
        if (coords[1] === 3) {
            let cmd = {
                command: { action: 'turn', metadata: {} },
                state: {}
            }
            if (coords[0] < 3) {
                cmd.command.metadata.direction = 'left'
            } else {
                cmd.command.metadata.direction = 'right'
            }
            return cmd
        }
    } else {
        if (coords[1] < 3) {
            return {
                command: { action: 'move', metadata: {} },
                state: {}
            }
        }
        if (coords[1] > 3) {
            return {
                command: {
                    action: 'turn',
                    metadata: { direction: 'about-face' }
                }
            }
        }
        if (coords[1] === 3) {
            let cmd = {
                command: { action: 'turn', metadata: {} },
                state: {}
            }
            if (coords[0] < 3) {
                cmd.command.metadata.direction = 'right'
            } else {
                cmd.command.metadata.direction = 'left'
            }
            return cmd
        }
    }
}


const getClosestFood = (arena) => {
    let food = []
    let minDist = 1000

    for (let i = 0; i < arena.length; i++) {
        for (let j = 0; j < arena[0].length; j++) {
            if (arena[i][j].contents.type === 'food') {
                const dist = Math.abs(i-3) + Math.abs(j-3)
                if (dist < minDist) {
                    food = [i, j]
                }
            }
        }
    }

    return food
}

const getClosestEnemy = (arena) => {
    let enemy = []
    let minDist = 1000

    for (let i = 0; i < arena.length; i++) {
        for (let j = 0; j < arena[0].length; j++) {
            if (arena[i][j].contents.type === 'wombat' || arena[i][j].contents.type === 'zakano') {
                const dist = Math.abs(i-3) + Math.abs(j-3)
                if (dist < minDist) {
                    enemy = [i, j]
                }
            }
        }
    }

    return enemy
}

const getTargetingEnemies = (arena) => {
    let enemies = [];
    for (let i = 0; i < arena.length; i++) {
        for (let j = 0; j < arena[0].length; j++) {
            if ((i === 3 || j === 3) && arena[i][j].contents.type === 'wombat' && arena[i][j].contents.type === 'zakano')  {
                if (
                    i < 3 && arena[i][j].contents.orientation === 's' ||
                    i > 3 && arena[i][j].contents.orientation === 'n' ||
                    j < 3 && arena[i][j].contents.orientation === 'e' ||
                    j > 3 && arena[i][j].contents.orientation === 'w') {
                        let enemy = enemies[i][j].contents;
                        enemy.coordinates = [i, j]
                        enemies.push(enemy)
                }
            }
        }
    }

    return enemies
}

const getOutOfTheWay = (enemies, wombat) => {
    const moveDirections = new Set(['n', 's', 'e', 'w']);
    for (let i = 0; i < enemies.length; i++) {
        directions.delete(enemies[i].orientation)
    }

    if (moveDirections.size === 0) {
        // TODO: we're fucked
    }

    const reverseOrientation = flipOrientation(wombat.contents.orientation)

    if (moveDirections.has(reverseOrientation)) {
        return 'move'
    }

    const enemiesInFront = enemies.filter((enemy) => enemy.orientation === reverseOrientation)

    const closest = enemiesInFront.sort((a, b) => {
        const distanceA = Math.abs(a.coordinates[0] - 3) + Math.abs(a.coordinates[1] - 3)
        const distanceB = Math.abs(b.coordinates[0] - 3) + Math.abs(b.coordinates[1] - 3)

        return distanceB - distanceA
    })[0]

    if (closest.hp < wombat.hp) {
        return 'fire'
    } else {
        // TODO: pick a turn direction
    }
}

const flipOrientation = (orientation) => {
    switch (orientation) {
        case 'n' :
            return 's'
        case 's':
            return 'n'
        case 'e':
            return 'w'
        default:
            return 'e'
    }
}

// Takes current orientation and target orientation and gives a turn direction
const orientationToTurn = (current, target) => {

}
