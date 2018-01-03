import { Process } from "../../OS/Process";

import { FlagWatcherProcess } from "../FlagWatcher";
import { EnergyManagementProcess } from "../Management/EnergyManagement";
import { StructureManagementProcess } from "../Management/StructureManagement";
import { RoomDataProcess } from "../RoomData";
import { SuspensionProcess } from "./Suspension";

export class InitProcess extends Process
{
    public type = "init";

    // Run the init process
    public run()
    {
        const proc = this;

        if (Game.cpu.bucket > 3000)
        {
            this.kernel.limit = (Game.cpu.limit + 500) - 20;
        }

        for (const name in Memory.creeps)
        {
            const creep = Game.creeps[name];
            if (!creep)
            {
                delete Memory.creeps[name];
            }
            else if (creep.memory.visual)
            {
                creep.room.visual.circle(creep.pos,
                    { fill: "transparent", radius: 0.55, stroke: creep.memory.visual });
            }
        }

        _.forEach(Game.rooms, (room) =>
        {
            if (room.controller && room.controller.my)
            {
                proc.kernel.addProcess(RoomDataProcess, "roomData-" + room.name, 99, {
                    roomName: room.name
                });

                if (!proc.kernel.getProcessByName("em-" + room.name))
                {
                    proc.kernel.addProcess(EnergyManagementProcess, "em-" + room.name, 50, {
                        roomName: room.name
                    });
                }

                if (!proc.kernel.hasProcess("sm-" + room.name))
                {
                    proc.kernel.addProcess(StructureManagementProcess, "sm-" + room.name, 48, {
                        roomName: room.name
                    });
                }
            }
        });

        this.kernel.addProcess(SuspensionProcess, "suspension-master", 99, { master: true });
        this.kernel.addProcess(FlagWatcherProcess, "flag-watcher", 98, {});

        this.completed = true;
    }
}