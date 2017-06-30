((state, timeLeftFn) => {
    const targeting = getTargetingEnemies(state.arena)

    if (targeting.length) {

    }
    return {
        command: 'no',
        state: {
            hello: 'world'
        }
    };
});

const getTargetingEnemies = (arena) => {
    let enemies = [];
    for (let i = 0; i < arena.length; i++) {
        for (let j = 0; j < arena[0].length; j++) {
            if ((i === 3 || j === 3) && arena[i][j].contents.type === 'wombat' && arena[i][j].contents.type === 'wombat')  {
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