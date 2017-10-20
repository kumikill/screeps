import { Process } from "../../os/process";
import { MoveProcess } from "./move";

interface HarvestMetaData
{
  source: string;
  creep: string;
}

export class HarvestProcess extends Process
{
  public metaData: HarvestMetaData;
  public type = "harvest";

  public run()
  {
    const creep = Game.creeps[this.metaData.creep];

    if (!creep || _.sum(creep.carry) === creep.carryCapacity)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    const source = Game.getObjectById(this.metaData.source) as Source;

    let targetPos = source.pos;
    let targetRange = 1;

    if (this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id])
    {
      targetPos = this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id].pos;
      targetRange = 0;
    }

    if (!creep.pos.inRangeTo(targetPos, targetRange))
    {
      this.kernel.addProcess(MoveProcess, creep.name + "-harvest-move", this.priority + 1, {
        creep: creep.name,
        pos: {
          x: targetPos.x,
          y: targetPos.y,
          roomName: targetPos.roomName
        },
        range: targetRange
      });
      this.suspend = creep.name + "-harvest-move";
    }
    else
    {
      if (creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES)
      {
        this.suspend = source.ticksToRegeneration;
      }
    }
  }
}