import * as fs from "fs";

export var Data = {};

export function loadJSON(pathname, key) {
  console.log(`parsing ${pathname} -> ${key}`);
  Data[key] = JSON.parse(fs.readFileSync(pathname, "utf-8"));
}

export function loadData(key) {
  loadJSON(`./customdata/${key}.json`, key);
}

// basepath 指向游戏数据根目录(有名为excel的下级目录的)
export function loadExcel(key, base) {
  loadJSON(`${base}/excel/${key}.json`, key);
}

loadJSON("./version.json", "version");
loadData("dps_options");
loadData("dps_specialtags");
loadData("dps_specialtags_v2");

export function loadGameData(basepath) {
  loadExcel("character_table", basepath);
  loadExcel("char_patch_table", basepath);
  loadExcel("skill_table", basepath);
}

export function patchChar(charId, patchId, suffix) {
  if (!Data.character_table[charId]) {
    Data.character_table[charId] = Data.char_patch_table["patchChars"][patchId];
    Data.character_table[charId].name += suffix;
    console.log("patch char", charId);
  }
}

export function patchAllChars() {
  patchChar("char_1001_amiya2", "char_1001_amiya2", "（近卫 Ver.）");
}
