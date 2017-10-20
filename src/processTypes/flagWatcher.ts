import { Process } from "../os/process";
import { ClaimProcess } from "./empireActions/claim";
import { HoldRoomProcess } from "./empireActions/hold";
import { InvasionManagementProcess } from "./management/InvasionManagementProcess";
import { RangerManagementProcess } from "./management/rangers";
import { RemoteMiningManagementProcess } from "./management/remoteMining";

export class FlagWatcherProcess extends Process
{
  public type = "flagWatcher";

  public claimFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(
      ClaimProcess,
      "claim-" + flag.name,
      20,
      {
        targetRoom: flag.pos.roomName,
        flagName: flag.name
      }
    );
  }

  public holdFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(
      HoldRoomProcess,
      "hold-" + flag.name,
      20,
      {
        flag: flag.name
      }
    );
  }

  public remoteMiningFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(
      RemoteMiningManagementProcess,
      "rmmp-" + flag.name,
      40,
      {
        flag: flag.name
      }
    );
  }

  public rangerFlag(flag: Flag)
  {
    const count = parseInt(flag.name.split(".")[1], undefined);
    this.kernel.addProcessIfNotExist(RangerManagementProcess, flag.name + "-rangers", 70, {
      flag: flag.name,
      rangers: [],
      count: count
    });
  }

  public invasionFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(InvasionManagementProcess, `${flag.name}-invasion`, 70, {
      flag: flag.name,
      invaders: []
    });
  }

  public run()
  {
    this.completed = true;

    const proc = this;

    _.forEach(Game.flags, function(flag)
    {
      switch (flag.color)
      {
        case COLOR_PURPLE:
          switch (flag.secondaryColor)
          {
            case COLOR_PURPLE:
              proc.holdFlag(flag);
              break;
            case COLOR_RED:
              proc.claimFlag(flag);
              break;
          }
          break;
        case COLOR_YELLOW:
          proc.remoteMiningFlag(flag);
          break;
        case COLOR_BLUE:
          proc.rangerFlag(flag);
          break;
        case COLOR_RED:
          proc.invasionFlag(flag);
          break;
      }
    });
  }
}
