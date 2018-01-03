import { LifetimeProcess } from "../../OS/LifetimeProcess";

import { MoveProcess } from "../CreepActions/Move";

export class BrawlerLifetimeProcess extends LifetimeProcess
{
    public type = "brawlerLifetime";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        if (creep.room.name !== flag.pos.roomName)
        {
            this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
                creep: creep.name,
                pos: {
                    x: flag.pos.x,
                    y: flag.pos.y,
                    roomName: flag.pos.roomName
                },
                range: 1
            });

            return;
        }

        const hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

        if (hostiles.length > 0)
        {
            const nearestHostile = creep.pos.findClosestByRange(hostiles) as Creep;

            if (creep.attack(nearestHostile) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(nearestHostile);
            }
        }
        else
        {
            const hostileStructures = creep.room.find<Structure>(FIND_HOSTILE_STRUCTURES);

            if (hostileStructures[0])
            {
                const hostileStructure = creep.pos.findClosestByRange<Structure>(hostileStructures);

                if (creep.attack(hostileStructure) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(hostileStructure);
                }
            }
            else if (!creep.pos.inRangeTo(flag.pos, 2))
            {
                creep.moveTo(flag);
            }
        }
    }
}