import { Scheduler } from "scheduler";
import { ProcessTypes } from "processes/processTypes";
import { Utils } from "./utils";

export class Stats
{
    public static build(scheduler: Scheduler)
    {
        if (!Memory.stats)
        {
            Memory.stats = {};
        }

        Memory.stats["gcl.progress"] = Game.gcl.progress;
        Memory.stats["gcl.progressTotal"] = Game.gcl.progressTotal;
        Memory.stats["gcl.level"] = Game.gcl.level;
        Memory.stats["cpu.getUsed"] = Game.cpu.getUsed();
        Memory.stats["cpu.limit"] = Game.cpu.limit;
        Memory.stats["cpu.bucket"] = Game.cpu.bucket;
        Memory.stats["cpu.schedulerLimit"] = scheduler.limit;
        Memory.stats["memory.size"] = RawMemory.get().length;
        Memory.stats["market.credits"] = Game.market.credits;

        Memory.stats["processes.counts.total"] = Object.keys(scheduler.processTable).length;
        Memory.stats["processes.counts.run"] = scheduler.execOrder.length;
        Memory.stats["processes.counts.suspend"] = scheduler.suspendCount;
        Memory.stats["processes.counts.missed"] =
            (Object.keys(scheduler.processTable).length - scheduler.execOrder.length - scheduler.suspendCount);
        Memory.stats["processes.counts.faulted"] = 0;

        if (Memory.stats["processes.counts.missed"] < 0)
        {
            Memory.stats["processes.counts.missed"] = 0;
        }

        _.forEach(Object.keys(ProcessTypes), (type: string) =>
        {
            Memory.stats["processes.types." + type] = 0;
        });

        Memory.stats["processes.types.undefined"] = 0;
        Memory.stats["processes.types.init"] = 0;
        Memory.stats["processes.types.flagWatcher"] = 0;

        _.forEach(scheduler.execOrder, (execed: { type: string, cpu: number, faulted: boolean }) =>
        {
            Memory.stats["processes.types." + execed.type] += execed.cpu;

            if (execed.faulted)
            {
                Memory.stats["processes.counts.faulted"] += 1;
            }
        });

        Memory.stats["processes.types.scheduler"] = scheduler.schedulerUsage;
        Memory.stats["processes.types.scheduler-scheduler"] = 0;

        _.forEach(Object.keys(scheduler.data.roomData), (roomName: string) =>
        {
            const room = Game.rooms[roomName];

            if (room.controller && room.controller.my)
            {
                Memory.stats["rooms." + roomName + ".rcl.level"] = room.controller.level;
                Memory.stats["rooms." + roomName + ".rcl.progress"] = room.controller.progress;
                Memory.stats["rooms." + roomName + ".rcl.progressTotal"] = room.controller.progressTotal;
                Memory.stats["rooms." + roomName + ".rcl.percentage"] =
                    (room.controller.progress / room.controller.progressTotal) * 100;
                Memory.stats["rooms." + roomName + ".ramparts.target"] = Utils.rampartHealth(scheduler, roomName);

                Memory.stats["rooms." + roomName + ".spawn.energy"] = room.energyAvailable;
                Memory.stats["rooms." + roomName + ".spawn.energyTotal"] = room.energyCapacityAvailable;

                if (room.storage)
                {
                    Memory.stats["rooms." + roomName + ".storage.energy"] = room.storage.store.energy;
                }
                else
                {
                    Memory.stats["rooms." + roomName + ".storage.energy"] = 0;
                }
            }
        });
    }
}
