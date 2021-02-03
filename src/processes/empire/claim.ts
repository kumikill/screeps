import { MoveProcess } from "../creeps/actions/move";
import { Process } from "processes/process";
import { Utils } from "utils/utils";

interface ClaimProcessMetaData
{
    creep: string;
    targetRoom: string;
    flagName: string;
}

export class ClaimProcess extends Process
{
    public metaData!: ClaimProcessMetaData;
    public type = "claim";

    public run(): void
    {
        const creep = Game.creeps[this.metaData.creep];
        const flag = Game.flags[this.metaData.flagName];
        const controller = creep.room.controller;

        if (!(controller && flag))
        {
            this.completed = true;
            return;
        }

        if (!creep)
        {
            const creepName = `claim-${this.metaData.targetRoom}-${Game.time}`;
            const spawned = Utils.spawn(
                this.scheduler,
                Utils.nearestRoom(this.metaData.targetRoom, 550),
                "claimer",
                creepName,
                {}
            );

            if (spawned)
            {
                this.metaData.creep = creepName;
            }

            return;
        }

        const room = Game.rooms[this.metaData.targetRoom];

        if (!room)
        {
            this.scheduler.addProcess(MoveProcess, "move-" + creep.name, this.priority - 1, {
                creep: creep.name,
                pos: flag.pos,
                range: 1
            });

            this.suspend = "move-" + creep.name;
        }
        else
        {
            creep.claimController(controller);
            this.completed = true;
            flag.remove();
        }
    }
}
