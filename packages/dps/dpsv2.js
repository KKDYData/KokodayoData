import { Actions as actions } from "./dps_actions.js"
import * as AKDATA from "./loader.js"
// ---- utils ----
// public name cache
var _names = {};
// public checkSpecs()/getBuff() cache
var _spec = false;
var _buff = null;
var _fps = 30;

const AttributeKeys = [
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

const PotentialAttributeTypeList = {
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

const DamageTypeText = ["物理伤害", "法术伤害", "治疗", "真实伤害", "护盾"];

// 获取ID为tag的角色/技能的额外数据，存放在dps_specialtags.json中
// 前一次调用的结果暂存在_spec里(不考虑重入)
function checkSpecs(tag, spec) {
    let specs = AKDATA.Data.dps_specialtags_v2;
    if ((tag in specs) && (spec in specs[tag]))
      _spec = specs[tag][spec];
    else _spec = false;
    return _spec;
}

// 格式化带符号数字
function _num(x, n=1) { return (x>0 ? "+":"") + x.toFixed(n); }

function isMasked(tag, key) {
    if (checkSpecs(tag, "masked"))
        return (key in _spec);
    else return false;
}

// 对角色attr属性进行插值并取整。攻击间隔不进行取整
function getAttribute(frames, level, minLevel, attr) {
    var ret = (level - minLevel) / (frames[1].level - frames[0].level) * (frames[1].data[attr] - frames[0].data[attr]) + frames[0].data[attr];
    if (attr != "baseAttackTime")
      return Math.round(ret);
    else return ret;
}

// 将blackboard的"[{k:v}]"格式转为正常字典
function getBlackboard(blackboardArray) {
    let blackboard = {};
    blackboardArray.forEach(kv => blackboard[kv.key] = kv.value);
    return blackboard;
}

// 别名替换
function getAliasedBlackboard(buffKey, blackboard, options) {
    var ret = {...blackboard};
    var aliases = checkSpecs(buffKey, "alias");
    if (aliases) { 
        aliases.forEach(a => {
            if (a.option_key) {
                if (options[a.option_key]) {
                    ret[a.key] = ret[a.alias_on_true];
                    if (ret[a.alias_on_true]) delete ret[a.alias_on_true];
                    console.log("alias[true] - ", a.key, a.alias_on_true);
                } else if (a.alias_on_false) {
                    // 如果不指定alias_on_false则不进行替换
                    ret[a.key] = ret[a.alias_on_false];
                    if (ret[a.alias_on_false]) delete ret[a.alias_on_false];
                    console.log("alias[false] - ", a.key, a.alias_on_false);
                } 
            } else {
                ret[a.key] = ret[a.alias];
                console.log("alias - ", a.key, a.alias);
                if (ret[a.alias]) delete ret[a.alias];
            }
        });
        console.log("Raw/Aliased", blackboard, ret);
        return ret;
    } else return blackboard;
}

class Log {
    constructor() {
        this.log = {};
        this.muted = false;
        this.keys = ["default"];
    }

    getKey() { return this.keys[this.keys.length-1]; }
    pushKey(s) { this.keys.push(s); }
    popKey() { return this.keys.pop(); }

    write(line, key=null) {
        if (!key) key=this.getKey();
        if (!this.muted) {
            if (!this.log[key]) this.log[key] = [];
            if (this.log[key].indexOf(line) == -1)  // 同样的语句只出现一次
                this.log[key].push(line);
        }
    }
    note(line) {
        this.write(line, "note");
    }

    toString(key=null) {
        if (key)
            return this.log[key].join("\n");
        else {
            var lines=[];
            for (var k in this.log) {
                lines.push(`-- ${k} --`);
                lines.push(this.toString(k));
            }
            return lines.join("\n");
        } 
    }

    toMarkdown(key=null) {
        if (key)
            return this.log[key].join("\n").replace(/_/g, "\\_").replace(/\~/g, "_");
        else {
            var lines=[];
            for (var k in this.log) {
                lines.push(`- ${k}`);
                lines.push(this.toMarkdown(k));
            }
            return lines.join("\n");
        }
    }
}

// ---- 核心模组 ----
// 扩展的char对象，包括原本char的id/技能等级选项等信息，和从DB中提取的技能名字blackboard等信息。
class Character {
    setChar(char) {
        // 设置人物和技能数据
        this.options = {}; if (char.options) this.options = {...char.options};
        this.skillLevel = char.skillLevel;
        this.changeCharId(char.charId);
        this.changeSkillId(char.skillId);
        // 复制原本的char对象内容
        this.phase = char.phase || this.charData.phases.length - 1;
        this.level = char.level || this.charData.phases[this.phase].maxLevel;
        this.favor = char.favor || 200;
        this.potentialRank = char.potentialRank || 5;
        return this;
    }

    // 切换为其他角色，不改变等级等属性
    // 除了setChar以外，处理召唤物时也要用到
    changeCharId(charId) {
        this.charId = charId;
        this.charData = AKDATA.Data.character_table[charId];
        _names[this.charId] = this.charData.name;
        return this;
    }

    // 切换为其他技能，不改变其他属性
    changeSkillId(skillId) {
        this.skillId = skillId;
        this.skillData = AKDATA.Data.skill_table[skillId];
        if (!this.skillLevel || this.skillLevel < 0
            || this.skillLevel > this.skillData.levels.length-1)
            this.skillLevel = this.skillData.levels.length-1;
        this.levelData = this.skillData.levels[this.skillLevel];
        this.blackboard = getBlackboard(this.skillData.levels[this.skillLevel].blackboard) || {};
        this.blackboard = getAliasedBlackboard(skillId, this.blackboard, this.options);   // 别名处理
        //this.blackboard.id = this.skillId;
        this.skillName = this.levelData.name;
        _names[this.skillId] = this.skillName;
    }

    clone() {
        var ret = new Character();
        ret.setChar(this);
        return ret;
    }

    explain(log) {
        log.pushKey("Character");
        //log.write(`| 角色 | 等级 | 技能 |`);
        //log.write(`| :--: | :--: | :--: | `);
        //log.write(`| ~${this.charId}~ - **${this.charData.name}**  | 精英 ${this.phase}, 等级 ${this.level},
        //                              潜能 ${this.potentialRank+1} | ${this.skillName}, 等级 ${this.skillLevel+1} |`);
        log.write(`${this.charId} - ${this.charData.name}`);
        log.write(`精英 ${this.phase}, 等级 ${this.level}, 潜能 ${this.potentialRank+1}`);
        log.write(`${this.skillName}, 等级 ${this.skillLevel+1}`);
        log.popKey();
    }

    getDamageType() {
        var ret = { normal: 0, skill: 0 };
        // normal
        if (this.options.token && checkSpecs(this.charId, "token_damage_type"))
            ret.normal = ~~_spec;
        else {
            if (this.charData.profession == "MEDIC")
                ret.normal = 2;
            else if (this.charData.description.includes('法术伤害') && !["char_260_durnar", "char_378_asbest"].includes(this.charId))
                ret.normal = 1;
        }
        
        // 优先读取spec
        var skillDesc = this.levelData.description;
        // skill
        ret.skill = ret.normal;
        if (checkSpecs(this.skillId, "damage_type"))
            ret.skill = ~~_spec;
        else if (checkSpecs(this.charId, "damage_type"))
            ret.skill = ~~_spec;
        else if (this.options.token && checkSpecs(this.charId, "token_damage_type"))
            ret.skill = ~~_spec;
        else {
            if (["法术伤害", "法术</>伤害", "伤害类型变为"].some(x => skillDesc.includes(x)))
            ret.skill = 1;
            else if (["治疗", "恢复", "每秒回复"].some(x => skillDesc.includes(x)) && 
                    !this.blackboard["hp_recovery_per_sec_by_max_hp_ratio"])
            ret.skill = 2;
        }

        this.damageType = ret;
        //console.log(ret);
        return ret;
    } // getDamageType

    canResetAttack() {
        return (checkSpecs(this.skillId, "reset_attack") != false || 
            ["base_attack_time", "attack@max_target", "max_target"].some(
                x => this.blackboard[x] != null
            )
        );
    }
}

const InitBuffFrame = {
    atk_scale:  1,
    def_scale:  1,// 防御最终乘算数值
    heal_scale: 1,
    damage_scale:   1,
    maxTarget:  1,
    times:      1,
    edef:       0, // 敌人防御/魔抗
    edef_scale: 1,
    edef_pene:  0,
    edef_pene_scale:    0,
    emr_pene:   0, // 无视魔抗
    emr:        0,
    emr_scale:  1,
    atk:        0,
    def:        0,
    attackSpeed:0,
    maxHp:      0,
    prob:       0,      // 暴击率
    baseAttackTime: 0,
    spRecoveryPerSec: 0,
    minRate:    0.05,   // 抛光系数
    ranged_penalty: 1,   // 远程惩罚系数
    no_ranged_penalty: false,    // true时不计算远程惩罚
    stunDuration: 0,
    prepDuration: 0
};

// AttributeFrames 属性面板数据类
// 包含basicFrame, buffFrame, finalFrame
// 不包含Character, Rotation和计算方法
class AttributeFrames {
    constructor() {
        this.basicFrame = null; // to be set
        this.finalFrame = {};
        this.buffFrame = {...InitBuffFrame};
        this.applied = {};
        this.enemy = null;
        this.finalEnemy = null;
        this.save = null;
        this.crit = false;  // 表明是否为crit
        this.damageType = 0;
    }

    saveBuffs() {
        this.save = {
            buff: {...this.buffFrame},
            applied: {...this.applied}
        };
    }

    restoreBuffs() {
        this.buffFrame = this.save.buff;
        this.applied = this.save.applied;
    }
    
    setEnemy(enemy) {
        if (!this.save) this.saveBuffs();
        else this.restoreBuffs();

        this.enemy = enemy;
    }

    calcFinalFrame() {
        let buffs = this.buffFrame;
        let final = {...this.basicFrame};
        // re-calculate finalFrame
        AttributeKeys.forEach(key => {
            if (buffs[key]) final[key] += buffs[key];
        });
        // 暂存最终面板攻击
        final.atk_noscale = final.atk;
        // 为治疗且有heal_scale字段时，倍率为heal_scale
        // 否则为atk_scale
        if (this.damageType == 2 && buffs.heal_scale != 1)
            final.atk *= buffs.heal_scale;
        else
            final.atk *= buffs.atk_scale;
        // 远程惩罚
        if (!buffs.no_ranged_penalty) final.atk *= buffs.ranged_penalty;
        // 防御
        final.def *= buffs.def_scale;

        this.finalFrame = final;
    }

    calcFinalEnemy() {
        this.finalEnemy = {
            def: Math.max(0, (this.enemy.def + this.buffFrame.edef) * this.buffFrame.edef_scale * (1-this.buffFrame.edef_pene_scale) - this.buffFrame.edef_pene),
            mr:  Math.max(0, (this.enemy.magicResistance + this.buffFrame.emr) * this.buffFrame.emr_scale - this.buffFrame.emr_pene),
            count: Math.min(this.buffFrame.maxTarget, this.enemy.count)
        };
        this.finalEnemy.mrpct = this.finalEnemy.mr / 100;
    }

    calcHitDamage(atk=this.finalFrame.atk, damageType=this.damageType) {
        var ret = 0;
        switch (damageType) {
            case 0:
                ret = Math.max(atk - this.finalEnemy.def, atk * this.buffFrame.minRate);
                break;
            case 1:
                ret = Math.max(atk * (1 - this.finalEnemy.mrpct), atk * this.buffFrame.minRate);
                break;
            default:
                ret = atk;
        }
        if (this.buffFrame.damage_scale != 1 && [0, 1, 3].includes(damageType)) {
            ret *= this.buffFrame.damage_scale;
        }
        return ret;
    }

    // helper routine
    // 处理成 { pool: [x,x,x,x,x] } 的形式并且输出信息
    calcDamagePool(atk=null, hitCount=0, damageType=null) {
        if (!atk) atk = this.finalFrame.atk;
        if (!damageType) damageType = this.damageType;

        var hitDamage = this.calcHitDamage(atk, damageType);
        var pool = [0, 0, 0, 0, 0];
        var log = `${DamageTypeText[damageType]}: ${hitDamage.toFixed(1)}, 命中 ${hitCount}`;
        if (this.crit) log = "[暴击] " + log;
        if (hitDamage < atk * this.buffFrame.minRate) log += " (抛光)";
        pool[damageType] = hitDamage * hitCount;
        return { hitDamage, pool, log };
    }
}

// 存放一次计算的所有数据和状态
class DpsContext {
    constructor() {
        this.log = new Log();
        this.retvar = {}; // callSpecial的返回值
        this.flags = { skill: false, enemy: false, defer: false };
        this.buffList = {}; // 所有buff / buffList["buff"] = { blackboard }
        this.attr = new AttributeFrames();
        this.critAttr = new AttributeFrames();
        this.critAttr.crit = true;
        this.attackTime = {};
        this.rotation = {};
        this.hitDamage = 0;
        this.critHitDamage = 0;
        this.hitCount = 0;
        this.critHitCount = 0;
        this.damagePool = [0, 0, 0, 0, 0];
        this.extraDamagePool = [0, 0, 0, 0, 0];
        // other entries will be created on use
    }

    // callSpecial 调用外部函数进行计算
    // 被调用的函数可以以this访问当前DpsContext，参数列表位于args[]数组
    // 被调用的函数必须返回对象字典，返回值放在this.retvar
    callSpecial(buffKey, funcKey, args=null) {
        // var actions = AKDATA.Dps.Actions;
        if (actions[buffKey] && actions[buffKey][funcKey]) {
            console.log(`callSpecial ${buffKey}->${funcKey}`);
            this.retvar = actions[buffKey][funcKey].apply(this, args);    // call
            //console.log(`return =>`, this.retvar);
        } else this.retvar = false; 
        return this.retvar;
    }

    // 对buffList的每一项都尝试调用callSpecial，并且合并结果
    // 参数固定为单个args对象（不是数组）
    // 因为会将blackboard和buffKey加入args中一同调用
    // includeChar=true则会额外判断charId
    callSpecialForAny(funcKey, args, includeChar=false) {
        //console.log(`callSpecialForAny -> ${funcKey}`);
        var ret = { keys: [] }, r = {}, flag = false;
        var list = {...this.buffList};
        if (includeChar) list[this.char.charId] = {};
        if (!args) args = {};
        for (var b in list) {
            if (b) {
                // 设置buffKey/blackboard
                args.buffKey = b;
                args.blackboard = this.buffList[b];
                // 调用并合并结果
                r = this.callSpecial(b, funcKey, [args]);
                if (r) {
                    Object.assign(ret, r);
                    ret.keys.push(b);
                    flag = true;
                }
            }
        }
        //if (flag) console.log("callSpecialForAny return => ", ret);
        this.retvar = flag ? ret : false;
        return this.retvar;
    }

    setChar(char) {
        this.char = new Character();
        this.char.setChar(char);
        this.char.explain(this.log);
        this.skillId = char.skillId;
        this.options = char.options || {};
    }

    setEnemy(enemy=null) {
        // 设置敌人
        this.enemy = enemy || { def: 0, magicResistance: 0, count: 1};
        this.flags.enemy = true;
        this.attr.setEnemy(this.enemy);
        this.critAttr.setEnemy(this.enemy);
        this.updateBuffs();
    }

    setRaidBuff(rb=null) {
        this.raidBuff = rb || { atk: 0, atkpct: 0, ats: 0, cdr: 0, 
                                base_atk: 0, damage_scale: 0};
        // 把raidBuff处理成blackboard的格式
        this.raidBlackboard = {
            atk: this.raidBuff.atkpct / 100,
            atk_override: this.raidBuff.atk,
            attack_speed: this.raidBuff.ats,
            sp_recovery_per_sec: this.raidBuff.cdr / 100,
            base_atk: this.raidBuff.base_atk / 100,
            damage_scale: 1 + this.raidBuff.damage_scale / 100
        };
        _names["raidBuff"] = "团辅";
    }

    getBuff(b) { _buff = this.buffList[b]; return this.buffList[b]; }

    getDamageType() { 
        if (!this.char.damageType) this.char.getDamageType();
        return this.char.damageType[this.flags.skill ? "skill" : "normal"];
    }

    // 基础属性计算
    calcBasicFrame() {
        var charData = this.char.charData;
        var phaseData = charData.phases[this.char.phase];
        var basicFrame = {};

        // 计算基础属性插值，包括等级和信赖
        if (this.char.level == phaseData.maxLevel) {
            basicFrame = Object.assign(basicFrame, phaseData.attributesKeyFrames[1].data);
        } else {
            AttributeKeys.forEach(key => {
                // 等级范围: 1-90(不包含0)
                basicFrame[key] = getAttribute(phaseData.attributesKeyFrames, this.char.level, 1, key);
            });
        }
        if (charData.favorKeyFrames) {
            let favorLevel = Math.floor(Math.min(this.char.favor, 100) / 2);
            AttributeKeys.forEach(key => {
                // 信赖范围: 0-200(包含0)
                basicFrame[key] += getAttribute(charData.favorKeyFrames, favorLevel, 0, key);
            });
        }
        // 计算潜能
        if (charData.potentialRanks && charData.potentialRanks.length > 0) {
            for (let i = 0; i < this.char.potentialRank; i++) {
                let potentialData = charData.potentialRanks[i];
                if (potentialData && potentialData.buff) {
                    let y = potentialData.buff.attributes.attributeModifiers[0];
                    let key = PotentialAttributeTypeList[y.attributeType];
                    basicFrame[key] += y.value;
                }
            }
        }
        // 计算直接乘算的团辅字段（合约tag）
        if (this.raidBlackboard.base_atk != 0) {
            let delta = basicFrame.atk * this.raidBlackboard.base_atk;
            basicFrame.atk = Math.round(basicFrame.atk + delta);
            this.log.write(`[团辅] 原本攻击力变为 ${basicFrame.atk} (${_num(delta)})`);         
        }

        this.basicFrame = this.attr.basicFrame = this.critAttr.basicFrame = basicFrame;
        this.attr.damageType = this.critAttr.damageType = this.getDamageType();
    }
    
    makeBuffList() {
        // 天赋与特性
        var talents = [...this.char.charData.talents]; // shallow copy
        if (this.char.charData.trait) talents.unshift(this.char.charData.trait);

        talents.forEach(ta => {
            for (var i=ta.candidates.length-1; i>=0; i--) {
                // 倒序查找可用的天赋等级
                let cd = ta.candidates[i];
                if (!cd.prefabKey) { 
                    cd.prefabKey = "trait"; cd.name = "特性";
                }
                if (this.char.phase >= cd.unlockCondition.phase &&
                    this.char.level >= cd.unlockCondition.level &&
                    this.char.potentialRank >= cd.requiredPotentialRank) {
                        var prefabKey = `tachr_${this.char.charId.slice(5)}_${cd.prefabKey}`;
                        _names[prefabKey] = cd.name;
                        this.buffList[prefabKey] = getAliasedBlackboard(prefabKey, getBlackboard(cd.blackboard), this.options);
                        break;
                    }
            }
        });

        // 技能
        if (this.flags.skill) this.buffList[this.skillId] = this.char.blackboard;

        // 团辅
        if (this.options.buff) this.buffList["raidBuff"] = this.raidBlackboard;
    }

    // 判断指定buff是否生效。返回true/false
    checkBuff(attr, buffKey) {
        var active = checkSpecs(buffKey, "always_active");

        if (buffKey == this.skillId && !this.flags.skill)
            return false;   // 非技能时，skill buff不生效
        else if (checkSpecs(buffKey, "enemy") && !this.flags.enemy)
            return false;   // 有enemy标签的buff需要在敌人属性给定后才能计算
        else if (checkSpecs(buffKey, "defer") && !this.flags.defer)
            return false;   // 延后计算的tag，会在rotation计算之后，enemy计算之前进行
        else if (buffKey == "raidBuff" && !this.options.buff)
            return false;   // 未选择计算团辅时 raidBuff不生效
        else if (checkSpecs(buffKey, "cond") && !this.options.cond) {
            return false;   // cond不满足时，cond buff不生效。
            // 不满足条件依然触发的buff不应该添加cond标签
        }
        else if (checkSpecs(buffKey, "stack") && !this.options.stack)
            return false;   // stack ~
        else if (checkSpecs(buffKey, "crit")) {
            this.flags.has_crit = true; // 标记要计算暴击
            return attr.crit;   // 有crit标签，但是当前状态不是计算暴击时不生效
        }
        return true;
    }

    writeBuff(text) {
        var buffKey = this._buffKey;
        let line = [""];
        if (buffKey == this.skillId) line.push("[技能]");
        else if (buffKey == "raidBuff") line.push("[团辅/拐]");
        else line.push("[天赋]");
        
        if (checkSpecs(buffKey, "cond")) 
          if (this.options.cond) line.push("[触发]"); else line.push("[未触发]");
        if (checkSpecs(buffKey, "stack") && this.options.stack) line.push("[满层数]");
        if (checkSpecs(buffKey, "crit")) line.push("[暴击]");
        
        line.push(_names[buffKey] + ": ");
        if (text) line.push(text);
        this.log.write(line.join(" "));
    }

    // 默认的applyBuff动作
    // 为了和callSpecial兼容, 参数放在this.args里
    applyBuffDefault(attr, buffKey, blackboard) {
        var delta = 0;
        var basicFrame = attr.basicFrame;
        var buffFrame = attr.buffFrame;
    
        // note
        if (checkSpecs(buffKey, "note"))
            this.log.note(_spec);
        // mask
        // 只对applyBuff生效，后续计算不进行mask
        var maskedKeys = checkSpecs(buffKey, "masked");
        if (maskedKeys) {
            if (maskedKeys == true) {
                this.writeBuff("不计算该天赋");
                attr.applied[buffKey] = true;
                return buffFrame;   // 为true直接返回
            } else {
                maskedKeys.forEach(k => {
                    if (blackboard[k]) {
                        this.writeBuff(`不计算字段 ${k} (=${blackboard[k]})`);
                        delete blackboard[k];
                    }
                });
            }
        }
        // ranged_penalty
        if (checkSpecs(buffKey, "ranged_penalty")) {
            if (this.options.ranged_penalty) {
                var scale = blackboard.atk_scale || blackboard.heal_scale;
                buffFrame.ranged_penalty = scale;
                this.writeBuff(`距离惩罚: ${_num(scale, 2)}x`);
            }
            return buffFrame;
        }
        if (checkSpecs(buffKey, "no_ranged_penalty")) {
            buffFrame.no_ranged_penalty = true;
            this.writeBuff("不受距离惩罚");
        }
        // stack
        if (blackboard.max_stack_cnt) {
            ["atk", "def", "attack_speed", "max_hp"].forEach(key => {
                if (blackboard[key]) blackboard[key] *= blackboard.max_stack_cnt;
            });
        }
        // max_target spec
        if (checkSpecs(buffKey, "max_target")) {
            if (_spec == "aoe") buffFrame.maxTarget = 999;
            else if (_spec == "block") buffFrame.maxTarget = this.basicFrame.blockCnt;
            else buffFrame.maxTarget = _spec;
            this.writeBuff(`最大目标数: ${buffFrame.maxTarget}`);
        } else if (this.char.charData.description.includes("阻挡的<@ba.kw>所有敌人") &&
                   buffFrame.maxTarget < this.basicFrame.blockCnt) {
            buffFrame.maxTarget = this.basicFrame.blockCnt;
        } else if (this.char.charData.description.includes("恢复三个"))
            buffFrame.maxTarget = 3;

        // times spec (不用判断是否为技能期间。char的times词条在applyCharSpec里判断)
        if (checkSpecs(buffKey, "times"))
            if (!blackboard.times) blackboard.times = _spec;

        // stunDuration & prepDuration spec
        if (checkSpecs(buffKey, "stunDuration"))
            blackboard.stunDuration = _spec;
        if (checkSpecs(buffKey, "prepDuration"))
            blackboard.prepDuration = _spec;

        // sec spec 只标记，在calcAttackTime里特判
        if (checkSpecs(buffKey, "sec") && this.flags.skill) {
            this.flags.sec = true;
            this.writeBuff("每秒造成一次伤害/治疗");
        }

        // warmup prompt
        if (this.options.warmup && checkSpecs(buffKey, "multi_warmup")) this.log.note("多段暖机完成");

        // reflect prompt
        if (checkSpecs(buffKey, "reflect")) this.log.note("计算反射伤害，而非DPS");

        // original applyBuff
        for (var key in blackboard) {
            switch (key) {
                case "atk":
                case "def":
                    delta = basicFrame[key] * blackboard[key];
                    buffFrame[key] += delta;
                    if (delta != 0)
                        this.writeBuff(`${key}: ${_num(blackboard[key]*100)}% (${_num(delta)})`);
                    break;
                case "max_hp":
                    if (Math.abs(blackboard[key]) > 2) { // 加算
                        buffFrame.maxHp += blackboard[key];
                        this.writeBuff(`${key}: ${_num(blackboard[key])}`);
                    } else if (blackboard[key] != 0) { // 乘算
                        delta = basicFrame.maxHp * blackboard[key];
                        buffFrame.maxHp += delta;
                        this.writeBuff(`${key}: ${_num(blackboard[key]*100)}% (${_num(delta)})`);
                    }
                    break;
                case "base_attack_time":
                    if (blackboard.base_attack_time < 0) // 攻击间隔缩短 - 加算
                        buffFrame.baseAttackTime += blackboard.base_attack_time;
                    else // 攻击间隔延长 - 乘算
                        buffFrame.baseAttackTime += this.basicFrame.baseAttackTime * blackboard.base_attack_time;
                    this.writeBuff(`base_attack_time: ${_num(buffFrame.baseAttackTime, 3)}s`);
                    break;
                case "attack_speed":
                    if (blackboard[key] != 0) {
                        buffFrame.attackSpeed += blackboard.attack_speed;
                        this.writeBuff(`attack_speed: ${_num(blackboard.attack_speed)}`);
                    }
                    break;
                case "sp_recovery_per_sec":
                    if (blackboard[key] != 0) {
                        buffFrame.spRecoveryPerSec += blackboard.sp_recovery_per_sec;
                        this.writeBuff(`sp: ${_num(blackboard[key])}/s`);
                    }
                    break;
                case "atk_scale":
                case "def_scale":
                case "heal_scale":
                case "damage_scale":
                    buffFrame[key] *= blackboard[key];
                    if (blackboard[key] != 1) this.writeBuff(`${key}: ${blackboard[key].toFixed(2)}x`);
                    break;
                case "attack@atk_scale":
                    buffFrame.atk_scale *= blackboard["attack@atk_scale"];
                    this.writeBuff(`atk_scale: ${buffFrame.atk_scale.toFixed(2)}`);
                    break;
                case "attack@heal_scale":
                    buffFrame.heal_scale *= blackboard["attack@heal_scale"];
                    this.writeBuff(`heal_scale: ${buffFrame.heal_scale.toFixed(2)}`);
                    break;
                case "max_target":
                case "attack@max_target":
                    buffFrame.maxTarget = Math.max(buffFrame.maxTarget, blackboard[key]);
                    this.writeBuff(`maxTarget: ${buffFrame.maxTarget}`);
                    break;
                case "times":
                case "attack@times":
                    buffFrame.times = blackboard[key];
                    this.writeBuff(`连击次数: ${blackboard[key]}`);
                    break;
                case "magic_resistance":
                    if (Math.abs(blackboard[key]) < -1) { // 魔抗减算
                        buffFrame.emr += blackboard[key];
                        this.writeBuff(`敌人魔抗: ${_num(blackboard[key], 1)}% (加算)`);
                    } else if (blackboard[key] < 0) { // 魔抗乘算
                        buffFrame.emr_scale *= (1+blackboard[key]);
                        this.writeBuff(`敌人魔抗: ${(blackboard[key]*100).toFixed(1)}% (乘算)`);
                    } // 大于0时为增加自身魔抗，不计算
                    break;
                case "prob":
                    buffFrame.prob = Math.max(blackboard[key], buffFrame.prob);
                    this.writeBuff(`概率: ${Math.round(buffFrame.prob*100)}%`);
                    break;
                // 计算值，非原始数据
                case "edef":  // 减甲加算值（负数）
                    buffFrame.edef += blackboard[key];
                    this.writeBuff(`敌人护甲: ${blackboard[key]}`);
                    break;
                case "edef_scale": // 减甲乘算值
                    buffFrame.edef_scale *= (1+blackboard[key]);
                    this.writeBuff(`敌人护甲: ${blackboard[key] *100}%`);
                    break;
                case "edef_pene": // 无视护甲加算值
                    buffFrame.edef_pene += blackboard[key];
                    this.writeBuff(`无视护甲（最终加算）: -${blackboard[key]}`);
                    break;
                case "edef_pene_scale":
                    buffFrame.edef_pene_scale = blackboard[key];
                    this.writeBuff(`无视护甲（最终乘算）: -${blackboard[key]*100}%`);
                    break;
                case "emr_pene":  // 无视魔抗加算值
                    buffFrame.emr_pene += blackboard[key];
                    this.writeBuff(`无视魔抗（加算）: -${blackboard[key]}`);
                    break;
                case "atk_override":  // 攻击团辅(raidBuff使用)
                    if (blackboard[key] != 0) {
                        buffFrame.atk += blackboard[key];
                        this.writeBuff(`atk: ${_num(blackboard[key], 1)}`);
                    }
                    break;
                case "stunDuration":
                    buffFrame.stunDuration = blackboard[key];
                    this.writeBuff(`眩晕 ${buffFrame.stunDuration}s`);
                    break;
                case "prepDuration":
                    buffFrame.prepDuration = blackboard[key];
                    this.writeBuff(`准备时间 ${buffFrame.prepDuration}s`);
                    break;
            } // switch
        }
        attr.applied[buffKey] = true;
        return buffFrame;
    }

//-------------------------------------------------------------------------------
    // 将{buffKey, bboard}指定的buff属性叠加到当前的buffFrame上
    applyBuff(attr, buffKey) {
        var blackboard = {...this.buffList[buffKey]};
        this._buffKey = buffKey;    // writeBuff hack
        // gatekeeper
        if (!attr.applied[buffKey] && this.checkBuff(attr, buffKey)) {
            this.log.pushKey("applyBuff");
            // buff计算特判
            // 返回 { done: t/f }
            this.callSpecial(buffKey, "applyBuff", [attr, blackboard]);
            
            //if (this.callSpecial(buffKey, "applyBuff", [attr, blackboard]))
            //    console.log("blackboard:", blackboard);
            // 调用默认buff计算函数
            if (!this.retvar.done) this.applyBuffDefault(attr, buffKey, blackboard); // 参数都在this.args里

            attr.applied[buffKey] = true;
            this.log.popKey();
        }
    }

    // applyBuff之后，对角色进行特判
    // 在flags改变时也会重新调用，所以需要可重入。
    applyCharSpecs(attr) {
        var charId = this.char.charId;
        if (!this.flags.skill && checkSpecs(charId, "times")) {
            attr.buffFrame.times = _spec;
            this.log.write(`- 普攻连击次数 ${_spec}`);
        }

        this.callSpecial(charId, "applyCharSpecs", [attr]);
    }

    _update(attr) {
        if (this.flags.enemy) attr.calcFinalEnemy();
        for (var b in this.buffList)
            this.applyBuff(attr, b);
        this.applyCharSpecs(attr);
        attr.calcFinalFrame();
    }
    updateBuffs() {
        this._update(this.attr);
        this._update(this.critAttr);
    }

    // 计算当前buff下的攻击间隔
    calcAttackTime() {
        var finalFrame = this.attr.finalFrame;
        // sec spec
        if (this.flags.sec) {
            this.attackTime = {
                baseAttackTime: 1,
                attackSpeed: 100,
                frame: _fps,
                realTime: 1,
                frameTime: 1
            };
        } else {
            var _spd = Math.min(Math.max(10, finalFrame.attackSpeed), 600);
            if (finalFrame.attackSpeed != _spd) {
                finalFrame.attackSpeed = _spd;
                this.log.write(`攻速超过界限，修正为${_spd}`, "rotation");
            }
            var realTime = finalFrame.baseAttackTime * 100 / finalFrame.attackSpeed;
            // token?
            var f = Math.round(realTime * _fps);
            var corr = checkSpecs(this.char.charId, "frame_corr") || 0;
            if (this.flags.skill) {
                if (!(checkSpecs(this.char.skillId, "frame_corr") === false))
                    corr = _spec;
                if (corr) {
                    f += corr;
                    this.log.note(`技能强制后摇+${corr} (${f}帧)`);
                }
            } else {
                if (corr) {
                    f += corr;
                    this.log.note(`普攻强制后摇+${corr} (${f}帧)`)
                }
            }
            var frameTime = f / _fps;
            this.attackTime = {
                baseAttackTime: finalFrame.baseAttackTime,
                attackSpeed: finalFrame.attackSpeed,
                frame: f,
                realTime,
                frameTime
            };
        }

        return this.attackTime;
    }

    // 循环计算
    calcRotation() {
        var buffFrame = this.attr.buffFrame;
        var attackTime = this.attackTime.frameTime;
        var blackboard = this.char.blackboard;
        var skillId = this.skillId;
        var levelData = this.char.levelData;
        var spData = levelData.spData;
        var duration = 0, attackCount = 0, critAttackCount = 0;
        // 晕眩/准备时间
        var stunDuration = buffFrame.stunDuration, prepDuration = buffFrame.prepDuration;
        var isOGCD = (checkSpecs(skillId, "reset_attack") == "ogcd");
        var rotationFlags = {}; // 技能类型推断信息
        var args = {};  // callSpecial参数

        this.log.pushKey("Rotation");
        // 点火时间（落地还差多少sp启动）
        // 必须返回 { startSp: x }
        var startSp = spData.spCost - spData.initSp;
        if (this.callSpecialForAny("rotation_startSp", {spData}))
            startSp = this.retvar.startSp;

        if (this.flags.skill) {
            rotationFlags.skill = true;
            
            // 快速估算            
            attackCount = Math.ceil((levelData.duration - prepDuration)/ attackTime);
            duration = attackCount * attackTime;

            // callSpecial 参数
            args = {
                spData,
                levelData, 
                //blackboard,
                attackTime,
                prepDuration,
                buffFrame,
                attackCount,
                duration
            };
            //console.log("skill_duration", args);
            // 重置普攻
            if (this.char.canResetAttack()) {            
                if (duration > (levelData.duration - prepDuration) && !isOGCD)
                    this.log.write(`可能重置普攻`);
                duration = levelData.duration - prepDuration;
                // 抬手时间
                var beg = 12;
                if (checkSpecs(skillId, "attack_begin")) {
                    beg = _spec;
                    this.log.write(`抬手: ${beg} 帧`);
                    this.log.note(`抬手: ${beg} 帧`);
                } else {
                    this.log.write("暂无抬手时间数据，以12帧进行估算");
                }
                attackCount = Math.ceil((duration - beg / 30 ) / attackTime);
            }

            // 技能循环特判
            // 返回 { duration, attackCount, rotationFlags }
            if (this.callSpecialForAny("skill_duration", args, true)) {
                console.log(this.retvar);
                duration = this.retvar.duration;
                attackCount = this.retvar.attackCount;
                if (this.retvar.rotationFlags) Object.assign(rotationFlags, this.retvar.rotationFlags);
            } else if (checkSpecs(skillId, "toggle")) {
                attackCount = Math.ceil(30 / attackTime);
                duration = 30;
                rotationFlags.toggle = true;
                this.log.note("切换类技能 (以30s为参考计算)");
            } else if (levelData.description.includes("持续时间无限")) {
                attackCount = Math.ceil(1800 / attackTime);
                duration = attackCount * attackTime;
                rotationFlags.warmup = true;
                this.log.note("持续时间无限 (以1800s为参考计算)");
            } else if (spData.spType == 8) {
                // 落地点火/被动类技能
                // 规范化
                if (levelData.duration <= 0 && blackboard.duration > 0) {
                    levelData.duration = blackboard.duration;
                    duration = blackboard.duration;
                    attackCount = Math.ceil(levelData.duration / attackTime);
                }
                // 判断具体类型
                if (checkSpecs(skillId, "passive")) {
                    this.log.note("被动");
                    attackCount = 1;
                    duration = attackTime;
                    rotationFlags.passive = true;
                } else if (levelData.duration > 0) {
                    this.log.note("落地点火");
                    rotationFlags.auto = true;
                } else { // 摔炮
                    attackCount = 1;
                    duration = 0;
                    this.log.note("落地点火+瞬发");
                    rotationFlags.auto = true;
                    rotationFlags.instant = true;
                }
            } else if (levelData.duration <= 0) {
                // 普通瞬发技能
                if (checkSpecs(skillId, "instant_buff")) {
                    // 华法琳2类型
                    duration = blackboard.duration || checkSpecs(skillId, "duration");
                    attackCount = Math.ceil(duration / attackTime);
                    this.log.note("瞬发增益效果");
                    rotationFlags.instant = true;
                } else {
                    this.log.note("瞬发");
                    rotationFlags.instant = true;
                    attackCount = 1; duration = 1;
                    // 如果不是OGCD技能则需要占用一次普攻
                    if (!isOGCD) duration = attackTime;
                    // 技能动画时间处理
                    if (checkSpecs(skillId, "cast_time")) {
                        // 调整技能时间为技能动画时间
                        if (isOGCD || (spData.spType == 1 && duration < _spec/_fps))
                            duration = _spec / _fps;
                        this.log.note(`技能动画(阻回) ${_spec} 帧`);
                    }
                }
            } // if levelData.duration
        } else { // 普攻
            rotationFlags.normal = true;
            // 眩晕处理

            // callSpecial 参数
            args = {
                spData, 
                //blackboard,
                attackTime,
                stunDuration,
                buffFrame
            };

            // 根据sp恢复速度估算普攻的最短时间
            let attackDuration = spData.spCost / (1 + buffFrame.spRecoveryPerSec) - stunDuration;
            
            // 施法时间<攻击间隔时会额外恢复一些sp，需要从attackDuration里减去
            if (checkSpecs(skillId, "cast_time")) {
                if (attackTime > _spec/_fps && !isOGCD) {
                    attackDuration -= (attackTime - _spec/_fps);
                    this.log.write(`技能动画(阻回) ${_spec} 帧`);
                }
            }

            // 重置普攻时，duration即为sp恢复时间
            // 但计算普攻攻击次数时要减去一次抬手的时间
            if (this.char.canResetAttack() && !isOGCD && spData.spType != 8) {
                // 抬手时间
                var beg = checkSpecs(skillId, "attack_begin") || 12;
                duration = attackDuration;
                attackCount = Math.ceil((attackDuration - beg/_fps) / attackTime);
            } else {
                // 不重置普攻则根据完整的攻击次数反推duration
                attackCount = Math.ceil(attackDuration / attackTime);
                duration = attackCount * attackTime;
            }

            // 普攻循环计算插桩. 返回{duration, attackCount, [rotationFlags]}
            if (this.callSpecialForAny("normal_duration", args, true)) {
                duration = this.retvar.duration;
                attackCount = this.retvar.attackCount;
                if (this.retvar.rotationFlags) Object.assign(rotationFlags, this.retvar.rotationFlags);
            } else {
                switch (spData.spType) {
                    case 8: // 被动或落地点火
                        // 规范化
                        if (levelData.duration <= 0 && blackboard.duration > 0) {
                            levelData.duration = blackboard.duration;
                        }
                        if (checkSpecs(skillId, "passive")) { // 被动
                            attackCount = 10;
                            duration = attackCount * attackTime;
                            rotationFlags.passive = true;
                            this.log.note("以10次普攻计算");
                        } else if (levelData.duration > 0) {  // 落地点火
                            attackDuration = levelData.duration;
                            attackCount = Math.ceil(attackDuration / attackTime);
                            duration = attackCount * attackTime;
                            rotationFlags.auto = true;
                            this.log.note("取普攻时间=技能持续时间");
                        } else { // 摔炮
                            attackDuration = 10;
                            attackCount = Math.ceil(attackDuration / attackTime);
                            duration = attackCount * attackTime;
                            rotationFlags.auto = true;
                            rotationFlags.instant = true;
                            this.log.note("以10s普攻计算");
                        }
                        break;
                    case 4: // 受击回复
                        this.log.note("受击回复");
                        rotationFlags.hit = true;
                        break;
                    case 2: // 攻击回复
                        attackCount = spData.spCost;
                        rotationFlags.attack = true;
                        if (this.char.canResetAttack())
                            duration = (attackCount-1) * attackTime;
                        else
                            duration = attackCount * attackTime;
                        break;
                    case 1: // 自动回复-特判
                        if (checkSpecs(skillId, "instant_buff")) { // 不稳定血浆: 减去buff持续时间
                            attackDuration -= blackboard.duration || checkSpecs(skillId, "duration");
                            attackCount = Math.ceil(attackDuration / attackTime);
                            duration = attackCount * attackTime;
                            rotationFlags.instant = true;
                        } else if (checkSpecs(skillId, "toggle")) {
                            attackCount = Math.ceil(30 / attackTime);
                            duration = 30;
                            rotationFlags.toggle = true;
                            this.log.note("切换类技能 (以30s为参考计算)");
                        } 
                        break;
                } // switch
            } // else
        } // isSkill

        // 暴击次数计算
        if (this.flags.has_crit) {
            buffFrame = this.critAttr.buffFrame;
            args = {
                attr: this.critAttr,
                attackCount,
                duration,
                buffFrame
            };
            // 暴击次数特判 返回 { critAttackCount }
            if (this.callSpecialForAny("crit_attackCount", args)) {
                critAttackCount = this.retvar.critAttackCount;
            } else if (buffFrame.prob > 0) { // 防止误入
                critAttackCount = attackCount * buffFrame.prob;
            }
            if (critAttackCount > 1) critAttackCount = Math.floor(critAttackCount);
            if (critAttackCount > 0) {
                rotationFlags.crit = true;
                this.log.write(`- 暴击次数估算: ${critAttackCount} / ${attackCount}`);
                attackCount -= critAttackCount;
            }
        }
        this.log.popKey('Rotation');
        this.flags.defer = true;   // 标记rotation已经计算完毕，可以计算deferred buff
        var total = (this.flags.skill) ? duration + prepDuration : duration + stunDuration;

        this.rotation = {
            duration,
            attackCount,
            critAttackCount,
            totalAttackCount: attackCount + critAttackCount,
            prepDuration,  
            stunDuration,
            totalDuration: total,
            startSp,
            flags: rotationFlags
        };
        return this.rotation;
    }

    calcDamage() {
        this.log.pushKey("Damage");
        // 命中次数特判
        // 返回: { hitCount : x, critHitCount: x }
        if (this.callSpecialForAny("hitCount", null)) {
            this.hitCount = this.retvar.hitCount;
            this.critHitCount = this.retvar.critHitCount;
        } else {
            this.hitCount = this.rotation.attackCount * this.attr.buffFrame.times * this.attr.finalEnemy.count;
            this.critHitCount = this.rotation.critAttackCount * this.critAttr.buffFrame.times * this.critAttr.finalEnemy.count;
        }
        // 伤害公式特判（包含暴击）
        // 返回: { damage }
        if (this.callSpecialForAny("calcDamage", null, true)) {
            this.damagePool[this.getDamageType()] = this.retvar.damage;
            if (this.retvar.hitDamage) this.hitDamage = this.retvar.hitDamage;
        } else {
            var p = this.attr.calcDamagePool(null, this.hitCount);
            this.damagePool = p.pool;
            this.hitDamage = p.hitDamage;
            if (this.hitCount > 0) this.log.write(p.log);

            if (this.critHitCount > 0) {
                var cp = this.critAttr.calcDamagePool(null, this.critHitCount);
                this.damagePool[this.critAttr.damageType] += cp.pool[this.critAttr.damageType];
                this.critHitDamage = cp.hitDamage;
                this.log.write(cp.log);
            }
        }

        // 额外伤害
        this.extraDamagePool = [0, 0, 0, 0, 0];
        // 和charId相关的额外伤害（sora,ethan）
        this.callSpecial(this.char.charId, "extraDamage");        
        for (var b in this.buffList) {
            let buffKey = b;
            this._buffKey = b;
            if (!this.attr.applied[b] && !this.critAttr.applied[b])
                console.log("??? not applied: ", b);
            let bb = this.buffList[b];
            var args = {
                buffKey,
                blackboard: bb,
                hpratiosec: bb.hp_recovery_per_sec_by_max_hp_ratio,
                hpsec: bb.hp_recovery_per_sec,
                hpratio: bb.hp_ratio,
                finalFrame: this.attr.finalFrame,
                enemy: this.attr.finalEnemy
            };
            // 额外伤害特判
            // 返回: { pool: [x, x, x, x, x] }
            if (!this.callSpecial(buffKey, "extraDamage", [args])) {
                this.retvar = { pool: [0, 0, 0, 0, 0]};
                var _hps = 0;
                // 通用判定
                if (args.hpratiosec) {
                    this.retvar.pool[2] += args.hpratiosec * args.finalFrame.maxHp * (this.rotation.totalDuration);
                    _hps += args.hpratiosec * args.finalFrame.maxHp;
                }
                if (args.hpsec) {
                    this.retvar.pool[2] += args.hpsec * this.rotation.totalDuration;
                    _hps += args.hpsec;
                }
                if (args.hpratio) {
                    this.retvar.pool[2] += args.hpratio * this.attr.finalFrame.maxHp * this.rotation.attackCount;
                    this.writeBuff(`每次攻击恢复 ${(args.hpratio * args.finalFrame.maxHp).toFixed(1)} HP`);
                }
                if (_hps != 0) this.writeBuff(`每秒恢复: ${_hps.toFixed(1)}`);
            }
            if (this.retvar.log) this.writeBuff(this.retvar.log);
            let line = [`- [额外伤害/治疗] ${_names[buffKey]}:`];
            for (var i=0; i<5; ++i)
                if (this.retvar.pool[i] != 0) {
                    this.extraDamagePool[i] += this.retvar.pool[i];
                    line.push(`${DamageTypeText[i]} ${this.retvar.pool[i].toFixed(1)}`);
                }
            if (line.length>1) this.log.write(line.join(" "));

        }
        this.log.popKey();
    }

    calcDps() {
        this.totalDamage = [0, 1, 3].reduce((x, y) => x + this.damagePool[y] + this.extraDamagePool[y], 0);
        this.totalHeal = [2, 4].reduce((x, y) => x + this.damagePool[y] + this.extraDamagePool[y], 0);
        this.extraDamage = [0, 1, 3].reduce((x, y) => x + this.extraDamagePool[y], 0);
        this.extraHeal = [2, 4].reduce((x, y) => x + this.extraDamagePool[y], 0);
      
        this.log.write(`总伤害: ${this.totalDamage.toFixed(2)}`);
        if (this.totalHeal != 0) this.log.write(`总治疗: ${this.totalHeal.toFixed(2)}`);
      
        this.dps = this.totalDamage / this.rotation.totalDuration;
        this.hps = this.totalHeal / this.rotation.totalDuration;
    }
}

class DpsCalculator {
    constructor() {        
        this.normal = new DpsContext();
        this.skill = new DpsContext();
        this.skill.flags.skill = true;
    }

    setup(char, raidBuff=null) {
        this.char = new Character();
        this.char.setChar(char);
        this.raidBuff = raidBuff;
        [this.normal, this.skill].forEach (ctxt => {
            ctxt.setChar(char);
            ctxt.setRaidBuff(raidBuff);
            ctxt.calcBasicFrame();
            ctxt.makeBuffList();
        });
    }

    calcRotation() {
        [this.normal, this.skill].forEach (ctxt => {
            ctxt.updateBuffs();
            ctxt.calcAttackTime();
            ctxt.calcRotation();
            ctxt.updateBuffs();
        });
    }

    applyEnemy(enemy=null) {
        [this.normal, this.skill].forEach (ctxt => {
            ctxt.setEnemy(enemy);
        });
    }

    calcDps() {
        [this.normal, this.skill].forEach (ctxt => {
            ctxt.calcDamage();
            ctxt.calcDps();
        });
        // global
        this.globalDps = (this.skill.totalDamage + this.normal.totalDamage) / (this.skill.rotation.totalDuration + this.normal.rotation.totalDuration);
        this.globalHps = (this.skill.totalHeal + this.normal.totalHeal) / (this.skill.rotation.totalDuration + this.normal.rotation.totalDuration);
    }

    calculateDps(char, enemy=null, raidBuff=null) {
        this.setup(char, raidBuff);
        this.calcRotation();
        this.applyEnemy(enemy);
        this.calcDps();
        this.summary = this.explainGlossary();
    }

    explain() {
        var ret = {
            g_dps : this.globalDps,
            g_hps : this.globalHps,
            start : this.skill.rotation.startSp / (1 + this.normal.attr.buffFrame.spRecoveryPerSec),    // 点火sp换算为时间

            s_dps : this.skill.dps,  // i.e. s_dps : s_dmg / s_dur
            s_hps : this.skill.hps,
            s_dmg : this.skill.totalDamage,
            s_heal: this.skill.totalHeal,
            s_atk:  this.skill.attr.finalFrame.atk,
            s_dur : this.skill.rotation.duration,  // 不包含准备时间
            s_type: this.skill.getDamageType(),
            s_rot : this.skill.rotation,
            s_time: this.skill.attackTime,
            s_log : this.skill.log.log,
            s_pool: { direct: this.skill.damagePool, extra: this.skill.extraDamagePool },
            s_enemy: this.skill.attr.finalEnemy,
            prep  : this.skill.rotation.prepDuration,   // 准备时间
 
            n_dps : this.normal.dps,
            n_hps : this.normal.hps,
            n_dmg : this.normal.totalDamage,
            n_heal: this.normal.totalHeal,
            n_atk:  this.normal.attr.finalFrame.atk,
            n_dur : this.normal.rotation.duration, // 不包含眩晕
            n_type: this.normal.getDamageType(),
            n_rot : this.normal.rotation,
            n_time: this.normal.attackTime,
            n_log : this.normal.log.log,
            n_pool: { direct: this.normal.damagePool, extra: this.normal.extraDamagePool },
            n_enemy: this.normal.attr.finalEnemy,
            stun  : this.normal.rotation.stunDuration,   // 眩晕时间
        };
        
        // 攻回
        if (ret.s_rot.flags.attack) {
            ret.start = this.skill.rotation.startSp;
        }
        ret.note = [];
        if (ret.s_log.note) ret.s_log.note.forEach(x => {
            if (!ret.note.includes(x)) ret.note.push(x);
        });
        if (ret.n_log.note) ret.n_log.note.forEach(x => {
            if (!ret.note.includes(x)) ret.note.push(x);
        });
        return ret;
    }

    // 调试用
    explainGlossary() {
        var glossary = {
            g_dps : "平均 - DPS",
            g_hps : "平均 - HPS",
            start : "技能启动时间",

            s_dps : "技能 - DPS",  // i.e. s_dps : s_dmg / s_dur
            s_hps : "技能 - HPS",
            s_dmg : "技能 - 总伤害",
            s_heal: "技能 - 总治疗",
            s_atk : "技能 - 攻击力",
            s_dur : "技能 - 持续时间",  // 不包含准备时间
            s_type: "技能 - 攻击类型",
            s_rot : "技能 - 循环",
            s_time: "技能 - 攻击间隔",
            s_log : "技能 - 计算过程",
            s_pool: "技能 - 伤害池",
            s_enemy: "技能 - 敌人属性",
            prep  : "技能 - 准备时间",   // 准备时间
 
            n_dps : "普攻 - DPS",  // i.e. s_dps : s_dmg / s_dur
            n_hps : "普攻 - HPS",
            n_dmg : "普攻 - 总伤害",
            n_heal: "普攻 - 总治疗",
            n_atk : "普攻 - 攻击力",
            n_dur : "普攻 - 持续时间",  // 不包含准备时间
            n_type: "普攻 - 攻击类型",
            n_rot : "普攻 - 循环",
            n_time: "普攻 - 攻击间隔",
            n_log : "普攻 - 计算过程",
            n_pool: "普攻 - 伤害池",
            n_enemy: "普攻 - 敌人属性",
            stun  : "普攻 - 眩晕时间",   // 眩晕时间
        };
        var ret = {};
        var e = this.explain();
        Object.keys(e).forEach( k => { ret[glossary[k]] = e[k]; });
        return ret; 
    }
}

export{
    Log, DpsContext, DpsCalculator
};