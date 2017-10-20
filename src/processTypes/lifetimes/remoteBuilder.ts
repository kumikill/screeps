import { LifetimeProcess } from "../../os/LifetimeProcess";

import { BuildProcess } from "../creepActions/build";
import { HarvestProcess } from "../creepActions/harvest";
import { UpgradeProcess } from "../creepActions/upgrade";

export class RemoteBuilderLifetimeProcess extends LifetimeProcess
{
  public type = "rblf";

  public run()
  {
    const creep = this.getCreep();
    const site = Game.getObjectById(this.metaData.site) as ConstructionSite;

    if (!creep)
    {
      return;
    }

    if (!site)
    {
      this.completed = true;
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      const source = site.pos.findClosestByRange(this.kernel.data.roomData[site.pos.roomName].sources);

      this.fork(HarvestProcess, "harvest-" + creep.name, this.priority - 1, {
        creep: creep.name,
        source: source.id
      });

      return;
    }

    if (creep.room.controller!.level < 2 || creep.room.controller!.ticksToDowngrade < 4000)
    {
      this.fork(UpgradeProcess, "upgrade-" + creep.name, this.priority - 1, {
        creep: creep.name
      });

      return;
    }

    this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
      creep: creep.name,
      site: site.id
    });
  }
}