/**
 * Role: Harvester
 * Description: Transfers energy to structures which need it
 * Fallback: Upgrader
 */

import { RoomData } from "roomData";
import { notFull } from "utils";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    transfer(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function transfer(creep: Creep) {
  const structure = _.find(RoomData.structures, (s: Structure) => {
    return notFull(s, RESOURCE_ENERGY) &&
    s.structureType !== STRUCTURE_CONTAINER && s.structureType !== STRUCTURE_STORAGE;
  });

  if (structure !== undefined) {
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      moveTo(creep, structure.pos);
    }
  }
  else {
    roleUpgrader.run(creep);
  }
}