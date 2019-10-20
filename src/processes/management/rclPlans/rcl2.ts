import { RCLPlan } from "./rclPlan";

export class RCL2 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[2] = {};

        // Copy RCL 1
        this.room.memory.roomPlan.rcl[2].spawn = _.clone(this.room.memory.roomPlan.rcl[1].spawn);

        // Source containers
        this.room.memory.roomPlan.rcl[2].container = [];
        this.room.memory.roomPlan.rcl[2].road = [];
        const sources = this.scheduler.data.roomData[this.room.name].sources;
        for (let i = 0; i < sources.length; ++i)
        {
            let containerPos: RoomPosition;
            const nearContainers = sources[i].pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (s: Structure) =>
                {
                    return s.structureType === STRUCTURE_CONTAINER;
                }
            });
            if (nearContainers.length > 0)
            {
                containerPos = nearContainers[0].pos;
            }
            else
            {
                const nearContainerSites = sources[i].pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: (s: ConstructionSite) =>
                    {
                        return s.structureType === STRUCTURE_CONTAINER;
                    }
                });
                if (nearContainerSites.length > 0)
                {
                    containerPos = nearContainerSites[0].pos;
                }
                else
                {
                    containerPos = this.findEmptyInRange(sources[i].pos, 1, this.baseSpawn.pos, ["wall"], ["container"])!;
                }
            }
            this.room.memory.roomPlan.rcl[2].container.push(containerPos);

            // Source roads
            let path = PathFinder.search(this.baseSpawn.pos, { pos: sources[i].pos, range: 1 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[2].road.push(path[j]);
            }

            // Source to controller
            path = PathFinder.search(sources[i].pos, { pos: this.controller.pos, range: 3 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[2].road.push(path[j]);
            }
        }

        const baseToController = PathFinder.search(
            this.baseSpawn.pos, { pos: this.controller.pos, range: 3 }).path;

        // Controller roads
        for (const pos of baseToController)
        {
            this.room.memory.roomPlan.rcl[2].road.push(pos);
        }

        // General container
        const generalContainerPos = baseToController[Math.floor(baseToController.length / 2)];
        this.room.memory.roomPlan.rcl[2].container.push(generalContainerPos);

        // Sources to general container roads
        for (let i = 0; i < sources.length; ++i)
        {
            const path = PathFinder.search(sources[i].pos, { pos: generalContainerPos, range: 1 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[2].road.push(path[j]);
            }
        }

        // Base roads
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([  // Base roads
            // Top to right
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Right to bottom
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 5, this.room.name),
            // Bottom to left
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Left to top
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y, this.room.name)
        ]);

        // Extensions
        this.room.memory.roomPlan.rcl[2].extension = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 1, this.room.name)
        ];

        // Extension roads
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 1, this.room.name)
        ]);

        this.finished(2);
    }
}
