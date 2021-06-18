import * as AKDATA from "./loader.js"

// 获取技能特判标记，存放在dps_specialtags.json中
function checkSpecs(tag, spec) {
  let specs = AKDATA.Data.dps_specialtags;
  if ((tag in specs) && (spec in specs[tag]))
    return specs[tag][spec];
  else return false;
}

function getCharAttributes(char) {
  checkChar(char);
  let {
    basic,
    buffs
  } = getAttributes(char, new Log());
  let normalFrame = getBuffedAttributes(basic, buffs);
  return normalFrame;
}

function getTokenAtkHp(charAttr, tokenId, log) {
  var id = charAttr.char.charId;
  charAttr.char.charId = tokenId;
  var token = getAttributes(charAttr.char, log);
  // console.log(token);
  charAttr.basic.atk = token.basic.atk;
  charAttr.basic.def = token.basic.def;
  charAttr.basic.maxHp = token.basic.maxHp;
  charAttr.basic.baseAttackTime = token.basic.baseAttackTime;
  charAttr.basic.attackSpeed = token.basic.attackSpeed;
  charAttr.char.charId = id;
  log.write(`[召唤物] ${tokenId} maxHp = ${charAttr.basic.maxHp}, atk = ${charAttr.basic.atk}, baseAttackTime = ${charAttr.basic.baseAttackTime}`);
}

function checkChar(char) {
  let charData = AKDATA.Data.character_table[char.charId];
  if (!('phase' in char)) char.phase = charData.phases.length - 1;
  if (!('level' in char)) char.level = charData.phases[char.phase].maxLevel;
  if (!('favor' in char)) char.favor = 200;
  if (!('skillLevel' in char)) char.skillLevel = 6;
  if (!('options' in char)) char.options = { cond: true, crit: true, token: false };
  if (!('potentialRank' in char)) char.potentialRank = 5;
}

class Log {
  constructor() {
    this.log = '';
    this.note = '';
  }

  write(line) { // 处理成markdown格式
    this.log += line.replace(/_/g, "\\_").replace(/\~/g, "_") + "\n";
  }
  writeNote(line) {
    if (this.note.indexOf(line) < 0) {
      this.log += "[注记] " + line + "\n";
      this.note += line + "\n";
    }
  }

  toString() {
    return this.log;
  }
}

class NoLog {
  write(line) { /* console.log(line); */}
  writeNote(line) {}
  toString() { return ""; }
}

// 天赋/技能名字cache
var displayNames = {};

function calculateDps(char, enemy, raidBuff) {
  let log = new Log();
  checkChar(char);
  enemy = enemy || {
    def: 0,
    magicResistance: 0,
    count: 1,
  };
  raidBuff = raidBuff || { atk: 0, atkpct: 0, ats: 0, cdr: 0, base_atk: 0, damage_scale: 0 };
  // 把raidBuff处理成blackboard的格式
  let raidBlackboard = {
    atk: raidBuff.atkpct / 100,
    atk_override: raidBuff.atk,
    attack_speed: raidBuff.ats,
    sp_recovery_per_sec: raidBuff.cdr / 100,
    base_atk: raidBuff.base_atk / 100,
    damage_scale: 1 + raidBuff.damage_scale / 100
  };
  displayNames["raidBuff"] = "团辅";

  let charId = char.charId;
  let charData = AKDATA.Data.character_table[charId];
  let skillData = AKDATA.Data.skill_table[char.skillId];
  if (char.skillLevel == -1) char.skillLevel = skillData.levels.length - 1;

  let levelData = skillData.levels[char.skillLevel];
  let blackboard = getBlackboard(skillData.levels[char.skillLevel].blackboard) || {};

  // calculate basic attribute package
  let attr = getAttributes(char, log);
  blackboard.id = skillData.skillId;
  attr.buffList["skill"] = blackboard;

  console.log(charData.name, levelData.name);
  log.write(`| 角色 | 等级 | 技能 |`);
  log.write(`| :--: | :--: | :--: | `);
  log.write(`| ~${charId}~ - **${charData.name}**  | 精英 ${char.phase}, 等级 ${char.level}, 潜能 ${char.potentialRank+1} | ${levelData.name}, 等级 ${char.skillLevel+1} |`);

  displayNames[charId] = charData.name;
  displayNames[char.skillId] = levelData.name;  // add to name cache

  if (char.options.token && (checkSpecs(charId, "token") || checkSpecs(char.skillId, "token")))  {
    log.write("\n");
    log.writeNote("**召唤物dps，非本体**");
    var tokenId = checkSpecs(charId, "token") || checkSpecs(char.skillId, "token");      
    getTokenAtkHp(attr, tokenId, log);
  }

  // 原本攻击力的修正量
  if (raidBlackboard.base_atk != 0) {
    let delta = attr.basic.atk * raidBlackboard.base_atk;
    let prefix = (delta > 0 ? "+" : "");
    attr.basic.atk = Math.round(attr.basic.atk + delta);
    log.write(`[团辅] 原本攻击力变为 ${attr.basic.atk} (${prefix}${delta.toFixed(1)})`); 
  }

  var _backup = {
	basic: {...attr.basic},
//	enemy: {...enemy},
//	chr: {...charData},
//	level: {...levelData}
  };

  log.write(`- **技能**\n`);
  let skillAttack = calculateAttack(attr, enemy, raidBlackboard, true, charData, levelData, log);
  if (!skillAttack) return;
  var _note = `${log.note}`;
  
  log.write("----");
  attr.basic = _backup.basic;
//  enemy = _backup.enemy;
//  charData = _backup.chr;
//  levelData = _backup.level;

  log.write(`- **普攻**\n`); 
  let normalAttack = calculateAttack(attr, enemy, raidBlackboard, false, charData, levelData, log);
  if (!normalAttack) return;
 
  var globalDps = Math.round((normalAttack.totalDamage + skillAttack.totalDamage) / 
                         (normalAttack.dur.duration + normalAttack.dur.stunDuration + skillAttack.dur.duration + skillAttack.dur.prepDuration));
  var globalHps = Math.round((normalAttack.totalHeal + skillAttack.totalHeal) /
                         (normalAttack.dur.duration + normalAttack.dur.stunDuration + skillAttack.dur.duration + skillAttack.dur.prepDuration));
  //console.log(globalDps, globalHps);
  let killTime = 0;
  return {
    normal: normalAttack,
    skill: skillAttack,
    skillName: levelData.name,

    killTime: killTime,
    globalDps,
    globalHps,
    log: log.toString(),
    note: _note
  };
}

function calculateDpsSeries(char, enemy, raidBuff, key, series) {
  let log = new NoLog();
  checkChar(char);
  enemy = enemy || {
    def: 0,
    magicResistance: 0,
    count: 1,
  };
  raidBuff = raidBuff || { atk: 0, atkpct: 0, ats: 0, cdr: 0, base_atk: 0, damage_scale: 0 };
  // 把raidBuff处理成blackboard的格式
  let raidBlackboard = {
    atk: raidBuff.atkpct / 100,
    atk_override: raidBuff.atk,
    attack_speed: raidBuff.ats,
    sp_recovery_per_sec: raidBuff.cdr / 100,
    base_atk: raidBuff.base_atk / 100,
    damage_scale: 1 + raidBuff.damage_scale / 100
  };
  displayNames["raidBuff"] = "";

  let charId = char.charId;
  let charData = AKDATA.Data.character_table[charId];
  let skillData = AKDATA.Data.skill_table[char.skillId];
  if (char.skillLevel == -1) char.skillLevel = skillData.levels.length - 1;

  let levelData = skillData.levels[char.skillLevel];
  let blackboard = getBlackboard(skillData.levels[char.skillLevel].blackboard) || {};

  // calculate basic attribute package
  let attr = getAttributes(char, log);
  blackboard.id = skillData.skillId;
  attr.buffList["skill"] = blackboard;

  displayNames[charId] = charData.name;
  displayNames[char.skillId] = levelData.name;  // add to name cache

  if (char.options.token) {
    var tokenId = checkSpecs(charId, "token") || checkSpecs(char.skillId, "token");      
    getTokenAtkHp(attr, tokenId, log);
  }

  // 原本攻击力的修正量
  if (raidBlackboard.base_atk != 0) {
    let delta = attr.basic.atk * raidBlackboard.base_atk;
    let prefix = (delta > 0 ? "+" : "");
    attr.basic.atk = Math.round(attr.basic.atk + delta);
  }

  var results = {};
  series.forEach(x => {
    enemy[key] = x;

    let skillAttack = calculateAttack(attr, enemy, raidBlackboard, true, charData, levelData, log);
    if (!skillAttack) return;

    let normalAttack = calculateAttack(attr, enemy, raidBlackboard, false, charData, levelData, log);
    if (!normalAttack) return;

    globalDps = Math.round((normalAttack.totalDamage + skillAttack.totalDamage) / 
                           (normalAttack.dur.duration + normalAttack.dur.stunDuration + skillAttack.dur.duration + skillAttack.dur.prepDuration));
    globalHps = Math.round((normalAttack.totalHeal + skillAttack.totalHeal) /
                           (normalAttack.dur.duration + normalAttack.dur.stunDuration + skillAttack.dur.duration + skillAttack.dur.prepDuration));
    results[x] = {
      normal: normalAttack,
      skill: skillAttack,
      skillName: levelData.name,
      globalDps,
      globalHps,
    };
  });

  return results;
}


// 叠加计算指定的技能/天赋效果，返回buffFrame
function applyBuff(charAttr, buffFrm, tag, blackbd, isSkill, isCrit, log, enemy) {
  let { ...buffFrame } = buffFrm || initBuffFrame();
  let { ...blackboard } = blackbd;
  let basic = charAttr.basic;
  let charId = charAttr.char.charId;
  let skillId = charAttr.buffList["skill"].id;
  let options = charAttr.char.options;

  // 如果是技能期间，则取得技能ID, 否则不计算技能
  if (tag == "skill") {
    if (isSkill)
      tag = skillId;  
    else return buffFrm;
  }

  buffFrm.applied[tag] = true;
  let done = false; // if !done, will call applyBuffDefault() in the end
  /*
  if (isCrit)
    log.write("[暴击] " +displayNames[tag] + ": -");
  else 
    log.write(displayNames[tag] + ": -");
    */
  // console.log("bb", blackboard);
  // write log
  function writeBuff(text) {
    let line = [""];
    if (tag == skillId) line.push("[技能]");
    else if (tag == "raidBuff") line.push("[团辅/拐]");
    else line.push("[天赋]");
    
    if (checkSpecs(tag, "cond")) 
      if (options.cond) line.push("[触发]"); else line.push("[未触发]");
    if (checkSpecs(tag, "stack") && options.stack) line.push("[满层数]"); 
    // if (checkSpecs(tag, "crit")) line.push("[暴击]");
    if (checkSpecs(tag, "ranged_penalty")) line.push("[距离惩罚]");
    
    line.push(displayNames[tag] + ": ");
    if (text) line.push(text);
    log.write(line.join(" "));
  }

  // 一般计算
  function applyBuffDefault() {
    let prefix = 0;
    for (var key in blackboard) {
      switch (key) {
        case "atk":
        case "def":
          prefix = blackboard[key] > 0 ? "+" : "";
          buffFrame[key] += basic[key] * blackboard[key];
          if (blackboard[key] != 0)
            writeBuff(`${key}: ${prefix}${(blackboard[key]*100).toFixed(1)}% (${prefix}${(basic[key] * blackboard[key]).toFixed(1)})`);
          break;
        case "max_hp":
          prefix = blackboard[key] > 0 ? "+" : "";
          if (Math.abs(blackboard[key]) > 2) { // 加算
            buffFrame.maxHp += blackboard[key];
            writeBuff(`${key}: ${prefix}${blackboard[key]}`);
          } else if (blackboard[key] != 0) { // 乘算
            buffFrame.maxHp += basic.maxHp * blackboard[key];
            writeBuff(`${key}: ${prefix}${(blackboard[key]*100).toFixed(1)}% (${prefix}${(basic.maxHp * blackboard[key]).toFixed(1)})`);
          }
          break;
        case "base_attack_time":
          if (blackboard.base_attack_time < 0) { // 攻击间隔缩短 - 加算
            buffFrame.baseAttackTime += blackboard.base_attack_time;
            writeBuff(`base_attack_time: ${buffFrame.baseAttackTime.toFixed(3)}s`);
          } else {  // 攻击间隔延长 - 乘算
            buffFrame.baseAttackTime += basic.baseAttackTime * blackboard.base_attack_time;
            writeBuff(`base_attack_time: +${(basic.baseAttackTime * blackboard.base_attack_time).toFixed(3)}s`);
          }
          break;
        case "attack_speed":
          if (blackboard[key] == 0) break;
          prefix = blackboard[key] > 0 ? "+" : "";
          buffFrame.attackSpeed += blackboard.attack_speed;
          writeBuff(`attack_speed: ${prefix}${blackboard.attack_speed}`);
          break;
        case "sp_recovery_per_sec":
          buffFrame.spRecoveryPerSec += blackboard.sp_recovery_per_sec;
          if (blackboard[key]>0) writeBuff(`sp: +${buffFrame.spRecoveryPerSec}/s`);
          break;
        case "atk_scale":
        case "def_scale":
        case "heal_scale":
        case "damage_scale":
          buffFrame[key] *= blackboard[key];
          if (blackboard[key] != 1) writeBuff(`${key}: ${blackboard[key].toFixed(2)}x`);
          break;
        case "attack@atk_scale":
          buffFrame.atk_scale *= blackboard["attack@atk_scale"];
          writeBuff(`atk_scale: ${buffFrame.atk_scale.toFixed(2)}`);
          break;
        case "attack@heal_scale":
          buffFrame.heal_scale *= blackboard["attack@heal_scale"];
          writeBuff(`heal_scale: ${buffFrame.heal_scale.toFixed(2)}`);
          break;
        case "max_target":
        case "attack@max_target":
          buffFrame.maxTarget = blackboard[key];
          writeBuff(`maxTarget: ${blackboard[key]}`);
          break;
        case "times":
        case "attack@times":
          buffFrame.times = blackboard[key];
          writeBuff(`攻击次数: ${blackboard[key]}`);
          break;
        case "magic_resistance":
          if (blackboard[key] < -1) { // 魔抗减算
            buffFrame.emr += blackboard[key];
            writeBuff(`敌人魔抗: ${blackboard[key]}% (加算)`);
          } else if (blackboard[key] < 0) { // 魔抗乘算
            buffFrame.emr_scale *= (1+blackboard[key]);
            writeBuff(`敌人魔抗: ${(blackboard[key]*100).toFixed(1)}% (乘算)`);
          } // 大于0时为增加自身魔抗，不计算
          break;
        case "prob":
          if (!blackboard["prob_override"]) {
            buffFrame.prob = blackboard[key];
            writeBuff(`概率(原始): ${Math.round(buffFrame.prob*100)}%`);
          }
          break;
        // 计算值，非原始数据
        case "edef":  // 减甲加算值（负数）
          buffFrame.edef += blackboard[key];
          writeBuff(`敌人护甲: ${blackboard[key]}`);
          break;
        case "edef_scale": // 减甲乘算值
          buffFrame.edef_scale *= (1+blackboard[key]);
          writeBuff(`敌人护甲: ${blackboard[key] *100}%`);
          break;
        case "edef_pene": // 无视护甲加算值
          buffFrame.edef_pene += blackboard[key];
          writeBuff(`无视护甲（最终加算）: -${blackboard[key]}`);
          break;
        case "edef_pene_scale":
          buffFrame.edef_pene_scale = blackboard[key];
          writeBuff(`无视护甲（最终乘算）: -${blackboard[key]*100}%`);
          break;
        case "emr_pene":  // 无视魔抗加算值
          buffFrame.emr_pene += blackboard[key];
          writeBuff(`无视魔抗（加算）: -${blackboard[key]}`);
          break;
        case "prob_override": // 计算后的暴击概率
          buffFrame.prob = blackboard[key];
          writeBuff(`概率(计算): ${Math.round(buffFrame.prob*100)}%`);
          break;
        case "atk_override":  // 加算的攻击团辅
          buffFrame.atk += blackboard[key];
          prefix = blackboard[key] > 0 ? "+" : "";
          if (blackboard[key] != 0)
            writeBuff(`atk(+): ${prefix}${(blackboard[key]*100).toFixed(1)}`);
          break;
      }
    }
  }
// 特判
//------------------------d----------------------------------------------------------------
  // 备注信息
  if (isSkill && !isCrit && checkSpecs(tag, "note")) {
    log.writeNote(checkSpecs(tag, "note"));
    //console.log("here");
  }

  if (checkSpecs(tag, "cond")) { // 触发天赋类
    if (!options.cond) { // 未触发时依然生效的天赋
      switch (tag) {
        case "tachr_348_ceylon_1": // 锡兰
          buffFrame.atk += basic.atk * blackboard['ceylon_t_1[common].atk'];
          writeBuff(`非水地形 atk + ${buffFrame.atk.toFixed(1)}`);
          break;
        case "skchr_glacus_2":  // 格劳克斯
          buffFrame.atk_scale = blackboard["atk_scale[normal]"];
          writeBuff(`atk_scale = ${buffFrame.atk_scale} 不受天赋影响`);
        case "skchr_cutter_2":
          applyBuffDefault(); break;
        case "tachr_145_prove_1": // 普罗旺斯
          applyBuffDefault(); break;
        case "tachr_226_hmau_1":
          delete blackboard["heal_scale"];
          applyBuffDefault(); break;
        case "tachr_279_excu_trait":
          if (isSkill && skillId == "skchr_excu_1") {
            log.writeNote("技能享受特性加成");
            applyBuffDefault();
          }
          break;
        case "tachr_440_pinecn_trait":
          if (isSkill && skillId == "skchr_pinecn_2") {
            log.writeNote("技能享受特性加成");
            applyBuffDefault();
          }
          break;
        case "tachr_113_cqbw_2":  // W: 技能眩晕必定有天赋加成
          if (isSkill) {
            log.writeNote("技能享受天赋加成");
            applyBuffDefault();
          }
          break;
        case "tachr_1012_skadi2_2":
          log.writeNote("无深海猎人");
          blackboard.atk = blackboard["skadi2_t_2[atk][1].atk"];
          applyBuffDefault();
          break;
      };
      done = true;
    } else {
      switch (tag) {
        case "tachr_348_ceylon_1":  // 锡兰
          buffFrame.atk += basic.atk * blackboard['celyon_t_1[map].atk'];  // yj手癌
          writeBuff(`水地形 atk + ${buffFrame.atk.toFixed(1)}`);
          done = true; break;
        case "skchr_glacus_2":
          buffFrame.atk_scale = blackboard["atk_scale[drone]"];
          writeBuff(`atk_scale = ${buffFrame.atk_scale} 不受天赋影响`);
          done = true; break;
        case "skchr_cutter_2":
          buffFrame.maxTarget = blackboard.max_target;
          buffFrame.atk_scale = blackboard.atk_scale * blackboard["cutter_s_2[drone].atk_scale"];
          writeBuff(`对空 atk_scale = ${buffFrame.atk_scale}`);
          done = true; break;
        case "tachr_187_ccheal_1": // 贾维尔
          buffFrame.def += blackboard.def;
          blackboard.def = 0;
          writeBuff(`def +${buffFrame.def}`);
          break;
        case "tachr_145_prove_1":
          blackboard.prob_override = blackboard.prob2;
          break;
        case "tachr_333_sidero_1":
          delete blackboard.times;
          break;
        case "tachr_197_poca_1": // 早露
          blackboard.edef_pene_scale = blackboard["def_penetrate"];
          break;
        case "tachr_358_lisa_2":  // 铃兰2
          if (isSkill && skillId == "skchr_lisa_3")
            delete blackboard.damage_scale; // 治疗不计易伤
          break;
        case "tachr_366_acdrop_1": // 酸糖1: 不在这里计算
          done = true; break;
        case "tachr_416_zumama_1":
          delete blackboard.hp_ratio; break;
        case "tachr_347_jaksel_1":
          blackboard.attack_speed = blackboard["charge_atk_speed_on_evade.attack_speed"];
          break;
        case "tachr_452_bstalk_trait":
          if (options.token) {
            done = true;
            log.writeNote("特性对召唤物无效");
          }
          break;
        case "tachr_402_tuye_1":
          blackboard.heal_scale = blackboard.heal_scale_2;
          break;
        case "tachr_457_blitz_1":
          if (isSkill && skillId == "skchr_blitz_2")
            blackboard.atk_scale *= charAttr.buffList.skill.talent_scale;
          break;
        case "tachr_472_pasngr_1":
          blackboard.damage_scale = blackboard["pasngr_t_1[enhance].damage_scale"];
          break;
        case "tachr_1012_skadi2_2":
          log.writeNote("有深海猎人");
          blackboard.atk = blackboard["skadi2_t_2[atk][2].atk"];
          break;
      }
    }
  } else if (checkSpecs(tag, "ranged_penalty")) { // 距离惩罚类
    if (!options.ranged_penalty) done = true;
  } else if (checkSpecs(tag, "stack")) { // 叠层类
    if (options.stack) { // 叠层天赋类
      if (tag == "tachr_2015_dusk_1" && options.token) done = true;
      else {
        if (blackboard.max_stack_cnt) {
          ["atk", "def", "attack_speed", "max_hp"].forEach(key => {
            if (blackboard[key]) blackboard[key] *= blackboard.max_stack_cnt;
          });
        } else if (["tachr_188_helage_1", "tachr_337_utage_1", "tachr_475_akafyu_1"].includes(tag)) {
          blackboard.attack_speed = blackboard.min_attack_speed;
        }
      }
    } else done = true;
  } else { // 普通类
   // console.log(tag, options);
    switch (tag) {
      // ---- 天赋 ----
      case "tachr_185_frncat_1":  // 慕斯
        buffFrame.times = 1 + blackboard.prob;
        writeBuff(`攻击次数 x ${buffFrame.times}`);
        done = true; break;
      case "tachr_118_yuki_1":  // 白雪
        buffFrame.atk = basic.atk * blackboard.atk;
        buffFrame.baseAttackTime = blackboard.base_attack_time;
        writeBuff("攻击间隔+0.2s, atk+0.2x");
        done = true; break;
      case "tachr_144_red_1": // 红
        writeBuff(`min_atk_scale: ${blackboard.atk_scale}`);
        done = true; break;
      case "tachr_117_myrrh_1":
      case "tachr_2014_nian_2":
      case "tachr_215_mantic_1": // 狮蝎，平时不触发
        done = true; break;
      case "tachr_164_nightm_1":  // 夜魔 仅2技能加攻
        if (skillId == "skchr_nightm_1") done = true;
        break;
      case "tachr_130_doberm_1":
      case "tachr_308_swire_1": // 诗怀雅: 不影响自身
        writeBuff("对自身无效");
        done = true; break;
      case "tachr_109_fmout_1": // 远山
        if (skillId == "skcom_magic_rage[2]") {
          blackboard.attack_speed = 0;
          log.writeNote("抽攻击卡");          
        } else if (skillId == "skchr_fmout_2") {
          blackboard.atk = 0;
          log.writeNote("抽攻速卡");
        }
        break;
      case "tachr_147_shining_1": // 闪灵
        writeBuff(`def +${blackboard.def}`);
        buffFrame.def += blackboard.def;
        blackboard.def = 0;
        break;
      case "tachr_367_swllow_1": // 灰喉
        blackboard.attack_speed = 0;  // 特判已经加了
        break;
      case "tachr_279_excu_1": // 送葬
      case "tachr_391_rosmon_1":
      case "skchr_pinecn_1":
        blackboard.edef_pene = blackboard["def_penetrate_fixed"];
        break;
      case "tachr_373_lionhd_1":  // 莱恩哈特
        blackboard.atk *= Math.min(enemy.count, blackboard.max_valid_stack_cnt);
        break;
      // 暴击类
      case "tachr_290_vigna_1":
        blackboard.prob_override = (isSkill ? blackboard.prob2 : blackboard.prob1);
        break;
      case "tachr_106_franka_1": // 芙兰卡
        blackboard.edef_pene_scale = 1;
        if (isSkill && skillId == "skchr_franka_2")
          blackboard.prob_override = 0.5;
        break;
      case "tachr_155_tiger_1":
        blackboard.prob_override = blackboard["tiger_t_1[evade].prob"];
        blackboard.atk = blackboard["charge_on_evade.atk"];
        break;
      case "tachr_340_shwaz_1":
        if (isSkill) blackboard.prob_override = charAttr.buffList.skill["talent@prob"];
        blackboard.edef_scale = blackboard.def;
        delete blackboard["def"]; 
        break;
      case "tachr_225_haak_1":
        blackboard.prob_override = 0.25;
        break;
      case "tachr_2013_cerber_1":
        delete blackboard["atk_scale"];
        break;
      case "tachr_401_elysm_1":
        delete blackboard["attack_speed"];
        break;
      case "tachr_345_folnic_1":
        delete blackboard["damage_scale"];
        break;
      case "tachr_344_beewax_trait":
      case "tachr_388_mint_trait":
      case "tachr_388_mint_1":
        if (isSkill) done = true; break;
      case "tachr_426_billro_2":
        done = true; break;
      case "tachr_426_billro_trait":
        if (isSkill && !(skillId == "skchr_billro_1" && options.charge)) {
          done = true;
        }
        break;
      case "tachr_411_tomimi_1":
        if (!isSkill) done = true; break;
      case "tachr_509_acast_1":
      case "tachr_350_surtr_1":
        blackboard.emr_pene = blackboard.magic_resist_penetrate_fixed;
        break;
        // ---- 技能 ----
      case "skchr_swllow_1":
      case "skchr_helage_1":
      case "skchr_helage_2":
      case "skchr_akafyu_1":
      case "skchr_excu_2":
      case "skchr_bpipe_2":
      case "skchr_acdrop_2":
      case "skchr_spikes_1":
        buffFrame.times = 2;
        writeBuff(`攻击次数 = ${buffFrame.times}`);
        break;
      case "skchr_excu_1":
        delete blackboard.atk_scale; break;
      case "skchr_texas_2":
        buffFrame.times = 2;
        buffFrame.maxTarget = 999;
        writeBuff(`攻击次数 = ${buffFrame.times} 最大目标数 = ${buffFrame.maxTarget}`);
        break;
      case "skchr_swllow_2":
      case "skchr_bpipe_3":
        buffFrame.times = 3;
        writeBuff(`攻击次数 = ${buffFrame.times}`);
        break;
      case "skchr_milu_2":  // 守林(茂名版)
        buffFrame.times = Math.min(enemy.count, blackboard.max_cnt);
        log.writeNote(`核弹数量: ${buffFrame.times} (按全中计算)`);
        buffFrame.maxTarget = 999;
        break;
      case "skchr_cqbw_3":  // D12(茂名版)
        buffFrame.times = Math.min(enemy.count, blackboard.max_target);
        blackboard.max_target = 999;
        log.writeNote(`炸弹数量: ${buffFrame.times} (按全中计算)`);
        break;
      case "skchr_iris_2":  // 爱丽丝2
        buffFrame.times = Math.min(enemy.count, blackboard.max_target);
        blackboard.max_target = 999;
        log.writeNote(`睡眠目标数量: ${buffFrame.times}\n其余目标按全中计算`);
        break;
      case "skchr_lava2_1":  // sp炎熔1
        delete blackboard["attack@max_target"];
        buffFrame.times = Math.min(2, enemy.count);
        log.writeNote(`按全中计算`);
        break;
      case "skchr_lava2_2":
        buffFrame.times = 2;
        log.writeNote(`按火圈叠加计算`);
        break;
      case "skchr_slbell_1":  // 不结算的技能
      case "skchr_shining_2": 
      case "skchr_cgbird_2":
        done = true; break;
      // 多段暖机
      case "skchr_amgoat_1":
        if (options.warmup) {
          blackboard.atk = blackboard['amgoat_s_1[b].atk'];
          blackboard.attack_speed = blackboard['amgoat_s_1[b].attack_speed'];
          if (isSkill) log.writeNote("暖机完成");
        } else {
          blackboard.attack_speed = blackboard["amgoat_s_1[a].attack_speed"];
          log.writeNote("首次启动时");
        }
        break;
      case "skchr_thorns_3":
        if (options.warmup) {
          blackboard.atk = blackboard["thorns_s_3[b].atk"];
          blackboard.attack_speed = blackboard["thorns_s_3[b].attack_speed"];
          if (isSkill) log.writeNote("暖机完成");
        } else
          log.writeNote("首次启动时");
        if (options.ranged_penalty) {
          buffFrame.atk_scale = 1;
          if (isSkill) log.writeNote(`技能不受距离惩罚`);
        }
        break;
      case "skchr_pinecn_2":
        if (options.warmup) {
          blackboard.atk = blackboard['pinecn_s_2[d].atk'];
          if (isSkill) log.writeNote("按攻击力叠满计算");
        } else {
          blackboard.atk = blackboard['pinecn_s_2[a].atk'];
          if (isSkill) log.writeNote("首次启动时");
        }
        break;
      case "skchr_amgoat_2":
        blackboard.atk_scale = blackboard.fk;
        break;
      case "skchr_breeze_2":
        buffFrame.maxTarget = 1; break;
      case "skchr_snsant_2":
      case "skchr_demkni_2":
      case "skchr_demkni_3":
      case "skchr_hsguma_3":
      case "skchr_waaifu_2":
      case "skchr_sqrrel_2":
      case "skchr_panda_2":
      case "skchr_red_2":
      case "skchr_phatom_3":
      case "skchr_weedy_3":
      case "skchr_asbest_2":
      case "skchr_folnic_2":
      case "skchr_chiave_2":
      case "skchr_mudrok_2":
      case "skchr_siege_2":
      case "skchr_glady_3":
        buffFrame.maxTarget = 999;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        break;
      case "skchr_durnar_2":
        buffFrame.maxTarget = 3;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        break;
      case "skchr_saga_2":
        buffFrame.maxTarget = 6;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        break;
      case "skchr_huang_3": // 可变攻击力技能，计算每段攻击力表格以和其他buff叠加
        buffFrame.maxTarget = 999;
        buffFrame.atk_table = [...Array(8).keys()].map(x => blackboard.atk / 8 *(x+1));
        writeBuff(`技能攻击力加成: ${buffFrame.atk_table.map(x => x.toFixed(2))}`);
        break;
      case "skchr_phatom_2":
        buffFrame.atk_table = [...Array(blackboard.times).keys()].reverse().map(x => blackboard.atk * (x+1));
        writeBuff(`技能攻击力加成: ${buffFrame.atk_table.map(x => x.toFixed(2))}`);
        delete blackboard.times;
        break;
      case "skchr_bluep_2":
        // 蓝毒2: 只对主目标攻击多次
        buffFrame.maxTarget = 3;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}, 主目标命中 ${blackboard["attack@times"]} 次`);
        delete blackboard["attack@times"]; // 额外攻击后面计算
        break;
      case "skchr_bluep_1":
      case "skchr_breeze_1":
      case "skchr_grani_2":
      case "skchr_astesi_2":
      case "skchr_hpsts_2":
      case "skchr_myrrh_1":
      case "skchr_myrrh_2":
      case "skchr_whispr_1":
        buffFrame.maxTarget = 2;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        break;
      case "skchr_folivo_1":
      case "skchr_folivo_2":
      case "skchr_deepcl_1":
        if (!options.token) {
          blackboard.atk = 0; // 不增加本体攻击
          blackboard.def = 0;
        }
        break;
      case "skchr_kalts_2":
        if (options.token) {
          delete blackboard.attack_speed;
          blackboard.atk = blackboard["attack@atk"];
          buffFrame.maxTarget = 3;
        } // else attack_speed ok, attack@atk no effect.
        break;
      case "skchr_kalts_3":
        if (options.token) {
          blackboard.atk = blackboard["attack@atk"];
          blackboard.def = blackboard["attack@def"];
        }
        break;
      case "skchr_skadi2_3":
        delete blackboard.atk_scale;
      case "skchr_sora_2":
      case "skchr_skadi2_2":
        blackboard.atk = 0; // 不增加本体攻击
        blackboard.def = 0;
        break;
      case "skchr_swire_1":
        blackboard.atk = 0; // 1技能不加攻击
        break;
      case "skchr_ccheal_2": // hot记为额外治疗，不在这里计算
      case "skchr_ccheal_1":
        delete blackboard["heal_scale"];
        break;
      case "skchr_hmau_2":
      case "skchr_spot_1":
      case "tachr_193_frostl_1":
      case "skchr_mantic_2":
      case "skchr_glaze_2":
      case "skchr_zumama_2":
      case "skchr_shwaz_3": // 攻击间隔延长，但是是加算
        buffFrame.baseAttackTime += blackboard.base_attack_time;
        writeBuff(`base_attack_time + ${blackboard.base_attack_time}s`);
        blackboard.base_attack_time = 0;
        break;
      case "skchr_brownb_2":  // 攻击间隔缩短，但是是乘算负数
      case "skchr_whispr_2":
      case "skchr_pasngr_2":
      case "skchr_indigo_1":
        writeBuff(`base_attack_time: ${blackboard.base_attack_time}x`);
        blackboard.base_attack_time *= basic.baseAttackTime;
        break;
      case "skchr_mudrok_3":
        writeBuff(`base_attack_time: ${blackboard.base_attack_time}x`);
        blackboard.base_attack_time *= basic.baseAttackTime;
        buffFrame.maxTarget = basic.blockCnt;
        break;
      case "skchr_rosmon_3":
        writeBuff(`base_attack_time: ${blackboard.base_attack_time}x`);
        blackboard.base_attack_time *= basic.baseAttackTime;
        blackboard.edef = -160;
        if (options.rosmon_double) {
          blackboard.times = Math.min(enemy.count, 2);
          log.writeNote(`假设敌人抱团,受到【${blackboard.times}】次攻击`);
        }
        log.writeNote("计算token减防效果");
        break;
      case "skchr_aglina_2":  // 攻击间隔缩短，但是是乘算正数
      case "skchr_cerber_2":
      case "skchr_finlpp_2": 
      case "skchr_jaksel_2":
      case "skchr_iris_1":
      case "skchr_indigo_2":
        writeBuff(`base_attack_time: ${blackboard.base_attack_time}x`);
        blackboard.base_attack_time = (blackboard.base_attack_time - 1) * basic.baseAttackTime;
        break;
      case "skchr_angel_3": // 攻击间隔双倍减算
        writeBuff("攻击间隔双倍减算");
        blackboard.base_attack_time *= 2;
        break;
      case "skchr_whitew_2":
      case "skchr_spikes_2":
        buffFrame.maxTarget = 2;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        if (options.ranged_penalty) {
          buffFrame.atk_scale /= 0.8;
          if (isSkill) log.writeNote(`技能不受距离惩罚`);
        }
        break;
      case "skchr_ayer_2":
        delete blackboard.atk_scale;  // 断崖2记为额外伤害
      case "skchr_ayer_1":
      case "skchr_svrash_2":
      case "skchr_svrash_1":
      case "skchr_frostl_1":
        if (options.ranged_penalty) {
          buffFrame.atk_scale = 1;
          if (isSkill) log.writeNote(`技能不受距离惩罚`);
        }
        break;
      case "skchr_svrash_3":
        if (options.ranged_penalty) {
          buffFrame.atk_scale = 1;
          if (isSkill) log.writeNote(`技能不受距离惩罚`);
        }
        blackboard.def_scale = 1 + blackboard.def;
        delete blackboard.def;
        break;
      case "skchr_ceylon_1":
        if (options.ranged_penalty) {
          buffFrame.atk_scale /= 0.7;
          if (isSkill) log.writeNote(`技能不受距离惩罚`);
        }
        break;
      case "skchr_nightm_1":
        writeBuff(`治疗目标数 ${blackboard["attack@max_target"]}`);  
        delete blackboard["attack@max_target"];
        break;
      case "skchr_shotst_1":  // 破防类
      case "skchr_shotst_2":
        blackboard.edef_scale = blackboard.def;
        blackboard.def = 0;
        break;
      case "skchr_meteo_2":
        blackboard.edef = blackboard.def;
        blackboard.def = 0;
        break;
      case "skchr_slbell_2": // 初雪
        blackboard.edef_scale = blackboard.def;
        blackboard.def = 0;
        break;
      case "skchr_ifrit_2":
        blackboard.edef = blackboard.def;
        blackboard.def = 0;
        break;
      case "skchr_nian_3":
        blackboard.atk = blackboard["nian_s_3[self].atk"];
        break;
      case "skchr_nian_2":
      case "skchr_hsguma_2":
        writeBuff("计算反射伤害，而非DPS");
        break;
      case "skchr_yuki_2":
        blackboard["attack@atk_scale"] *= 3;
        writeBuff(`总倍率: ${blackboard["attack@atk_scale"]}`);
        break;
      case "skchr_waaifu_1":
        blackboard.atk = blackboard["waaifu_s_1[self].atk"];
        break;
      case "skchr_peacok_1":
        blackboard.prob_override = blackboard["peacok_s_1[crit].prob"];
        if (isCrit) blackboard.atk_scale = blackboard.atk_scale_fake;
        break;
      case "skchr_peacok_2":
        if (isCrit) {
          writeBuff(`成功 - atk_scale = ${blackboard["success.atk_scale"]}`);
          blackboard.atk_scale = blackboard["success.atk_scale"];
          buffFrame.maxTarget = 999;
        } else {
          writeBuff("失败时有一次普攻")
        }
        break;
      case "skchr_vodfox_1":
        buffFrame.damage_scale = 1 + (buffFrame.damage_scale - 1) * blackboard.scale_delta_to_one;
        break;
      case "skchr_silent_2":
      case "skchr_vodfox_2":
        if (isSkill) log.writeNote("召唤类技能，调整中");
        break;
      case "skchr_elysm_2":
        delete blackboard["def"];
        delete blackboard["max_target"];
        break;
      case "skchr_asbest_1":
        delete blackboard["damage_scale"];
        break;
      case "skchr_beewax_2":
      case "skchr_mint_2":
        delete blackboard["atk_scale"];
        break;
      case "skchr_tomimi_2":
        blackboard.prob_override = blackboard["attack@tomimi_s_2.prob"] / 3;
        delete blackboard.base_attack_time;
        if (isCrit) {
          blackboard.atk_scale = blackboard["attack@tomimi_s_2.atk_scale"];
          log.writeNote(`每种状态概率: ${(blackboard.prob_override*100).toFixed(1)}%`);
        }
        break;
      case "skchr_surtr_2":
        if (enemy.count == 1) {
          blackboard.atk_scale = blackboard["attack@surtr_s_2[critical].atk_scale"];
          log.writeNote(`对单目标倍率 ${blackboard.atk_scale.toFixed(1)}x`);
        }
        break;
      case "skchr_surtr_3":
        delete blackboard.hp_ratio;
        break;
      case "tachr_381_bubble_1":
        delete blackboard.atk;
        break;
      case "tachr_265_sophia_1":
        if (isSkill) {
          var ts = charAttr.buffList["skill"].talent_scale;
          if (skillId == "skchr_sophia_1") {
            blackboard.def = blackboard["sophia_t_1_less.def"] * ts;
            blackboard.attack_speed = blackboard["sophia_t_1_less.attack_speed"] * ts;
            writeBuff("1技能 - 自身享受一半增益");
          } else if (skillId == "skchr_sophia_2") {
            blackboard.def *= ts;
            blackboard.attack_speed *= ts;
            blackboard.max_target = basic.blockCnt;
            writeBuff("2技能 - 自身享受全部增益");
          }
        } else {
          delete blackboard.def;
          delete blackboard.attack_speed;
          writeBuff("非技能期间天赋对自身无效");
        }
        break;
      case "tachr_346_aosta_1":
        delete blackboard.atk_scale;
        break;
      case "skchr_blemsh_1":
        delete blackboard.heal_scale;
        break;
      case "skchr_rosmon_2":
        delete blackboard["attack@times"];
        break;
      case "tachr_1001_amiya2_1":
        if (isSkill) {
          blackboard.atk *= charAttr.buffList["skill"].talent_scale;
          blackboard.def *= charAttr.buffList["skill"].talent_scale;
        }
        break;
      case "skchr_amiya2_2":
        delete blackboard.times;
        delete blackboard.atk_scale;
        if (options.stack) {
          blackboard.atk = blackboard["amiya2_s_2[kill].atk"] * blackboard["amiya2_s_2[kill].max_stack_cnt"];
          log.writeNote("斩击伤害全部以叠满计算");
          log.writeNote("包括前三刀");
        }
        break;
      case "tachr_214_kafka_1":
        if (isSkill) applyBuffDefault();
        done = true; break;
      case "skchr_kafka_2":
        delete blackboard.atk_scale;
        break;
      case "skchr_f12yin_2":
        blackboard.def_scale = 1 + blackboard.def;
        buffFrame.maxTarget = 2;
        delete blackboard.def;
        break;
      case "skchr_f12yin_3":
        blackboard.prob_override = blackboard["talent@prob"];
        break;
      case "tachr_264_f12yin_1":
        delete blackboard.atk;
        break;
      case "tachr_264_f12yin_2":
        delete blackboard.prob;
        break;
      case "skchr_archet_1":
        delete blackboard.max_target;
        break;
      case "tachr_338_iris_trait":
      case "tachr_469_indigo_trait":
      case "tachr_338_iris_1":
      case "tachr_362_saga_2":
        done = true; break;
      case "skchr_tuye_1":
      case "skchr_tuye_2":
        delete blackboard.heal_scale;
        delete blackboard.atk_scale;
        break;
      case "skchr_saga_3":
        buffFrame.maxTarget = 2;
        writeBuff(`最大目标数 = ${buffFrame.maxTarget}`);
        if (options.cond) {
          buffFrame.times = 2;
          log.writeNote("半血2连击");
        }
        break;
      case "skchr_dusk_1":
      case "skchr_dusk_3":
        if (options.token) done = true; break;
      case "skchr_dusk_2":
        if (options.token) done = true;
        else {
          if (options.cond) {
            log.writeNote("触发半血增伤");
          } else delete blackboard.damage_scale;
        }
        break;
      case "skchr_weedy_2":
        if (options.token) delete blackboard.base_attack_time;
        else buffFrame.maxTarget = 999;
        break;
      case "tachr_455_nothin_1":
        done = true; break;
      case "skchr_nothin_2":
        delete blackboard.prob;
        if (!options.cond) {
          delete blackboard.attack_speed;
          log.writeNote("蓝/紫Buff");
        } else log.writeNote("红Buff(攻速)");
        break;
      case "skchr_ash_2":
        if (options.cond)
          blackboard.atk_scale = blackboard["ash_s_2[atk_scale].atk_scale"];
        break;
      case "skchr_ash_3":
        buffFrame.maxTarget = 999;
        break;
      case "skchr_blitz_2":
        delete blackboard.atk_scale;
        break;
      case "skchr_tachak_1":
        blackboard.edef_pene = blackboard.def_penetrate_fixed;
        delete blackboard.atk_scale;
        break;
      case "skchr_tachak_2":
        writeBuff(`base_attack_time: ${blackboard.base_attack_time}x`);
        blackboard.base_attack_time *= basic.baseAttackTime;
        if (!isCrit) delete blackboard.atk_scale;
        break;
      case "skchr_pasngr_3":
        done = true; break;
      case "skchr_toddi_1":
        blackboard.edef_scale = blackboard.def;
        delete blackboard.def;
        break;
      case "skchr_tiger_1":
      case "skchr_bena_1":
        blackboard.edef_pene_scale = blackboard["def_penetrate"];
        if (options.annie) {
          log.writeNote("替身-安妮模式");
          done = true;
        }
        break;
      case "skchr_bena_2":
        if (options.annie) {
          log.writeNote("替身-安妮模式");
          done = true;
        }
        break;
      case "skchr_billro_2":
        if (!options.charge) {
          delete blackboard.atk;
        }
        break;
    }
  }
  
  if (tag == "skchr_thorns_2") {
    log.writeNote("反击按最小间隔计算");
    blackboard.base_attack_time = blackboard.cooldown - (basic.baseAttackTime + buffFrame.baseAttackTime);
    buffFrame.attackSpeed = 0;
    blackboard.attack_speed = 0;
  }

  if (!done) applyBuffDefault();
  return buffFrame;
}

// 伤害类型判定
function extractDamageType(charData, chr, isSkill, skillDesc, skillBlackboard, options) {
  let charId = chr.charId;
  let skillId = skillBlackboard.id;
  let ret = 0;
  if (charData.profession == "MEDIC")
    ret = 2;
  else if (["char_1012_skadi2", "char_101_sora"].includes(charId)) {
    ret = 2;
  } else if (options.annie) {
    ret = 1;
  } else if (charData.description.includes('法术伤害') && !["char_260_durnar", "char_378_asbest"].includes(charId)) {
    ret = 1;
  }
  if (isSkill) {
    if (["法术伤害", "法术</>伤害", "伤害类型变为"].some(x => skillDesc.includes(x)))
      ret = 1;
    else if (["治疗", "恢复", "每秒回复"].some(x => skillDesc.includes(x)) && 
             !skillBlackboard["hp_recovery_per_sec_by_max_hp_ratio"]) {
      ret = 2;
    }
    // special character/skill overrides
    ret = checkSpecs(charId, "damage_type") || checkSpecs(skillId, "damage_type") || ret;
    if (options.token)
      ret = checkSpecs(skillId, "token_damage_type") || ret;
  } else if (chr.options.token) {
    ret = checkSpecs(charId, "token_damage_type") || ret;
    if (skillId == "skchr_mgllan_3") ret = 0;
  }
  return ~~ret;
}

// 重置普攻判定
function checkResetAttack(key, blackboard) {
  if (checkSpecs(key, "reset_attack") == "false") return false;
  else return (checkSpecs(key, "reset_attack") || 
          blackboard['base_attack_time'] || blackboard['attack@max_target'] ||
          blackboard['max_target']);
}

// 计算攻击次数和持续时间
function calcDurations(isSkill, attackTime, attackSpeed, levelData, buffList, buffFrame, enemyCount, options, log) {
  let blackboard = buffList.skill;
  let skillId = blackboard.id;
  let spData = levelData.spData;
  let duration = 0;
  let attackCount = 0;
  let stunDuration = 0;
  let prepDuration = 0;
  let startSp = 0;
  let rst = checkResetAttack(skillId, blackboard);

  log.write("\n**【循环计算】**");

  const spTypeTags = {
    1: "time",
    2: "attack",
    4: "hit",
    8: "special"
  };
  let tags = [spTypeTags[spData.spType]];  // 技能类型标记

  // 需要模拟的技能（自动回复+自动释放+有充能）
  if (checkSpecs(skillId, "sim")) {
    duration = 120;
    let fps = 30;
    let now = fps, sp = spData.initSp * fps, max_sp = 999 * fps;
    let last = {}, timeline = {}, total = {};
    let extra_sp = 0;
    const TimelineMarks = {
      "attack": "-",
      "skill": "+",
      "ifrit": "",
      "archet": "",
      "chen": "",
      "recover_sp": "\\*",
      "recover_overflow": "x",
      "reset_animation": "\\*",
    };
    // 技能动画(阻回)时间-帧
    let cast_time = checkSpecs(skillId, "cast_time") ||
                    checkSpecs(skillId, "cast_bat") * 100 / attackSpeed ||
                    attackTime * fps;
    let skill_time = Math.max(cast_time, attackTime * fps);

    function time_since(key) { return now - (last[key] || -999); }
    function action(key) {
      if (!timeline[now]) timeline[now] = [];
      timeline[now].push(key);
      last[key] = now;
      total[key] = (total[key] || 0) + 1;
      //console.log(now, key);
    }

    // init sp
    if (skillId == "skchr_amgoat_2" && buffList["tachr_180_amgoat_2"])
      sp = (buffList["tachr_180_amgoat_2"].sp_min + buffList["tachr_180_amgoat_2"].sp_max) / 2 * fps;
    else if (buffList["tachr_222_bpipe_2"])
      sp = buffList["tachr_222_bpipe_2"].sp * fps;
    last["ifrit"] = last["archet"] = last["chen"] = 1; // 落地即开始计算 记为1帧
    startSp = spData.spCost - sp / fps;

    // sp barrier
    max_sp = spData.spCost * fps;
    if (blackboard.ct) max_sp = spData.spCost * fps * blackboard.ct;
    if (blackboard.cnt) max_sp = spData.spCost * fps * blackboard.cnt;

    log.write(`[模拟] T = 120s, 初始sp = ${(sp/fps).toFixed(1)}, 技能sp = ${spData.spCost}, 技能动画时间 = ${Math.round(cast_time)} 帧, sp上限设为 ${max_sp / fps}`);
    log.write(`[模拟] 攻击间隔 ${attackTime.toFixed(3)}s`);
    if (checkSpecs(skillId, "attack_animation"))
      log.write(`[模拟] 攻击动画 = ${checkSpecs(skillId, "attack_animation")} 帧`);

    if (spData.spType == 1) {
      sp+=fps;  // 落地时恢复1sp
      log.write("[模拟] +1落地sp");
    }
    while (now <= duration * fps) {
      // normal attack
      if (sp < spData.spCost * fps &&
          time_since("attack") >= attackTime * fps &&
          time_since("skill")  >= skill_time) {
        action("attack");
        if (spData.spType == 2) sp += fps;
      }
      // skill
      if (sp >= spData.spCost * fps &&
          time_since("skill") >= skill_time &&
          (time_since("attack") >= attackTime * fps || (
            checkSpecs(skillId, "attack_animation") && time_since("attack") == checkSpecs(skillId, "attack_animation")
          ) ) ) {
        if (checkSpecs(skillId, "attack_animation") && time_since("attack") == checkSpecs(skillId, "attack_animation"))
          action("reset_animation");
        action("skill");
      }
      // sp recover
      if (time_since("skill") == 0)
        sp -= spData.spCost * fps;
      if (time_since("skill") >= cast_time && sp < max_sp) {
        if (spData.spType == 1) sp += (1 + buffFrame.spRecoveryPerSec);
      }
      // 乱火
      if (buffList["tachr_134_ifrit_2"] && time_since("ifrit") >= buffList["tachr_134_ifrit_2"].interval * fps) {
        action("ifrit");
        extra_sp = buffList["tachr_134_ifrit_2"].sp;
      }
      // 兰登战术/呵斥
      let intv_archet = (buffList["tachr_332_archet_1"] ? buffList["tachr_332_archet_1"].interval : 2.5);
      let intv_chen = buffList["tachr_010_chen_1"] ? buffList["tachr_010_chen_1"].interval : 4;
      if ((buffList["tachr_332_archet_1"] || options.archet) && time_since("archet") >= intv_archet * fps) {
        action("archet");
        extra_sp += 1;
      }
      if ((buffList["tachr_010_chen_1"] || options.chen) && time_since("chen") >= intv_chen * fps) {
        action("chen");
        extra_sp += 1;
      }
      if (time_since("skill") >= cast_time && extra_sp > 0) {
        sp += extra_sp * fps;
        if (sp <= max_sp) action("recover_sp");
        else {
          sp = max_sp;
          action("recover_overflow");
        }
      } 
      extra_sp = 0;
      ++now;
    }

    if (isSkill) {
      attackCount = total.skill;
      duration = attackCount * skill_time / fps;
    } else {
      attackCount = total.attack;
      duration -= total.skill * skill_time / fps;

      // 打印时间轴和特殊动作
      var line_str = "";
      Object.keys(timeline).forEach(t => {
        line_str += timeline[t].map(x => TimelineMarks[x]).join("");
      });
      log.write(`[模拟] 时间轴: `);
      log.write(`${line_str}`);
      log.write(`( \-: 普攻, \+: 技能, \\*: 充能, x: sp溢出 )`)
      
      if (total.ifrit)
        log.write(`[模拟] 莱茵回路(\\*): 触发 ${total.recover_sp} / ${total.ifrit} 次, sp + ${buffList["tachr_134_ifrit_2"].sp * total.recover_sp}`);
      if (total.archet)
        log.write(`[模拟] 兰登战术: 触发 ${total.archet} 次`);
      if (total.chen)
        log.write(`[模拟] 呵斥: 触发 ${total.chen} 次`);
      if (total.recover_sp)
        log.write(`[模拟] sp恢复成功 ${total.recover_sp} 次, 溢出 ${total.recover_overflow || 0} 次, 其余为技能期间无法恢复sp`);
      if (total.reset_animation)
        log.write(`[模拟] 取消攻击间隔(\\*) ${total.reset_animation} 次`);
    }
  } else {

  if (isSkill) {
    
    // 准备时间
    switch (skillId) {
      case "skchr_mudrok_3":
        prepDuration = blackboard.sleep; break;
      case "skchr_amiya2_2":
        prepDuration = 3.33; break;
      case "skchr_surtr_3":
        prepDuration = 0.67; break;
      case "skchr_ash_2":
        prepDuration = 1; break;
    }

    // 快速估算
    attackCount = Math.ceil((levelData.duration - prepDuration) / attackTime);
    duration = attackCount * attackTime;
    startSp = spData.spCost - spData.initSp;

    if (buffList["tachr_180_amgoat_2"]) { // 乱火
      var init_sp = spData.initSp + (buffList["tachr_180_amgoat_2"].sp_min + buffList["tachr_180_amgoat_2"].sp_max) / 2;
      startSp = spData.spCost - init_sp;
    } else if (buffList["tachr_222_bpipe_2"]) { // 军事传统
      startSp = spData.spCost - spData.initSp - buffList["tachr_222_bpipe_2"].sp;
    } else if (buffList["tachr_456_ash_2"]) {
      startSp = spData.spCost - spData.initSp - buffList["tachr_456_ash_2"].sp;
    } 
    // 重置普攻
    if (rst) {
      if (duration > (levelData.duration-prepDuration) && rst != "ogcd")
        log.write(`可能重置普攻`);
      duration = levelData.duration - prepDuration;
      // 抬手时间
      var frameBegin = Math.round((checkSpecs(skillId, "attack_begin") || 12));
      var t = frameBegin / 30;
      attackCount = Math.ceil((duration - t) / attackTime);
      log.write(`技能前摇: ${t.toFixed(3)}s, ${frameBegin} 帧`);
      if (!checkSpecs(skillId, "attack_begin")) log.write("（待实测）");
      else log.writeNote(`技能前摇: ${t.toFixed(3)}s`);
    }
    // 技能类型
    if (levelData.description.includes("持续时间无限") || checkSpecs(skillId, "toggle")) {
      if (skillId == "skchr_thorns_3" && !options.warmup) {}
      else if (skillId == "skchr_tuye_2") {
        log.writeNote("取技能时间=暖机时间");
        duration = spData.spCost / (1 + buffFrame.spRecoveryPerSec);
        attackCount = Math.ceil(duration / attackTime);
      } else if (skillId == "skchr_surtr_3") {
        var lock_time = buffList["tachr_350_surtr_2"]["surtr_t_2[withdraw].interval"];
        duration = Math.sqrt(600) + lock_time;
        attackCount = Math.ceil(duration / attackTime);
        log.write(`损失100%血量耗时: ${Math.sqrt(600).toFixed(1)}s，锁血时间: ${lock_time}s`);
        log.writeNote("不治疗最大维持时间");
      } else {
        attackCount = Math.ceil(1800 / attackTime);
        duration = attackCount * attackTime;
        if (checkSpecs(skillId, "toggle")) {
          log.writeNote("切换类技能 (记为1800s)"); tags.push("toggle");
        } else {
          log.writeNote("持续时间无限 (记为1800s)"); tags.push("infinity");
        }
      }
    } else if (spData.spType == 8) {
      if (levelData.duration <= 0 && blackboard.duration > 0) {
        // 砾的技能也是落地点火，但是持续时间在blackboard里
        levelData.duration = blackboard.duration;
	     	duration = blackboard.duration;
        attackCount = Math.ceil(levelData.duration / attackTime);
      }
      if (levelData.duration > 0) { // 自动点火
        tags.push("auto"); log.write('落地点火');
      } else if (checkSpecs(skillId, "passive")) { // 被动
        attackCount = 1;
        duration = attackTime;
        tags.push("passive"); log.write("被动");
      } else if (skillId == "skchr_phatom_2") { // 傀影2
        attackCount = blackboard.times;
        duration = attackTime * attackCount;
      } else {  // 摔炮
        attackCount = 1;
        duration = 0;
        tags.push("auto", "instant"); log.write("落地点火, 瞬发")
      }
    } else if (levelData.duration <= 0) { 
      if (checkSpecs(skillId, "instant_buff")) { // 瞬发的有持续时间的buff，例如血浆
        duration = blackboard.duration || checkSpecs(skillId, "duration");
        attackCount = Math.ceil(duration / attackTime);
        tags.push("instant", "buff"); log.writeNote("瞬发Buff，技能周期为Buff持续时间");
      } else if (skillId == "skchr_ash_2") {
        attackCount = 31;
        duration = attackTime * attackCount;
        log.write(`[特殊] ${displayNames["skchr_ash_2"]}: 攻击 31 次`);
      } else if (skillId == "skchr_toddi_2") {
        attackCount = 10;
        duration = attackTime * attackCount;
        log.write(`[特殊] ${displayNames["skchr_toddi_2"]}: 攻击 10 次`);
      } else { // 普通瞬发
        attackCount = 1;
        // 不占用普攻的瞬发技能，持续时间等于动画时间。否则持续时间为一次普攻间隔
        if (checkSpecs(skillId, "reset_attack") != "ogcd")
          duration = attackTime;
        tags.push("instant"); log.write("瞬发");
        // 施法时间
        if (checkSpecs(skillId, "cast_time")) {
          let ct = checkSpecs(skillId, "cast_time");
          if (duration < ct/30 || rst == "ogcd") {
            log.write(`[特殊] 技能释放时间: ${ct} 帧, ${(ct/30).toFixed(3)} s`);
            log.writeNote(`技能动画(阻回): ${ct} 帧`);
            if (spData.spType == 1 || rst == "ogcd")
              duration = ct / 30;
          }
        }
      }
    } else if (skillId == "skchr_glady_3") {
      attackCount = 6;
      attackTime = 1.5;
      log.writeNote("[特殊] 持续9秒，第7次拖拽无伤害");
    } else if (options.annie) {
      duration = 20;
      attackCount = Math.ceil(duration / attackTime);
      log.write("安妮模式 - 持续20s");
    }
    // 特判
    if (skillId == "skchr_huang_3") {
      attackCount -= 2;
      log.write(`[特殊] ${displayNames["skchr_huang_3"]}: 实际攻击 ${attackCount}段+终结`);
    }
    if (skillId == "skchr_sunbr_2") { // 古米2准备时间延长技能时间
      prepDuration = blackboard.disarm;
    } 
  } else { // 普攻
    // 眩晕处理
    if (skillId == "skchr_fmout_2") {
      stunDuration = blackboard.time;
    } else if (skillId == "skchr_peacok_2") {
      stunDuration = blackboard["failure.stun"] * (1 - blackboard.prob);
      log.write(`[特殊] 计算平均晕眩时间`);
    } else if (["skchr_amiya_2", "skchr_liskam_2", "skchr_ghost_2", "skchr_broca_2"].includes(skillId)) {
      stunDuration = blackboard.stun;
    } else if (skillId == "skchr_folivo_2" && options.token) {
      stunDuration = blackboard.stun;
    }
    if (stunDuration > 0) log.write(`晕眩: ${stunDuration}s`);
    
    // 快速估算
    let attackDuration = spData.spCost / (1 + buffFrame.spRecoveryPerSec) - stunDuration;
    // 施法时间
    if (checkSpecs(skillId, "cast_time")) {
      let ct = checkSpecs(skillId, "cast_time");
      if (attackTime > ct/30 && rst != "ogcd") {
        attackDuration -= (attackTime - ct/30);
        log.write(`[特殊] 技能释放时间: ${ct} 帧, 普攻时间偏移 ${(ct/30 - attackTime).toFixed(3)}s (${attackDuration.toFixed(3)}s)`);
        log.writeNote(`技能动画(阻回): ${ct} 帧`);
      }
    }

    attackCount = Math.ceil(attackDuration / attackTime);
    duration = attackCount * attackTime;
    // 重置普攻（瞬发/ogcd除外）
    if (rst && rst != "ogcd" && spData.spType != 8) {
      var dd = spData.spCost / (1 + buffFrame.spRecoveryPerSec);
      if (duration > dd)
        log.write(`可能重置普攻`);
      duration = dd;
      // 抬手时间
      var frameBegin = Math.round((checkSpecs(skillId, "attack_begin") || 12));
      var t = frameBegin / 30;
      attackCount = Math.ceil((duration - t) / attackTime);
      log.write(`技能前摇: ${t.toFixed(3)}s, ${frameBegin} 帧`);
      if (!checkSpecs(skillId, "attack_begin")) log.write("（待实测）");
    }

    // 技能类型
    switch (spData.spType) {
      case 8: // 被动或落地点火
        if (levelData.duration <= 0 && blackboard.duration > 0) {
          console.log("Duration? l/b", skillId, levelData.duration, blackboard.duration);
          levelData.duration = blackboard.duration;
        }
        if (levelData.duration > 0) {
          tags.push("auto");
          log.write(`[特殊] 落地点火 - 取普攻时间=技能持续时间`);
          log.writeNote("取普攻时间=技能持续时间");
		  attackDuration = levelData.duration;
          attackCount = Math.ceil(attackDuration / attackTime);
          duration = attackCount * attackTime;
        } else if (checkSpecs(skillId, "passive")) { // 被动
          attackCount = 10;
          duration = attackCount * attackTime;
          tags.push("passive");
          log.write(`[特殊] 被动 - 以10次普攻计算`);
          log.writeNote("以10次普攻计算");
        } else {
          attackDuration = 10;
          attackCount = Math.ceil(attackDuration / attackTime);
          duration = attackCount * attackTime;
          tags.push("auto", "instant");
          log.write(`[特殊] 落地点火/瞬发 - 以10s普攻计算`);
          log.writeNote("以10s普攻计算");
        }
        break;
      case 4: // 受击回复
        log.write(`受击回复`);
        break;
      case 2: // 攻击恢复
        log.write(`攻击回复`);
        attackCount = spData.spCost;

        let intv_chen = buffList["tachr_010_chen_1"] ? buffList["tachr_010_chen_1"].interval : 4;
        let intv_archet = buffList["tachr_332_archet_1"] ? buffList["tachr_332_archet_1"].interval : 2.5;
        let extra_sp = 0, next = true;

        // 枚举所需的最少攻击次数
        while (attackCount > 0 && next) {
          duration = attackCount * attackTime;
          extra_sp = 0;
          if (buffList["tachr_010_chen_1"] || options.chen)
            extra_sp += Math.floor(duration / intv_chen);
          if (buffList["tachr_332_archet_1"] || options.archet)
            extra_sp += Math.floor(duration / intv_archet);
          if (buffList["tachr_301_cutter_1"]) {
            let p = buffList["tachr_301_cutter_1"].prob;
            extra_sp += (skillId == "skchr_cutter_1" ? (attackCount*2+1)*p : attackCount*2*p); 
          }
          next = (attackCount + extra_sp >= spData.spCost);
          if (next) attackCount -= 1;
        }
        if (!next) attackCount += 1;
        duration = attackCount * attackTime;
        let line = [];
        if (buffList["tachr_010_chen_1"] || options.chen)
          line.push(`呵斥触发 ${Math.floor(duration / intv_chen)} 次`);
        if (buffList["tachr_332_archet_1"] || options.archet)
          line.push(`兰登战术触发 ${Math.floor(duration / intv_archet)} 次`);
        if (buffList["tachr_301_cutter_1"]) {
          let p = buffList["tachr_301_cutter_1"].prob;
          let _n = ( skillId == "skchr_cutter_1" ? (attackCount*2+1)*p : attackCount*2*p )
          line.push(`光蚀刻痕触发 ${_n.toFixed(2)} 次`);
        }
        if (line.length > 0) log.write(`[特殊] ${line.join(", ")}`);
        if (rst) {
          duration -= attackTime;
        }
        break;
      case 1: // 普通，前面已经算过一遍了，这里只特判
        let sp_rate = 1 + buffFrame.spRecoveryPerSec;
        if (buffList["tachr_002_amiya_1"]) { // 情绪吸收
          attackCount = Math.ceil((spData.spCost - stunDuration*sp_rate) / (buffList["tachr_002_amiya_1"]["amiya_t_1[atk].sp"] + attackTime*sp_rate));
          log.write(`[特殊] ${displayNames["tachr_002_amiya_1"]}: attack sp = ${attackCount * buffList["tachr_002_amiya_1"]["amiya_t_1[atk].sp"]}`);
          duration = attackCount * attackTime;
        } else if (buffList["tachr_134_ifrit_2"]) { // [莱茵回路]. 需要解出攻击次数
          let i = buffList["tachr_134_ifrit_2"].interval;
          let isp = i * sp_rate + buffList["tachr_134_ifrit_2"].sp;
          let recoverCount = Math.ceil((spData.spCost - i) / isp); // recoverCount >= (spCost - i) / isp
          let r = (spData.spCost - recoverCount * isp) / sp_rate;
          attackDuration = recoverCount * i + r;
          attackCount = Math.ceil(attackDuration / attackTime);
          //console.log(i, isp, recoverCount, r, attackDuration, attackCount);
          duration = attackDuration;
          log.write(`[特殊] ${displayNames["tachr_134_ifrit_2"]}: sp + ${recoverCount * buffList["tachr_134_ifrit_2"].sp}`); 
        } else if (checkSpecs(skillId, "instant_buff")) { // 不稳定血浆: 减去buff持续时间
          attackDuration -= blackboard.duration || checkSpecs(skillId, "duration");
          attackCount = Math.ceil(attackDuration / attackTime);
          duration = attackCount * attackTime;
          log.writeNote("瞬发Buff，技能周期为Buff持续时间");
        } else if (buffList["tachr_400_weedy_2"] && options.cannon) { // 水炮充能，持续20s/cd35s
          let m = Math.floor(spData.spCost / 55);
          let a = m * 6 + m * 55 * sp_rate; // 前m个水炮充能+自然恢复的sp量
          let b = 6 + 20 * sp_rate; // 最后一个水炮持续期间最多恢复的sp
          let c = 6;  // 最后一个水炮充的sp
          let r = 0; // 计算还需要多少时间充满
          if (a + b > spData.spCost) { // 技能会在b期间蓄好
            let y = Math.floor((spData.spCost - a) / (3 * sp_rate + 1.0));
            let z = (spData.spCost - a - y) / sp_rate - y*3;
            r = 3*y+z;
            c = Math.floor(r/3);
          } else {
            r = (spData.spCost - a - b) / sp_rate + 20;
          }
          attackDuration = m*55+r;
          attackCount = Math.ceil(attackDuration / attackTime);
          duration = attackDuration;
          log.write(`[特殊] ${displayNames["tachr_400_weedy_2"]}: 使用${m+1}个水炮, 充能sp=${m * 6 + c}`);
        } else if (buffList["tachr_426_billro_2"] && options.charge) { // 卡姐蓄力
          let chargeDuration = spData.spCost / (1 + buffFrame.spRecoveryPerSec + buffList["tachr_426_billro_2"].sp_recovery_per_sec);
          attackDuration += chargeDuration;
          duration = attackDuration;
          attackCount = 1;
          log.write(`[特殊] ${displayNames["tachr_426_billro_2"]}: 二段蓄力时间 ${chargeDuration.toFixed(1)} s`);
        }
        break;
        // todo: cast time
    } // switch

    // ogcd穿插收益
    if (rst == "ogcd") {
      var _ct = (checkSpecs(skillId, "cast_time") || 12) / 30;
      var weavingGain = (duration - spData.spCost - _ct) / duration * 100;
      log.write("[提示] 非GCD技能（技能不影响普攻间隔），计算器不计入穿插收益");
      if (weavingGain > 0) {
        log.writeNote(`OGCD技能/穿插收益: ${weavingGain.toFixed(1)}%`);
      }
    }
  } // else
  } // sim else

  // 计算实际命中次数
  // attackCount = 发动攻击的次数(swings), hitCount = 命中敌人的次数(hits)
  let hitCount = attackCount * buffFrame.times * enemyCount;
  // 蓝毒2
  if (isSkill) {
    if (skillId == "skchr_bluep_2") {
      hitCount += attackCount * (blackboard["attack@times"] - 1);
    } else if (["skcom_assist_cost[2]", "skchr_utage_1", "skchr_tachak_1"].includes(skillId)) { // 投降类
      hitCount = 0;
    }
  }

  log.write(`持续: ${duration.toFixed(3)} s`);
  log.write(`攻击次数: ${attackCount*buffFrame.times} (${buffFrame.times} 连击 x ${attackCount})`);

  return {
    attackCount,
    times: buffFrame.times,
    hitCount,
    duration,
    stunDuration,
    prepDuration,
    tags,
    startSp
  };
}

function calculateAttack(charAttr, enemy, raidBlackboard, isSkill, charData, levelData, log) {
  let charId = charAttr.char.charId;
  let buffList = charAttr.buffList;
  let blackboard = buffList.skill;
  let basicFrame = charAttr.basic;
  let options = charAttr.char.options;
 
  // 备注信息
  if (isSkill && checkSpecs(charId, "note"))
    log.writeNote(checkSpecs(charId, "note"));

  // 计算面板属性
  log.write("**【Buff计算】**");
  let buffFrame = initBuffFrame();
  for (var b in buffList) {
    let buffName = (b=="skill") ? buffList[b].id : b;
    //console.log(buffName);
    if (!checkSpecs(buffName, "crit"))
      buffFrame = applyBuff(charAttr, buffFrame, b, buffList[b], isSkill, false, log, enemy);
  }
  // 计算团辅
  if (options.buff)
    buffFrame = applyBuff(charAttr, buffFrame, "raidBuff", raidBlackboard, isSkill, false, log, enemy);

  // 攻击类型
  let damageType = extractDamageType(charData, charAttr.char, isSkill, levelData.description, blackboard, options);
  if (damageType == 2)
    buffFrame.atk_scale *= buffFrame.heal_scale;
  // 灰喉-特判
  if (buffList["tachr_367_swllow_1"]) {
    buffFrame.attackSpeed += buffList["tachr_367_swllow_1"].attack_speed;
    log.write(`[特殊] ${displayNames["tachr_367_swllow_1"]} - attack_speed + ${buffList["tachr_367_swllow_1"].attack_speed}`);
  }
  // 泡泡
  if (isSkill && blackboard.id == "skchr_bubble_2") {
    buffFrame.atk = basicFrame.def + buffFrame.def - basicFrame.atk;
    log.write(`[特殊] ${displayNames["skchr_bubble_2"]}: 攻击力以防御计算(${basicFrame.def + buffFrame.def})`);
  }
  // 迷迭香
  if (charId == "char_391_rosmon") {
    buffFrame.maxTarget = 999;
    log.write(`[特殊] ${displayNames[charId]}: maxTarget = 999`);
  }
  // 连击特判
  if (!isSkill && checkSpecs(charId, "times")) {
    var t = checkSpecs(charId, "times");
    buffFrame.times = t;
    log.write(`[连击] ${displayNames[charId]} - 攻击 ${t} 次`);
  }
  if (isSkill && checkSpecs(blackboard.id, "times")) {
    var t = checkSpecs(blackboard.id, "times");
    buffFrame.times = t;
    log.write(`[连击] ${displayNames[blackboard.id]} - 攻击 ${t} 次`);
  }
  
  // 瞬发技能的实际基础攻击间隔
  if (isSkill && checkSpecs(blackboard.id, "cast_bat")) {
    var f = checkSpecs(blackboard.id, "cast_bat");
    basicFrame.baseAttackTime = f / 30;
    log.write(`[特殊] ${displayNames[blackboard.id]} - 技能动画时间 ${(f/30).toFixed(3)}s, ${f} 帧`);
  }

  let finalFrame = getBuffedAttributes(basicFrame, buffFrame);
  let critBuffFrame = initBuffFrame();
  let critFrame = {};
  // 暴击面板
  if (options.crit) {
    log.write("**【暴击Buff计算】**");
    for (var b in buffList) {
      let buffName = (b=="skill") ? blackboard.id : b;
      critBuffFrame = applyBuff(charAttr, critBuffFrame, b, buffList[b], isSkill, true, log, enemy);
    }  
    // 计算团辅
    if (options.buff)
      critBuffFrame = applyBuff(charAttr, critBuffFrame, "raidBuff", raidBlackboard, isSkill, true, log, enemy);
    critFrame = getBuffedAttributes(basicFrame, critBuffFrame);
  }
  // ---- 计算攻击参数
  // 最大目标数
  if (charData.description.includes("阻挡的<@ba.kw>所有敌人") && buffFrame.maxTarget < basicFrame.blockCnt) {
    buffFrame.maxTarget = basicFrame.blockCnt;
  } else if (["所有敌人", "群体法术伤害", "群体物理伤害"].some(kw => charData.description.includes(kw))) {
    buffFrame.maxTarget = 999;
  } else if (charData.description.includes("恢复三个") &&
             !(isSkill && charId == "char_275_breeze"))
    buffFrame.maxTarget = 3;

  // 计算最终攻击间隔，考虑fps修正
  let fps = 30;
  // 攻速上下界
  let _spd = Math.min(Math.max(10, finalFrame.attackSpeed), 600);
  if (finalFrame.attackSpeed != _spd) {
    finalFrame.attackSpeed = _spd;
    log.writeNote("达到攻速极限");
  }

  // sec spec
  if (checkSpecs(blackboard.id, "sec") && isSkill) {
    let intv = 1;
    if (checkSpecs(blackboard.id, "interval")) {
      intv = checkSpecs(blackboard.id, "interval");
    }
    finalFrame.baseAttackTime = intv;
    finalFrame.attackSpeed = 100;
    buffFrame.attackSpeed = 0;
    log.writeNote(`每 ${intv} 秒造成一次伤害/治疗`);
  }

  let realAttackTime = finalFrame.baseAttackTime * 100 / finalFrame.attackSpeed;
 // if (options.token && blackboard.id != "skchr_mgllan_2") {
 //   realAttackTime = basicFrame.baseAttackTime; // token不计算攻速影响
 //   log.write("*** token不计算自身攻速，以最终攻击间隔数据为准 ***");
 // }
  let frame = realAttackTime * fps; 
  // 额外帧数补偿 https://bbs.nga.cn/read.php?tid=20555008
  let corr = checkSpecs(charId, "frame_corr") || 0;
  let corr_s = checkSpecs(blackboard.id, "frame_corr");
  if ((!(corr_s === false)) && isSkill) corr = corr_s;
  if (corr != 0) {
    let real_frame = Math.ceil(frame); // 有误差时，不舍入而取上界，并增加补正值(一般为1)
    real_frame += corr;
    var prefix = (corr>0 ? "+":"");
    if (isSkill) {
      log.write(`[补帧判定(测试)] 技能理论 ${Math.round(frame)} 帧 / 实际 ${real_frame} 帧`);
      log.writeNote("考虑帧数补正(参见计算过程)");
    } else {
      log.write(`[补帧判定(测试)] 普攻理论 ${Math.round(frame)} 帧 / 实际 ${real_frame} 帧`);
    }
    frame = real_frame;
  } else {
    frame = Math.round(frame); // 无误差时，舍入成帧数
  }
  let frameAttackTime = frame / fps;
  let attackTime = frameAttackTime;

  // 根据最终攻击间隔，重算攻击力
  if (isSkill && blackboard.id == "skchr_platnm_2") { // 白金
    let rate = (attackTime - 1) / (buffList["tachr_204_platnm_1"]["attack@max_delta"] - 1);
    // 熔断
    rate = Math.min(Math.max(rate, 0), 1);
    buffFrame.atk_scale = 1 + rate * (buffList["tachr_204_platnm_1"]["attack@max_atk_scale"] - 1);
    finalFrame = getBuffedAttributes(basicFrame, buffFrame); // 重算
    log.write(`[特殊] ${displayNames["tachr_204_platnm_1"]}: atk_scale = ${buffFrame.atk_scale.toFixed(3)} (${(rate*100).toFixed(1)}%蓄力)`);
  } else if (buffList["tachr_215_mantic_1"] && attackTime >= buffList["tachr_215_mantic_1"].delay) { // 狮蝎
    let atk = basicFrame.atk * buffList["tachr_215_mantic_1"].atk;
    log.write(`[特殊] ${displayNames["tachr_215_mantic_1"]}: atk + ${atk}`);
    finalFrame.atk += atk;
    buffFrame.atk = finalFrame.atk - basicFrame.atk;
  } 

  // 敌人属性
  let enemyBuffFrame = JSON.parse(JSON.stringify(buffFrame));
  // 处理对普攻也生效的debuff
  for (var b in buffList) {
    let buffName = (b=="skill") ? buffList[b].id : b;
    if (checkSpecs(buffName, "keep_debuff") && !enemyBuffFrame.applied[buffName]){
      log.writeNote("假设全程覆盖Debuff");
      enemyBuffFrame = applyBuff(charAttr, enemyBuffFrame, buffName, buffList[b], true, false, new Log(), enemy);
    }
  }
  let edef = Math.max(0, (enemy.def + enemyBuffFrame.edef) * enemyBuffFrame.edef_scale * (1-enemyBuffFrame.edef_pene_scale) - enemyBuffFrame.edef_pene);
  let emr = Math.min((enemy.magicResistance + enemyBuffFrame.emr) * enemyBuffFrame.emr_scale, 100);
  emr = Math.max(emr - enemyBuffFrame.emr_pene, 0);
  let emrpct = emr / 100;
  let ecount = Math.min(buffFrame.maxTarget, enemy.count);

  // 平均化惊蛰/异客伤害
  if ((charId == 'char_306_leizi' || charId == "char_472_pasngr") &&
      !(isSkill && blackboard.id == "skchr_leizi_2")) {
    let scale = 1, tot = 1, sks = [1];
    for (var i=0; i<ecount-1; ++i) {
        scale *= 0.8; tot += scale; sks.push(scale);
    }
    log.write(`[特殊] 电法: 原本伤害倍率: ${buffFrame.damage_scale.toFixed(2)}`);
    buffFrame.damage_scale *= tot / ecount;
    log.write(`[特殊] 电法: 连锁倍率: ${sks.map(x => x.toFixed(2))}, 平均伤害倍率 ${buffFrame.damage_scale.toFixed(2)}x`);
  }

  // 计算攻击次数和持续时间
  let dur = calcDurations(isSkill, attackTime, finalFrame.attackSpeed, levelData, buffList, buffFrame, ecount, options, log);
  // 暴击次数
  if (options.crit && critBuffFrame["prob"]) {
    if (damageType != 2) {
      if (buffList["tachr_155_tiger_1"])
        dur.critCount = dur.duration / 3 * critBuffFrame.prob;
      else
        dur.critCount = dur.attackCount * critBuffFrame.prob;

      if (dur.critCount > 1) dur.critCount = Math.floor(dur.critCount);
      // 折算为命中次数
      dur.hitCount = (dur.attackCount - dur.critCount) * dur.times * ecount;
      dur.critHitCount = dur.critCount * dur.times * ecount;
      if (buffList["tachr_222_bpipe_1"]) {
        dur.critHitCount = dur.critCount * dur.times * Math.min(enemy.count, 2);
      }
    } else {
      dur.critCount = 0; dur.critHitCount = 0;
    }
  } else {
    dur.critCount = 0; dur.critHitCount = 0;
  }

  //console.log(finalFrame, dur);
  // 输出面板数据
  log.write("\n**【最终面板】**");
  let atk_line = `(${basicFrame.atk.toFixed(1)} + ${buffFrame.atk.toFixed(1)}) * ${buffFrame.atk_scale.toFixed(2)}`;
  // if (buffFrame.damage_scale != 1) { atk_line += ` * ${buffFrame.damage_scale.toFixed(2)}`; }
  log.write(`攻击力 / 倍率:  ${finalFrame.atk.toFixed(2)} = ${atk_line}`);
  log.write(`攻击间隔: ${finalFrame.baseAttackTime.toFixed(3)} s`);
  log.write(`攻速: ${finalFrame.attackSpeed} %`);
  log.write(`最终攻击间隔: ${(realAttackTime * 30).toFixed(2)} 帧, ${realAttackTime.toFixed(3)} s`);
  if (corr!=0) {
    log.write(`**帧数补正后攻击间隔(测试): ${frame} 帧, ${frameAttackTime.toFixed(3)} s**`);
  } else {
    log.write(`**帧对齐攻击间隔: ${frame} 帧, ${frameAttackTime.toFixed(3)} s**`);
  }
  if (edef != enemy.def)
    log.write(`敌人防御: ${edef.toFixed(1)} (${(edef-enemy.def).toFixed(1)})`);
  if (emr != enemy.magicResistance) {
    rate = (emr-enemy.magicResistance)/enemy.magicResistance;
    log.write(`敌人魔抗: ${emr.toFixed(1)}% (${(rate*100).toFixed(1)}%)`);
  }
  if (ecount > 1 || enemy.count > 1)
    log.write(`目标数: ${ecount} / ${enemy.count}`);

  // 计算伤害
  log.write("\n**【伤害计算】**");
  log.write(`伤害类型: ${['物理','法术','治疗','真伤'][damageType]}`);
  let dmgPrefix = (damageType == 2) ? "治疗" : "伤害";
  let hitDamage = finalFrame.atk;
  let critDamage = 0;
  let damagePool = [0, 0, 0, 0, 0]; // 物理，魔法，治疗，真伤，盾
  let extraDamagePool = [0, 0, 0, 0, 0];
  let move = 0;

  function calculateHitDamage(frame, scale) {
    let minRate = 0.05, ret = 0;
    if (buffList["tachr_144_red_1"]) minRate = buffList["tachr_144_red_1"].atk_scale;
    if (buffList["tachr_366_acdrop_1"]) {
      minRate = options.cond ? buffList["tachr_366_acdrop_1"].atk_scale_2 : buffList["tachr_366_acdrop_1"].atk_scale;
    }
    if (damageType == 0)
      ret = Math.max(frame.atk - edef, frame.atk * minRate);
    else if (damageType == 1)
      ret = Math.max(frame.atk * (1-emrpct), frame.atk * minRate); 
    else 
      ret = frame.atk;
    if (ret <= frame.atk * minRate) log.write("[抛光]");
    if (scale != 1) { 
      ret *= scale;
      log.write(`damage_scale: ${scale.toFixed(2)}x`);
    }
    return ret;
  }
  
  hitDamage = calculateHitDamage(finalFrame, buffFrame.damage_scale);
  damagePool[damageType] += hitDamage * dur.hitCount;
  log.write(`${dmgPrefix}: ${hitDamage.toFixed(2)}, 命中 ${dur.hitCount.toFixed(1)}`);
  
  // 计算额外伤害
  // 暴击
  if (options.crit) {
    // console.log(critBuffFrame);
    if (isSkill && blackboard.id == "skchr_peacok_2") {
      log.write(`创世纪 - 成功（暴击）为全体法术伤害`);
      damageType = 1;
      ecount = enemy.count;
      dur.critHitCount = enemy.count;
    }
    edef = Math.max(0, (enemy.def + critBuffFrame.edef) * critBuffFrame.edef_scale * (1-critBuffFrame.edef_pene_scale) - critBuffFrame.edef_pene);
    if (edef != enemy.def)
      log.write(`[暴击]敌人防御: ${edef.toFixed(1)} (${(edef-enemy.def).toFixed(1)})`);
    critDamage = calculateHitDamage(critFrame, critBuffFrame.damage_scale);
    if (critDamage > 0) {
      log.write(`暴击${dmgPrefix}: ${critDamage.toFixed(2)}, 命中 ${dur.critHitCount.toFixed(1)}`);
    }
    damagePool[damageType] += critDamage * dur.critHitCount;
  }
  // 空(被动治疗没有写在天赋中)
  if (charId == "char_101_sora" || charId == "char_1012_skadi2") {
    let ratio_sora = 0.1;
    if (isSkill && blackboard.id == "skchr_skadi2_3")
      ratio_sora = 0;
    else if (isSkill && blackboard["attack@atk_to_hp_recovery_ratio"])
      ratio_sora = blackboard["attack@atk_to_hp_recovery_ratio"];
    extraDamagePool[2] = ratio_sora * finalFrame.atk * dur.duration * enemy.count;
    damagePool[2] = 0; damagePool[3] = 0; log.write("[特殊] 伤害为0 （以上计算无效），可以治疗召唤物");
    log.writeNote("可以治疗召唤物");
  }
  // 反射类-增加说明
  if (checkSpecs(blackboard.id, "reflect") && isSkill) {
    log.writeNote(`技能伤害为反射 ${dur.attackCount} 次的伤害`);
  }
  // 可变攻击力-重新计算
  if (checkSpecs(charId, "grad") || (checkSpecs(blackboard.id, "grad") && isSkill)) {
    if (blackboard.id == "skchr_kalts_3" && !options.token) {
      /* skip */
    } else {
      let kwargs = {
        charId, 
        skillId: blackboard.id,
        options,
        basicFrame,
        buffFrame,
        finalFrame,
        blackboard,
        dur,
        attackTime,
        hitDamage,
        damageType,
        edef,
        ecount,
        emrpct,
        log
      };
      log.write("[特殊] 可变技能，重新计算伤害 ----");
      damagePool[damageType] = calculateGradDamage(kwargs);
    }
  }

  // 额外伤害
  for (var b in buffList) {
    let buffName = b;
    let bb = buffList[b];  // blackboard
    if (buffName == "skill") {
      buffName = bb.id;
    }
    let pool = [0, 0, 0, 0, 0]; // 物理，魔法，治疗，真伤，盾
    let damage = 0;
    let heal = 0, atk = 0;

    if (!isSkill) { // 只在非技能期间生效
      switch (buffName) {
        // 伤害
        case "skchr_ethan_1":
          pool[1] += bb["attack@poison_damage"] * dur.duration * (1-emrpct) * ecount;
          break;
        case "skchr_aglina_2":
        case "skchr_aglina_3":
        case "skchr_beewax_1":
        case "skchr_beewax_2":
        case "skchr_billro_1":
        case "skchr_billro_2":
        case "skchr_billro_3":
        case "skchr_mint_1":
        case "skchr_mint_2":
          damagePool[1] = 0;
          log.write(`[特殊] ${displayNames[buffName]}: 伤害为0 （以上计算无效）`);
          break;
        case "skchr_bena_1":
        case "skchr_bena_2":
          if (options.annie && !isSkill) {
            damagePool[0] = 0; damagePool[1] = 0;
          }
          break;
        default:
          if (b=="skill") continue; // 非技能期间，跳过其他技能的额外伤害判定
      }
    }
    //console.log(buffName);
    switch (buffName) {
      case "tachr_129_bluep_1":
        damage = Math.max(bb.poison_damage * (1-emrpct), bb.poison_damage * 0.05);
        let total_damage = damage * dur.duration * ecount;
        if (isSkill && blackboard.id == "skchr_bluep_1" && ecount>1) {
          let damage2 = damage * blackboard.atk_scale;
          total_damage = damage * dur.duration + damage2 * 3;
          log.write(`[特殊] ${displayNames["skchr_bluep_1"]}: 副目标毒伤 ${damage2} * 3s`);
        }
        pool[1] += total_damage;
        log.writeNote("毒伤按循环时间计算");
        break;
      case "tachr_293_thorns_1":
        var poison = options.thorns_ranged ? bb["damage[ranged]"] : bb["damage[normal]"];
        damage = Math.max(poison * (1-emrpct), poison * 0.05) * dur.duration * ecount;
        pool[1] = damage;
        if (isSkill) log.writeNote("毒伤按循环时间计算");
        break;
      case "tachr_346_aosta_1":
        var poison = finalFrame.atk / buffFrame.atk_scale * bb.atk_scale;
        if (blackboard.id == "skchr_aosta_2") poison *= blackboard.talent_scale;
        log.write(`流血伤害/秒: ${poison.toFixed(1)}`);
        damage = Math.max(poison * (1-emrpct), poison * 0.05) * dur.duration * ecount;
        pool[1] = damage;
        if (isSkill) log.writeNote("毒伤按循环时间计算");
        break;
      case "tachr_181_flower_1":
        pool[2] += bb.atk_to_hp_recovery_ratio * finalFrame.atk * dur.duration * enemy.count;
        if (isSkill) log.writeNote("可以治疗召唤物");
        break;
      case "tachr_436_whispr_1":
        if (options.cond) {
          var ts = (blackboard.id == "skchr_whispr_2") ? blackboard.talent_scale : 1;
          var extra_hps = bb.atk_to_hp_recovery_ratio * finalFrame.atk * ts;
          pool[2] += extra_hps * dur.duration * enemy.count;
          log.write(`天赋hps: ${extra_hps.toFixed(1)}`); 
          if (isSkill) log.writeNote("天赋可以治疗召唤物");
        }
        break;
      case "tachr_188_helage_trait":
      case "tachr_337_utage_trait":
      case "tachr_475_akafyu_trait":
        pool[2] += bb.value * dur.hitCount; break;
      case "tachr_2013_cerber_1":
        damage = bb.atk_scale * edef * Math.max(1-emrpct, 0.05);
        pool[1] += damage * dur.hitCount;
        break;
      case "tachr_391_rosmon_trait":
        var ntimes = 1;
        if (isSkill && blackboard.id == "skchr_rosmon_2") ntimes = 3;
        var quake_atk = finalFrame.atk / buffFrame.atk_scale * bb["attack@append_atk_scale"];
        var quake_damage = Math.max(quake_atk - edef, quake_atk * 0.05);
        
        damage = quake_damage * dur.hitCount * ntimes;
        log.write(`${displayNames[buffName]}: 余震攻击力 ${quake_atk.toFixed(1)}, 单次伤害 ${quake_damage.toFixed(1)}, 次数 ${ntimes}`);
        log.write(`${displayNames[buffName]}: 余震命中 ${dur.hitCount * ntimes}, 总伤害 ${damage.toFixed(1)}`);
        pool[0] += damage;
        break;
      // 技能
      // 伤害类
      case "skchr_ifrit_2":
        damage = basicFrame.atk * bb["burn.atk_scale"] * Math.floor(bb.duration) * (1-emrpct);
        log.write(`[特殊] ${displayNames[buffName]}: 灼烧伤害 ${damage.toFixed(1)}, 命中 ${ecount}`);
        pool[1] += damage * dur.attackCount * ecount;
        break;
      case "skchr_amgoat_2":
        damage = finalFrame.atk/2 * (1 - enemy.magicResistance / 100);
        log.write(`[特殊] ${displayNames[buffName]}: 溅射伤害 ${damage.toFixed(1)}, 命中 ${dur.attackCount * (enemy.count-1)}`);
        pool[1] += damage * dur.attackCount * (enemy.count-1);
        break;
      case "skchr_nightm_2":
        move = bb.duration / 4;
        log.writeNote(`总位移估算为${move.toFixed(1)}格`);
        pool[3] += bb.value * move * ecount;
        break;
      case "skchr_weedy_3":
        if (options.token)
          move = bb.force*bb.force/3 + bb.duration / 5;
        else
          move = bb.force*bb.force/4 + bb.duration / 5;
        log.writeNote(`总位移估算为${move.toFixed(1)}格`);
        pool[3] += bb.value * move * ecount;
        break;
      case "skchr_huang_3":
        let finishAtk = basicFrame.atk * (1 + bb.atk) * bb.damage_by_atk_scale;
        damage = Math.max(finishAtk - enemy.def, finishAtk * 0.05);
        log.write(`[特殊] ${displayNames[buffName]}: 终结伤害 = ${damage.toFixed(1)}, 命中 ${ecount}`);
        pool[0] += damage * ecount;
        break;
      case "skchr_chen_2":
        damage = finalFrame.atk * (1 - emrpct);
        pool[1] += damage * dur.hitCount;
        log.write(`[特殊] ${displayNames[buffName]}: 法术伤害 = ${damage.toFixed(1)}, 命中 ${dur.hitCount}`);
        break;
      case "skchr_bibeak_1":
        if (enemy.count > 1) {
          damage = finalFrame.atk * (1 - emrpct);
          pool[1] += damage * (enemy.count - 1);
          log.write(`[特殊] ${displayNames[buffName]}: 法术伤害 = ${damage.toFixed(1)}, 命中 ${(enemy.count-1)}`);
        }
        break;
      case "skchr_ayer_2":
        damage = finalFrame.atk * bb.atk_scale * (1 - emrpct);
        pool[1] += damage * enemy.count * dur.hitCount;
        log.write(`[特殊] ${displayNames[buffName]}: 法术伤害 = ${damage.toFixed(1)}, 命中 ${enemy.count * dur.hitCount}`);
        log.writeNote("假设断崖的当前攻击目标也被阻挡");
        break;
      case "skcom_assist_cost[2]":
      case "skcom_assist_cost[3]":
      case "skchr_myrtle_2":
      case "skchr_elysm_2":
      case "skchr_skgoat_2":
      case "skchr_utage_1":
      case "skchr_snakek_2":
      case "skchr_blitz_1":
        damagePool[0] = 0; damagePool[1] = 0;
        log.write(`[特殊] ${displayNames[buffName]}: 伤害为0 （以上计算无效）`);
        break;
      case "skchr_silent_2":
      case "skchr_zebra_1":
        damagePool[2] = 0;
        log.write(`[特殊] ${displayNames[buffName]}: 治疗为0 （以上计算无效）`);
        break;
      case "skchr_sddrag_2":
        damage = finalFrame.atk * bb["attack@skill.atk_scale"] * (1-emrpct);
        log.write(`[特殊] ${displayNames[buffName]}: 法术伤害 = ${damage.toFixed(1)}, 命中 ${dur.hitCount}`);
        pool[1] += damage * dur.hitCount;
        break;
      case "skchr_haak_2":
      case "skchr_haak_3":
        log.writeNote(`攻击队友15次(不计入自身dps)`);
        break;
      case "skchr_podego_2":
        log.write(`[特殊] ${displayNames[buffName]}: 直接伤害为0 （以上计算无效）, 效果持续${bb.projectile_delay_time}秒`);
        damage = finalFrame.atk * bb.projectile_delay_time * (1-emrpct) * enemy.count;
        pool[1] = damage; damagePool[1] = 0;
        break;
      case "skchr_beewax_2":
      case "skchr_mint_2":
        if (isSkill) {
          damage = finalFrame.atk * bb.atk_scale * (1-emrpct) * ecount;
          pool[1] = damage;
        } 
        break;
      case "skchr_tomimi_2":
        if (isSkill && options.crit) {
          damage = Math.max(finalFrame.atk - enemy.def, finalFrame.atk * 0.05);
          log.write(`[特殊] ${displayNames[buffName]}: 范围伤害 ${damage.toFixed(1)}, 命中 ${dur.critHitCount * (enemy.count-1)}`);
          log.write(`[特殊] ${displayNames[buffName]}: 总共眩晕 ${(dur.critHitCount * bb["attack@tomimi_s_2.stun"]).toFixed(1)} 秒`)
          pool[0] += damage * dur.critHitCount * (enemy.count-1);
        }
        break;
      case "skchr_archet_1":
        atk = finalFrame.atk / bb.atk_scale * bb.atk_scale_2;
        let hit = Math.min(enemy.count-1, bb.show_max_target) * dur.hitCount;
        damage = Math.max(atk - enemy.def, atk * 0.05);
        log.write(`[特殊] ${displayNames[buffName]}: 分裂箭伤害 ${damage.toFixed(1)}, 命中 ${hit}`);
        pool[0] += damage * hit;
        break;
      case "skchr_archet_2":
        let n = Math.min(4, enemy.count-1);
        if (n>0) {
          let hit = (9-n)*n/2;
          log.write(`[特殊] ${displayNames[buffName]}: 弹射箭额外命中 ${hit} (${n} 额外目标)`);
          pool[0] += hitDamage * hit;
        }
        break;
      case "tachr_338_iris_trait":
      case "tachr_469_indigo_trait":
          if (isSkill && ["skchr_iris_2", "skchr_indigo_2"].includes(blackboard.id)) {} 
          else {
            let scale = (buffList["tachr_338_iris_1"] ? buffList["tachr_338_iris_1"].atk_scale : 1);
            damage = hitDamage * scale;
            let md = damage * 3 + hitDamage;
            log.write(`[特殊] ${displayNames[buffName]}: 蓄力伤害 ${damage.toFixed(1)}, 满蓄力伤害(3蓄+普攻) ${md.toFixed(1)}, 不计入dps`);
            log.writeNote(`满蓄力伤害 ${md.toFixed(1)}`);
            if (isSkill) log.writeNote("(不计入dps)");
          }
        break;
      case "skchr_ash_3":
        atk = finalFrame.atk / bb.atk_scale * (options.cond ? bb.hitwall_scale : bb.not_hitwall_scale);
        damage = Math.max(atk - enemy.def, atk * 0.05);
        pool[0] += damage * enemy.count;
        log.write(`[特殊] ${displayNames[buffName]}: 爆炸伤害 ${damage.toFixed(1)}, 命中 ${enemy.count}`);
        break;
      case "skchr_blitz_2":
        atk = finalFrame.atk * bb.atk_scale;
        damage = Math.max(atk - enemy.def, atk * 0.05);
        pool[0] += damage * enemy.count;
        log.write(`[特殊] ${displayNames[buffName]}: 范围伤害 ${damage.toFixed(1)}, 命中 ${enemy.count}`);
        break;
      case "skchr_rfrost_2":
        atk = finalFrame.atk / bb.atk_scale * bb.trap_atk_scale;
        damage = Math.max(atk - enemy.def, atk * 0.05);
        pool[0] += damage;
        log.write(`[特殊] ${displayNames[buffName]}: 陷阱伤害 ${damage.toFixed(1)}`);
        break;
      case "skchr_tachak_1":
        atk = finalFrame.atk * bb.atk_scale;
        damage = Math.max(atk * (1-emrpct), atk * 0.05);
        pool[1] += damage * bb.projectile_delay_time * enemy.count;
        log.write(`[特殊] ${displayNames[buffName]}: 燃烧伤害 ${damage.toFixed(1)}, 命中 ${bb.projectile_delay_time * enemy.count}`);
        break;
      case "skchr_pasngr_3":
        atk = finalFrame.atk * bb.atk_scale;
        damage = Math.max(atk * (1-emrpct), atk * 0.05) * buffFrame.damage_scale;
        pool[1] += damage * ecount * 8;
        log.write(`[特殊] ${displayNames[buffName]}: 雷击区域伤害 ${damage.toFixed(1)} (平均倍率 ${buffFrame.damage_scale.toFixed(2)}), 命中 ${8 * ecount}`);
        break;
      case "skchr_toddi_2":
        atk = finalFrame.atk / bb["attack@atk_scale"] * bb["attack@splash_atk_scale"];
        damage = Math.max(atk - enemy.def, atk * 0.05) * buffFrame.damage_scale;
        pool[0] += damage * enemy.count * dur.hitCount;
        log.write(`[特殊] ${displayNames[buffName]}: 爆炸伤害 ${damage.toFixed(1)}, 命中 ${enemy.count * dur.hitCount}`);
        break;
      case "skchr_indigo_2":
        if (options.cond) {
          atk = finalFrame.atk * bb["indigo_s_2[damage].atk_scale"];
          damage = Math.max(atk * (1-emrpct), atk*0.05) * buffFrame.damage_scale;
          pool[1] += damage * enemy.count * dur.duration * 2;
          log.write(`[特殊] ${displayNames[buffName]}: 法术伤害 ${damage.toFixed(1)}, 命中 ${enemy.count * dur.duration * 2}`);
          log.writeNote(`触发束缚伤害`);
        }
        break;
      case "tachr_426_billro_1":
        if (isSkill) {
          damage = bb.heal_scale * finalFrame.maxHp;
          if (options.charge) damage *= 2;
          pool[2] += damage;
        }
      break;
      // 间接治疗
      case "skchr_tiger_2":
        pool[2] += damagePool[1] * bb.heal_scale; break;
      case "skchr_strong_2":
        pool[2] += damagePool[0] * bb.scale; break;
      case "skcom_heal_self[1]":
      case "skcom_heal_self[2]":
        damagePool[2] = 0;
        // console.log(finalFrame);
        pool[2] += bb.heal_scale * finalFrame.maxHp; break;
      case "skchr_nightm_1":
        pool[2] += damagePool[1] * bb["attack@heal_scale"] * Math.min(enemy.count, bb["attack@max_target"]); break;
      case "skchr_folnic_2":
        pool[2] += bb["attack@heal_scale"] * finalFrame.atk / buffFrame.atk_scale * dur.hitCount; break;
      case "skchr_breeze_2":
        damage = finalFrame.atk/2 ;
        log.write(`[特殊] ${displayNames[buffName]}: 溅射治疗 ${damage.toFixed(1)}, 命中 ${dur.attackCount * (enemy.count-1)}`);
        pool[2] += damage * dur.attackCount * (enemy.count-1);
        break;
      case "skchr_ccheal_1":
        heal = finalFrame.atk * bb.heal_scale * bb.duration * dur.duration / attackTime;  // 乘以技能次数
        log.write(`[特殊] ${displayNames[buffName]}: HoT ${heal.toFixed(1)}`);
        pool[2] += heal;
        break;
      case "skchr_ccheal_2":
        heal = finalFrame.atk * bb.heal_scale * bb.duration;
        log.write(`[特殊] ${displayNames[buffName]}: HoT ${heal.toFixed(1)}, 命中 ${enemy.count}`);
        pool[2] += heal * enemy.count;
        break;
      case "skchr_shining_2":
      case "skchr_tuye_1":
        heal = finalFrame.atk * bb.atk_scale;
        log.write(`[特殊] ${displayNames[buffName]}: 护盾量 ${heal}`);
        pool[4] += heal;
        break;
      case "skchr_cgbird_2":
        heal = finalFrame.atk * bb.atk_scale;
        log.write(`[特殊] ${displayNames[buffName]}: 护盾量 ${heal}, 命中 ${ecount}`);
        pool[4] += heal * ecount;
        break;
      case "skchr_tknogi_2":
      case "skchr_lisa_3":
        heal = finalFrame.atk * bb["attack@atk_to_hp_recovery_ratio"] * enemy.count * (dur.duration-1);
        log.write(`[特殊] ${displayNames[buffName]}: HoT ${heal.toFixed(1)}，可以治疗召唤物`);
        log.writeNote("可以治疗召唤物");
        log.writeNote("第一秒无治疗效果（待确认）");
        pool[2] += heal;
        damagePool[2] = 0; log.write("[特殊] 直接治疗为0");
        break;
      case "skchr_blemsh_1":
        heal = finalFrame.atk * bb.heal_scale / buffFrame.atk_scale;
        pool[2] += heal;
        break;
      case "skchr_blemsh_2":
        heal = finalFrame.atk * bb["attack@atk_to_hp_recovery_ratio"] / buffFrame.atk_scale;
        log.write(`每秒单体治疗: ${heal.toFixed(1)}`);
        log.writeNote("可以治疗召唤物");
        pool[2] += heal * dur.duration * enemy.count;
        break;
      case "skchr_blemsh_3":
        damage = finalFrame.atk * bb["attack@blemsh_s_3_extra_dmg[magic].atk_scale"];
        damage = Math.max(damage * (1-emrpct), damage * 0.05);
        heal = finalFrame.atk / buffFrame.atk_scale * bb.heal_scale;
        log.write(`每次攻击额外法伤：${damage.toFixed(1)} （计算天赋加成），额外治疗: ${heal.toFixed(1)}`);
        pool[1] += damage * dur.attackCount;
        pool[2] += heal * dur.attackCount;
        break;
      case "skchr_rosmon_1":
        damage = finalFrame.atk * bb.extra_atk_scale;
        damage = Math.max(damage * (1-emrpct), damage * 0.05) * dur.hitCount;
        pool[1] += damage;
        log.write(`${displayNames[buffName]}: 法术伤害 ${damage.toFixed(1)}`);
        break;
      case "skchr_kirara_1":
        damage = finalFrame.atk * bb["kirara_s_1.atk_scale"];
        damage = Math.max(damage * (1-emrpct), damage * 0.05) * dur.hitCount;
        pool[1] += damage;
        log.write(`${displayNames[buffName]}: 法术伤害 ${damage.toFixed(1)}`);
        break;
      case "skchr_amiya2_2":
        var arts_atk = finalFrame.atk * bb.atk_scale;
        var real_atk = finalFrame.atk * bb.atk_scale_2;
        var arts_dmg = Math.max(arts_atk * (1-emrpct), arts_atk * 0.05);
        log.write(`[斩击] 法术伤害 ${arts_dmg.toFixed(1)}, 命中 9, 真实伤害 ${real_atk.toFixed(1)}, 命中 1`);
        pool[1] += arts_dmg * 9;
        pool[3] += real_atk;
        break;
      case "skchr_kafka_1":
        log.write(`[特殊] ${displayNames[buffName]}: 直接伤害为0 （以上计算无效）, 效果持续${bb.duration}秒`);
        damage = finalFrame.atk * (1-emrpct) * enemy.count;
        pool[1] = damage; damagePool[1] = 0;
        break;
      case "skchr_kafka_2":
        damage = finalFrame.atk * bb.atk_scale * (1-emrpct) * enemy.count;
        pool[1] = damage;
        break;
      case "skchr_tuye_2":
        pool[2] = finalFrame.atk * bb.heal_scale;
        log.write(`[特殊] ${displayNames[buffName]}: 瞬间治疗 ${pool[2].toFixed(1)}, 最多3次`);
        log.writeNote(`瞬间治疗量 ${pool[2].toFixed(1)}`);
        pool[2] *= 3;
        break;
      case "skchr_nothin_1":
      case "skchr_nothin_2":
        let a = finalFrame.atk * buffList["tachr_455_nothin_1"].atk_scale;
        damage = Math.max(a - edef, a * 0.05);
        log.writeNote(`首次攻击伤害 ${damage.toFixed(1)}`);
        break;
      case "skchr_skadi2_2":
        var buff_def = finalFrame.def * bb.def;
        log.writeNote(`队友防御力增加 ${buff_def.toFixed(1)}`);
      case "skchr_sora_2":
        var buff_atk = finalFrame.atk * bb.atk;
        log.writeNote(`队友攻击力增加 ${buff_atk.toFixed(1)}`);
        break;
      case "skchr_skadi2_3":
        var buff_atk = finalFrame.atk * bb.atk;
        damage = finalFrame.atk * bb.atk_scale * buffFrame.damage_scale;
        pool[3] += damage * enemy.count * dur.duration;
        log.writeNote(`队友攻击力增加 ${buff_atk.toFixed(1)}`);
        log.writeNote(`每秒真实伤害 ${damage.toFixed(1)}, 总伤害 ${pool[3]}`);
        log.writeNote(`叠加海嗣时真伤x2，不另行计算`);
        break;
    }; // switch

    // 百分比/固定回血
    let hpratiosec = bb["hp_recovery_per_sec_by_max_hp_ratio"];
    let hpsec = bb["hp_recovery_per_sec"];
    if (hpratiosec) {
      if (buffName == "tachr_478_kirara_1") {
        if (options.cond) hpratiosec = bb["kirara_t_2.hp_recovery_per_sec_by_max_hp_ratio"];
        if (isSkill && blackboard.id == "skchr_kirara_2") {
          hpratiosec *= buffList["skill"].talent_scale;
        }
        log.write(`天赋回血比例: ${(hpratiosec * 100).toFixed(1)}%/s`);
      }

      if (buffName == "tachr_344_beewax_1" && isSkill) {}
      else if (buffName == "tachr_362_saga_2") {}
      else if (buffName == "tachr_293_thorns_2") {
        if (blackboard.id == "skchr_thorns_2" && isSkill) {
          pool[2] += hpratiosec * finalFrame.maxHp * (dur.duration + dur.stunDuration - 2);
          log.writeNote("治疗从2秒后开始计算");
        } else {}
      } else {
        pool[2] += hpratiosec * finalFrame.maxHp * (dur.duration + dur.stunDuration);
      }
    }
    if (hpsec) {
      if ((buffName == "tachr_291_aglina_2" && isSkill) || 
          (buffName == "tachr_188_helage_2" && !options.noblock)) { /* skip */ }
      else
      {
        pool[2] += hpsec * (dur.duration + dur.stunDuration);
      }
    }
    // 自身血量百分比相关的治疗/伤害
    if (bb["hp_ratio"]) {
      switch (buffName) {
        case "skchr_huang_3": // 自爆
        case "skchr_utage_2":
        case "skchr_akafyu_2":
          pool[2] -= bb.hp_ratio * finalFrame.maxHp; break;
        case "skchr_ifrit_3": // 自己掉血
        case "skchr_skadi2_3":
          pool[2] -= bb.hp_ratio * finalFrame.maxHp * dur.duration; break;
        case "skchr_bldsk_2":
          pool[2] -= bb.hp_ratio * finalFrame.maxHp * bb.duration * 2; break;
        case "tachr_225_haak_trait":  // 阿-特性
          pool[2] -= bb.hp_ratio * finalFrame.maxHp * dur.duration; break;
        case "tachr_225_haak_1":
          if (options.crit) {
            heal = bb.hp_ratio * finalFrame.maxHp * buffFrame.heal_scale;
            log.write(`[特殊] ${displayNames[buffName]}: 治疗 ${heal.toFixed(1)}, 命中 ${dur.critHitCount}`);
            pool[2] += heal * dur.critHitCount; 
          }
          break;
        case "skchr_bena_2":
          if (!options.annie) {
            pool[2] -= bb.hp_ratio * dur.attackCount * finalFrame.maxHp;
            log.writeNote(`每次攻击生命流失 ${(bb.hp_ratio * finalFrame.maxHp).toFixed(1)}`);
          }
          break;
        case "tachr_017_huang_1":
        case "skchr_ccheal_1":
        case "skchr_ccheal_2":
        case "tachr_174_slbell_1":
        case "tachr_254_vodfox_1":
        case "tachr_343_tknogi_1":
        case "tachr_405_absin_1":
        case "tachr_416_zumama_1":
        case "tachr_362_saga_2":
        case "skchr_dusk_2":
        case "tachr_472_pasngr_1":
          break;
        case "skchr_gravel_2":
        case "skchr_phatom_1":
          pool[4] += bb.hp_ratio * finalFrame.maxHp;
          log.write(`[特殊] ${displayNames[buffName]}: 护盾量 ${pool[4]}`);
          break;
        case "skchr_surtr_3":
          pool[4] -= finalFrame.maxHp + 5000;
          break;
        case "tachr_311_mudrok_1":
          pool[2] += bb.hp_ratio * finalFrame.maxHp / bb.interval * (dur.duration + dur.prepDuration);
          break;    
        default:
          pool[2] += bb.hp_ratio * finalFrame.maxHp * dur.attackCount;
      };
    }

    let dmg = pool[0] + pool[1] + pool[3];
    if (dmg > 0) log.write(`[特殊] ${displayNames[buffName]}: 额外伤害 ${dmg.toFixed(2)}`);
    if (pool[2] > 0) log.write(`[特殊] ${displayNames[buffName]}: 额外治疗 ${pool[2].toFixed(2)}`);
    else if (pool[2] < 0) log.write(`[特殊] ${displayNames[buffName]}: 自身伤害 ${pool[2].toFixed(2)}`);
    for (let i=0; i<5; ++i) extraDamagePool[i] += pool[i];
  } 

  // 整理返回
  let totalDamage = [0, 1, 3].reduce((x, y) => x + damagePool[y] + extraDamagePool[y], 0);
  let totalHeal = [2, 4].reduce((x, y) => x + damagePool[y] + extraDamagePool[y], 0);
  let extraDamage = [0, 1, 3].reduce((x, y) => x + extraDamagePool[y], 0);
  let extraHeal = [2, 4].reduce((x, y) => x + extraDamagePool[y], 0);

  log.write(`总伤害: ${totalDamage.toFixed(2)}`);
  if (totalHeal != 0) log.write(`总治疗: ${totalHeal.toFixed(2)}`);

  let dps = totalDamage / (dur.duration + dur.stunDuration + dur.prepDuration);
  let hps = totalHeal / (dur.duration + dur.stunDuration + dur.prepDuration);
  // 均匀化重置普攻时的普攻dps
  if (!isSkill && checkResetAttack(blackboard.id, blackboard)) {
    let d = dur.attackCount * attackTime;
    log.write(`以 ${d.toFixed(3)}s 计算普攻dps`);
    dps = totalDamage / d; hps = totalHeal / d;
  }
  log.write(`DPS: ${dps.toFixed(1)}, HPS: ${hps.toFixed(1)}`);
  log.write("----");

  return {
    atk: finalFrame.atk,
    dps,
    hps,
    dur,
    damageType,
    hitDamage,
    critDamage,
    extraDamage,
    extraHeal,
    totalDamage,
    totalHeal,
    maxTarget: ecount,
    damagePool,
    extraDamagePool,
    attackTime,
    frame,
    attackCount: dur.attackCount, 
    spType: levelData.spData.spType,
  };
}

function calculateGradDamage(_) { // _ -> args
  var ret = 0;
  var dmg_table = [];
  var _seq = [...Array(_.dur.attackCount).keys()];  // [0, 1, ..., attackCount-1]

  if (_.charId == "char_328_cammou") {
    // 卡达: 可变倍率
    // 基于当前伤害直接乘算atk_scale倍率即可
    let tb = [1.2, 1.35, 1.5, 1.65, 1.8, 1.95, 2.1]; // 本体+无人机总的atk_scale
    dmg_table = [...Array(_.dur.attackCount).keys()].map(x => (
      x >= tb.length ? Math.round(_.hitDamage * tb[tb.length-1]) : Math.round(_.hitDamage * tb[x])
    ));
    _.log.write(`单次伤害: ${dmg_table.slice(0, 6)}, ${dmg_table[6]} * ${_.dur.attackCount-6}`);
  } else if (_.skillId == "skchr_kalts_3") {
    // 凯尔希: 每秒改变一次攻击力, finalFrame.atk为第一次攻击力
    let range = _.basicFrame.atk * _.blackboard["attack@atk"];
    let n = Math.floor(_.dur.duration);
    let atk_by_sec = [...Array(n+1).keys()].map(x => _.finalFrame.atk - range * x / n);
    // 抬手时间
    let atk_begin = Math.round((checkSpecs(_.skillId, "attack_begin") || 12)) / 30;
    let atk_timing = _seq.map(i => atk_begin + _.attackTime * i);

    dmg_table = atk_timing.map(x => atk_by_sec[Math.floor(x)] * _.buffFrame.damage_scale);
    _.log.write(explainGradAttackTiming({
      duration: n,
      atk_by_sec,
      atk_timing,
      dmg_table 
    }));
  } else if (_.skillId == "skchr_billro_3") {
    // 卡涅利安: 每秒改变一次攻击力（多一跳），蓄力时随攻击次数改变damage_scale倍率, finalFrame.atk为最后一次攻击力
    let range = _.basicFrame.atk * _.blackboard.atk;
    let n = Math.floor(_.dur.duration);
    // rate = (x-1)/(n-1), thus t=0, x=n, rate=1; t=(n-1), x=1, rate=0
    let atk_by_sec = [...Array(n+1).keys()].reverse().map(x => _.finalFrame.atk - range * (x-1) / (n-1));
    // 抬手时间
    let atk_begin = Math.round((checkSpecs(_.skillId, "attack_begin") || 12)) / 30;
    let atk_timing = _seq.map(i => atk_begin + _.attackTime * i);
    // damage_scale
    let sc = [1.2, 1.4, 1.6, 1.8, 2];
    let scale_table = _seq.map(i => (i>=sc.length ? 2 : sc[i]));

    //console.log({atk_by_sec, atk_timing, scale_table});
    dmg_table = atk_timing.map(x => atk_by_sec[Math.floor(x)] * _.ecount * Math.max(1-_.emrpct, 0.05) * _.buffFrame.damage_scale);
    let kwargs = { duration: n, atk_by_sec, atk_timing, dmg_table };
    if (_.options.charge) {
      dmg_table = _seq.map(i => dmg_table[i] * scale_table[i]);
      kwargs.scale_table = scale_table.map(x => x * _.buffFrame.damage_scale);
      kwargs.dmg_table = dmg_table;
    }
    _.log.write(explainGradAttackTiming(kwargs));
  } else {
    // 一般处理（煌，傀影）: 攻击加成系数在buffFrame.atk_table预先计算好,此时finalFrame.atk为最后一次攻击的攻击力
    // 由finalFrame.atk计算之前每次攻击的实际攻击力，同时不影响其他buff
    var a = _.buffFrame.atk_table.map(x => _.basicFrame.atk * x);
    var pivot = a[a.length-1];
    a = a.map(x => (_.finalFrame.atk - pivot + x));
    //console.log(a);

    // 计算每次伤害
    if (_.damageType == 0) {
      dmg_table = a.map(x => Math.max(x-_.edef, x*0.05) * _.buffFrame.damage_scale);
    } else if (_.damageType == 3) {
      dmg_table = a.map(x => x * _.buffFrame.damage_scale);
    }
    _.log.write(`单次伤害: ${dmg_table.map(x => x.toFixed(1))}`);
  }

  ret = dmg_table.reduce((x, y) => x + y);
  return ret;
}

function explainGradAttackTiming(_, n=7) {
  var lines = [], i=0;
  var row_time = [...Array(_.duration).keys()];
  var l1 = row_time.map(x => ":--:");
  var row_atk = [..._.atk_by_sec.map(x => Math.round(x))];
  var row_timing = [..._.atk_timing.map(x => x.toFixed(2))];
  var row_scale = [];
  var l2 = row_timing.map(x => ":--:");
  var row_dmg = [..._.dmg_table.map(x => Math.round(x))];
  if (_.scale_table)
    row_scale = [..._.scale_table.map(x => x.toFixed(2))];

  while (i<row_time.length) {
    let r1 = ["时间(s)", ...row_time.slice(i, i+n)];
    let ls1 = [":--:", ...l1.slice(i, i+n)];
    let a1 = ["攻击力", ...row_atk.slice(i, i+n)];

    lines.push(`| ${r1.join(" | ")} |`);
    lines.push(`| ${ls1.join(" | ")} |`);
    lines.push(`| ${a1.join(" | ")} |`);
    lines.push("\n");
    i+=n;
  }
  i=0;
  while (i<row_timing.length) {
    let r2 = ["时点(s)", ...row_timing.slice(i, i+n)];
    let ls2 = [":--:", ...l2.slice(i, i+n)];
    let s2 = [];
    let d2 = ["伤害", ...row_dmg.slice(i, i+n)];
    lines.push(`| ${r2.join(" | ")} |`);
    lines.push(`| ${ls2.join(" | ")} |`);
    if (_.scale_table) {
      s2 = ["倍率", ...row_scale.slice(i, i+n)];
      lines.push(`| ${s2.join(" | ")} |`);
    }
    lines.push(`| ${d2.join(" | ")} |`);
    lines.push("\n");
    i+=n;
  }
//  console.log(lines);
  return lines.join("\n");
}

let AttributeKeys = [
  'atk',
  'attackSpeed',
  'baseAttackTime',
  'baseForceLevel',
  'blockCnt',
  'cost',
  'def',
  'hpRecoveryPerSec',
  'magicResistance',
  'massLevel',
  'maxDeckStackCnt',
  'maxDeployCount',
  'maxHp',
  'moveSpeed',
  'respawnTime',
  'spRecoveryPerSec',
  'tauntLevel',
];

function initBuffFrame() {
  return {
    atk_scale: 1,
    def_scale: 1,
    heal_scale:1,
    damage_scale: 1,
    maxTarget: 1,
    times: 1,
    edef:0, // 敌人防御/魔抗
    edef_scale:1,
    edef_pene:0,
    edef_pene_scale:0,
    emr_pene:0, // 无视魔抗
    emr:0,
    emr_scale:1,
    atk:0,
    def:0,
    attackSpeed:0,
    maxHp: 0,
    baseAttackTime:0,
    spRecoveryPerSec:0,
    applied:{}
  };
}

function getAttributes(char, log) { //charId, phase = -1, level = -1
  let charData = AKDATA.Data.character_table[char.charId];
  let phaseData = charData.phases[char.phase];
  let attributesKeyFrames = {};
  let buffs = initBuffFrame();
  let buffList = {};
  //console.log(charData);
  // 计算基础属性，包括等级和潜能
  if (char.level == charData.phases[char.phase].maxLevel) {
    attributesKeyFrames = Object.assign(attributesKeyFrames, phaseData.attributesKeyFrames[1].data);
  } else {
    AttributeKeys.forEach(key => {
      attributesKeyFrames[key] = getAttribute(phaseData.attributesKeyFrames, char.level, 1, key);
    });
  }
  if (charData.favorKeyFrames && charData.profession != "TOKEN") {  // token不计信赖
    let favorLevel = Math.floor(Math.min(char.favor, 100) / 2);
    AttributeKeys.forEach(key => {
      attributesKeyFrames[key] += getAttribute(charData.favorKeyFrames, favorLevel, 0, key);
      // console.log(char.level, key, attributesKeyFrames[key]);
      buffs[key] = 0;
    });
  }
  // console.log(attributesKeyFrames);
  applyPotential(char.charId, charData, char.potentialRank, attributesKeyFrames);

  // 计算天赋/特性，记为Buff
  if (charData.trait && !charData.has_trait) {
    charData.has_trait = true;
    charData.talents.push(charData.trait);
  }
  charData.talents.forEach(talentData => {
    if (talentData.candidates) { // mon3tr!!
      for (let i = talentData.candidates.length - 1; i >= 0; i--) {
        let cd = talentData.candidates[i];
        //console.log(cd);
        if (char.phase >= cd.unlockCondition.phase && char.level >= cd.unlockCondition.level && 
            char.potentialRank >= cd.requiredPotentialRank) {
          // 找到了当前生效的天赋
          let blackboard = getBlackboard(cd.blackboard);
          if (!cd.prefabKey || cd.prefabKey < 0) {
            cd.prefabKey = "trait";  // trait as talent
            cd.name = "特性";
          }
          let prefabKey = 'tachr_' + char.charId.slice(5) + '_' + cd.prefabKey;
          displayNames[prefabKey] = cd.name;  // add to name cache
          // bufflist处理
          buffList[prefabKey] = blackboard;
          break;
        }
      };
    }
  });

  return {
    basic: attributesKeyFrames,
    buffs: buffs,
    buffList: buffList,
    char: char,
  };
}

function getBuffedAttributes(basic, buffs) {
  let {...final} = basic;
  AttributeKeys.forEach(key => {
    if (buffs[key]) final[key] += buffs[key];
  });

  final.atk *= buffs.atk_scale;
  final.def *= buffs.def_scale;
  // final.atk *= buffs.damage_scale;
  return final;
}

function getAttribute(frames, level, minLevel, attr) {
  var ret = (level - minLevel) / (frames[1].level - frames[0].level) * (frames[1].data[attr] - frames[0].data[attr]) + frames[0].data[attr];
  if (attr != "baseAttackTime")
    return Math.round(ret);
  else return ret;
}

function getBlackboard(blackboardArray) {
  let blackboard = {};
  blackboardArray.forEach(kv => blackboard[kv.key] = kv.value);
  return blackboard;
}

let PotentialAttributeTypeList = {
  0: "maxHp",
  1: "atk",
  2: "def",
  3: "magicResistance",
  4: "cost",
  5: "blockCnt",
  6: "moveSpeed",
  7: "attackSpeed",
  21: "respawnTime",
};

function applyPotential(charId, charData, rank, basic) {
  if (!charData.potentialRanks || charData.potentialRanks.length == 0) return;
  for (let i = 0; i < rank; i++) {
    let potentialData = charData.potentialRanks[i];
    if (!potentialData.buff) continue;
    let y = potentialData.buff.attributes.attributeModifiers[0];
    let key = PotentialAttributeTypeList[y.attributeType];
    let value = y.value;

    basic[key] += value;
  }
}

export {
  getCharAttributes,
  calculateDps,
  calculateDpsSeries
};

