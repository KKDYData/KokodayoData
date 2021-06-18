// 格式化带符号数字
function _num(x, n=1) { return (x>0 ? "+":"") + x.toFixed(n); }

var common = {
  baseAttackTimeAddition: function (attr, blackboard) {
      // e.g. 攻击间隔 +0.5s
      attr.buffFrame.baseAttackTime += blackboard.base_attack_time;
      this.writeBuff(`base_attack_time + ${blackboard.base_attack_time}s (加算)`);
      delete blackboard.base_attack_time;
      return { done: false };
  },
  baseAttackTimeMultiplyNegative: function (attr, blackboard) {
      // e.g. 攻击间隔 * (-50%) (负数)，换算成加值
      this.writeBuff(`base_attack_time * (1${_num(blackboard.base_attack_time * 100)}%) (乘算负数)`);
      blackboard.base_attack_time *= attr.basicFrame.baseAttackTime;
      return { done: false };
  },
  baseAttackTimeMultiply: function (attr, blackboard) {
      // e.g. 攻击间隔 * (50%) (正数)，换算成加值
      // x% = 1 + (x%-1)
      this.writeBuff(`base_attack_time * ${_num(blackboard.base_attack_time * 100)}% (乘算正数)`);
      blackboard.base_attack_time = (blackboard.base_attack_time - 1) * attr.basicFrame.baseAttackTime;
      return { done: false };
  },
  calcDamageTable: function () {
      this.log.write("- [特殊] 单独计算每击伤害");
      var a = this.atk_table.map(x => this.attr.basicFrame.atk * x);
      var pivot = a[a.length-1];
      a = a.map(x => (this.attr.finalFrame.atk - pivot + x));
      var pool = []; 
      for (var i=0; i<this.rotation.attackCount; ++i) {
          var atk = (i >= a.length ? pivot: a[i]);
          pool.push(this.attr.calcHitDamage(atk) * this.attr.finalEnemy.count);
      }
      var damage = pool.reduce((x, y) => x + y);
      this.log.write(`- 攻击力(含倍率): ${a.map(x => x.toFixed(1))}`);
      this.log.write(`- 伤害: ${pool.map(x => x.toFixed(1))}`);
      return { damage };
  },
  noAttack: function (args) {
      this.log.write("- [特殊] 不攻击");
      return { duration: args.duration, attackCount: 0 };
  },
  noExtra: function (args) {
      return { pool: [0, 0, 0, 0, 0] };
  }
};

var CommonActions = common;

var Actions = {
  char_101_sora: {
    extraDamage: function() {
        var rate = 0.1;
        if (this.flags.skill && this.skillId == "skchr_sora_1") {
            rate = this.buffList["skchr_sora_1"]["attack@atk_to_hp_recovery_ratio"];
        }
        var hps = rate * this.attr.finalFrame.atk;
        var heal = hps * this.rotation.duration * this.attr.finalEnemy.count;
        this.log.write(`- 空：单体hps = ${hps.toFixed(1)}, 被动治疗量 ${heal.toFixed(1)}`);
        this.extraDamagePool[2] = heal;
    },
    skill_duration: common.noAttack,
    normal_duration: common.noAttack
  },
  char_291_aglina: {
      normal_duration: function (args) {
          if (["skchr_aglina_2", "skchr_aglina_3"].includes(this.skillId)) {
              return common.noAttack.apply(this, [args]);
          } else return { duration: args.duration, attackCount: args.attackCount };
      }
  },
  char_306_leizi: {   
      applyCharSpecs: function (attr) {
          if (this.flags.enemy && !(this.flags.skill && this.skillId == "skchr_leizi_2")) {
              // setEnemy会调用restoreBuffs所以这里直接在最终结果上乘
              var avg_scale = 1 - 0.125 * (attr.finalEnemy.count - 1);
              attr.buffFrame.damage_scale *= avg_scale;
              this.log.write(`- [特殊] 惊蛰: 命中目标 ${attr.finalEnemy.count}，平均倍率 x${avg_scale.toFixed(3)} (${attr.buffFrame.damage_scale.toFixed(3)}x)`);
          }
      }
  },
  char_328_cammou: {
      calcDamage: function () {
          this.log.write("- [特殊] 单独计算每击伤害");
          var scale_table = [1.2, 1.35, 1.5, 1.65, 1.8, 1.95, 2.1]; // 本体+无人机总的atk_scale
          var atk = this.attr.finalFrame.atk, max_scale = 2.1;
          var pool = []; 
          for (var i=0; i<this.rotation.attackCount; ++i) {
              var a = (i >= scale_table.length ? atk*max_scale: atk*scale_table[i]);
              pool.push(this.attr.calcHitDamage(a));
          }
          var damage = pool.reduce((x, y) => x + y);
          this.log.write(`- 伤害: ${pool.map(x => x.toFixed(1))}`);
          return { damage };
      }
  },
  char_344_beewax: { normal_duration: common.noAttack },
  char_355_ethan: { 
      extraDamage: function() {
          if (this.skillId == "skchr_ethan_1") {
              this._buffKey = "skchr_ethan_1";
              var p = this.attr.calcDamagePool( 
                  this.char.blackboard["attack@poison_damage"],
                  this.rotation.duration * this.attr.finalEnemy.count, 1);
              this.writeBuff(p.log);
              this.extraDamagePool = p.pool;
          }
      }
  },
  char_388_mint:   { normal_duration: common.noAttack },
  char_391_rosmon: {   
      applyCharSpecs: function (attr) {
          attr.buffFrame.maxTarget = 999;
          this.log.write("- [特殊] 迷迭香: maxTarget = 999");
      }
  },
  skchr_aglina_2: { applyBuff: common.baseAttackTimeMultiply },
  skchr_amgoat_2: {
      extraDamage: function(args) { // 点燃
          return this.attr.calcDamagePool(args.finalFrame.atk / 2,
              (this.enemy.count-1) * this.rotation.attackCount);
      }
  },
  skchr_amiya2_2: {   
      applyBuff: function (_, blackboard) {
          if (this.options.stack) {
              blackboard.atk = blackboard["amiya2_s_2[kill].atk"] * blackboard["amiya2_s_2[kill].max_stack_cnt"];
              this.log.note("所有伤害按叠满攻击力计算");
          } else this.log.note("不叠攻击时的伤害");
          return { done: false };
      },
      extraDamage: function (args) {
          var arts_atk = args.finalFrame.atk_noscale * args.blackboard.atk_scale;
          var real_atk = args.finalFrame.atk_noscale * args.blackboard.atk_scale_2;
          var arts_dmg = this.attr.calcHitDamage(arts_atk, 1);
          var real_dmg = this.attr.calcHitDamage(real_atk, 3); // 会计算damage_scale
          this.writeBuff(`法术伤害 ${arts_dmg.toFixed(1)}, 命中 9 / 最后一刀真实伤害 ${real_dmg.toFixed(1)}`);
          return { pool: [0, arts_dmg*9, 0, real_dmg, 0] };
      }
  }, 
  skchr_angel_3: {   
      applyBuff: function (_, blackboard) {
          blackboard.base_attack_time *= 2;
          this.log.note("攻击间隔双倍减算");
          return { done: false };
      }
  },
  skchr_ayer_2: {
      extraDamage: function(args) {
          this.log.note("假设所有目标都被阻挡");
          return this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard.atk_scale,
              this.enemy.count * this.rotation.attackCount, 1);            
      }
  },
  skchr_beewax_2: { 
      extraDamage: function(args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk * args.blackboard.atk_scale, 
              args.enemy.count);
      }
  },
  skchr_bluep_2: {
      hitCount: function () {
          var hitCount = this.rotation.attackCount * this.attr.buffFrame.times * this.attr.finalEnemy.count;
          // 对主目标多攻击0-1次
          var extraHit = this.rotation.attackCount * (this.buffList["skchr_bluep_2"]["attack@times"] - 1);
          hitCount += extraHit;
          this.log.write(`- [${_names["skchr_bluep_2"]}] 对主目标额外命中: ${extraHit}`);
          return {hitCount, critHitCount: 0};
      }
  },
  skchr_bibeak_1: {
      extraDamage: function(args) {
          if (args.enemy.count >= 1)
              return this.attr.calcDamagePool(null, 1, 1);
          else return { pool: [0, 0, 0, 0, 0] };
      }
  },
  skchr_bldsk_2: {
      extraDamage: function (args) {
          var damage = -args.hpratio * args.finalFrame.maxHp;  // 自爆
          this.writeBuff(`自身伤害: ${damage.toFixed(1)}/s (x2目标)`);
          return { pool: [0, 0, damage * args.blackboard.duration * 2, 0, 0] };
      }
  },
  skchr_blemsh_1: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard.heal_scale,
              this.hitCount, 2);
      }
  },
  skchr_blemsh_2: {
      extraDamage: function(args) { // HoT
          var heal = args.finalFrame.atk_noscale * args.blackboard["attack@atk_to_hp_recovery_ratio"];
          var t = this.rotation.duration;
          this.log.note("可以治疗召唤物");
          this.writeBuff(`HoT: ${heal.toFixed(1)}/s，可以治疗召唤物`);
          return { pool: [0, 0, heal*t*this.enemy.count, 0, 0] };
      }
  },
  skchr_blemsh_3: {
      extraDamage: function (args) {
          var arts = this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard["attack@blemsh_s_3_extra_dmg[magic].atk_scale"],
              this.hitCount, 1);
          var heal = this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard.heal_scale,
              this.hitCount, 2);
          
          if (this.options.cond) this.log.note("额外法伤享受睡眠增伤");
          return { pool: [0, arts.pool[1], heal.pool[2], 0, 0],
                  log: arts.log + "; " + heal.log };    
          }
  },
  skchr_breeze_2: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk/2,
              (this.enemy.count - 1) * this.rotation.attackCount, 2);
      }
  },
  skchr_brownb_2: { applyBuff: common.baseAttackTimeMultiplyNegative },
  skchr_ccheal_1: { 
      extraDamage: function(args) { // HoT
          var heal = args.finalFrame.atk * args.blackboard.heal_scale;
          var t = args.blackboard.duration * this.rotation.attackCount;
          this.log.write("按高于半血计算HoT");
          this.writeBuff(`HoT: ${heal.toFixed(1)}/s, 覆盖 ${t.toFixed(1)}s`);
          return { pool: [0, 0, heal*t, 0, 0] };
      }
  },
  skchr_ccheal_2: { 
      extraDamage: function(args) { // HoT
          var heal = args.finalFrame.atk * args.blackboard.heal_scale;
          var t = args.blackboard.duration;
          this.log.write("按高于半血计算HoT");
          this.writeBuff(`HoT: ${heal.toFixed(1)}/s, 持续 ${t.toFixed(1)}s, 命中 ${args.enemy.count}`);
          return { pool: [0, 0, heal*t*args.enemy.count, 0, 0] };
      }
  },
  skchr_cerber_2: { applyBuff: common.baseAttackTimeMultiply },
  skchr_cgbird_2: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk * args.blackboard.atk_scale,
              this.hitCount, 4);
      }
  },
  skchr_chen_2: {
      extraDamage: function(args) {
          return this.attr.calcDamagePool(null, this.hitCount, 1);
      }
  },
  skchr_cutter_2: {
      applyBuff: function (_, blackboard) {
          if (this.options.cond) {
              blackboard.atk_scale *= blackboard["cutter_s_2[drone].atk_scale"];
              this.log.note(`对空倍率 ${_num(blackboard.atk_scale)}x`);
          }
          return { done: false };
      }
  },
  skchr_deepcl_1: {
      applyBuff: function (_, __) { return { done: !this.options.token }; }
  },
  skchr_elysm_2: { skill_duration: common.noAttack },
  skchr_f12yin_2: {   
      applyBuff: function (_, blackboard) {
          blackboard.def_scale = 1 + blackboard.def;  // 防御为负数，但是是最终乘算
          delete blackboard.def;
          return { done: false };
      }
  },
  skchr_finlpp_2: { applyBuff: common.baseAttackTimeMultiply },
  skchr_folivo_1: {
      applyBuff: function (_, __) { return { done: !this.options.token }; }
  },
  skchr_folivo_2: {
      applyBuff: function (_, __) { return { done: !this.options.token }; }
  },
  skchr_folnic_2: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * this.attr.buffFrame.heal_scale,
              this.hitCount, 2);
      }
  },
  skchr_glaze_2: { applyBuff: common.baseAttackTimeAddition },
  skchr_gravel_2: {
      extraDamage: function (args) {
          return { pool: [0, 0, 0, 0, args.hpratio * args.finalFrame.maxHp] };
      }
  },
  skchr_hmau_2: { applyBuff: common.baseAttackTimeAddition },
  skchr_huang_3: {
      applyBuff: function (attr, blackboard) {
          this.atk_table = [...Array(8).keys()].map(x => blackboard.atk / 8 *(x+1));
          this.writeBuff(`技能攻击力系数: ${this.atk_table.map(x => x.toFixed(2))}`);
          return { done: false };
      },
      skill_duration: function (args) {
          this.log.note("技能为8段攻击+最终伤害");
          return { duration: 10, attackCount: 8 };
      },
      calcDamage: common.calcDamageTable,
      extraDamage: function(args) {
          var p = this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard.damage_by_atk_scale,
              this.enemy.count);
          p.pool[2] = -args.hpratio * args.finalFrame.maxHp;  // 自爆
          return p;
      }
  },
  skchr_ifrit_2: {
      extraDamage: function(args) { // 炎爆            
          var damage = this.attr.calcHitDamage(
                  args.finalFrame.atk_noscale * args.blackboard["burn.atk_scale"]);
          var d = Math.floor(args.blackboard.duration);
          var total = damage * d * this.hitCount;
          this.writeBuff(`额外法伤: ${damage.toFixed(1)}/s, 命中 ${this.hitCount}`);
          this.writeBuff("(灼烧按持续3s计算，不考虑攻速改变导致的覆盖)");            
          return { pool: [0, total, 0, 0, 0] };
      }
  },
  skchr_ifrit_3: {
      extraDamage: function (args) {
          var damage = -args.hpratio * args.finalFrame.maxHp;  // 自爆
          this.writeBuff(`自身伤害: ${damage.toFixed(1)}/s`);
          return { pool: [0, 0, damage * this.rotation.duration, 0, 0] };
      }
  },
  skchr_jaksel_2: { applyBuff: common.baseAttackTimeMultiply },
  skchr_kafka_1: {
      skill_duration: function(args) { return { duration: args.blackboard.duration, attackCount: 0}; },
      extraDamage: function(args) { return this.attr.calcDamagePool(args.finalFrame.atk, args.enemy.count); }
  },
  skchr_kafka_2: {
      extraDamage: function(args) { return this.attr.calcDamagePool(args.finalFrame.atk * args.blackboard.atk_scale, args.enemy.count); }
  },
  skchr_lisa_3: {
      skill_duration: common.noAttack,
      extraDamage: function(args) { // HoT
          var heal = args.finalFrame.atk * args.blackboard["attack@atk_to_hp_recovery_ratio"];
          var t = this.rotation.duration;
          this.log.note("可以治疗召唤物");
          this.writeBuff(`HoT: ${heal.toFixed(1)}/s，可以治疗召唤物`);
          return { pool: [0, 0, heal*t*this.enemy.count, 0, 0] };
      }
  },
  skchr_mantic_2: { applyBuff: common.baseAttackTimeAddition },
  skchr_mint_2: { 
      extraDamage: function(args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk * args.blackboard.atk_scale, 
              args.enemy.count);
      }
  },
  skchr_mudrok_3: { applyBuff: common.baseAttackTimeMultiplyNegative },
  skchr_myrtle_2: { skill_duration: common.noAttack },
  skchr_nightm_1: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              this.hitDamage * this.attr.buffFrame.heal_scale,
              Math.min(this.enemy.count, args.blackboard["attack@max_target"]) * this.rotation.attackCount,
              2);
      }
  },
  skchr_nightm_2: {
      extraDamage: function(args) { // 夜魔2
          var move = args.blackboard.duration / 4;
          var total = move * args.blackboard.value * args.enemy.count;
          this.log.note(`位移以${move.toFixed(2)}格计算`);
          return { pool: [0, 0, 0, total, 0] };
      }
  },
  skchr_peacok_1: {   
      applyBuff: function (attr, blackboard) {
          if (attr.crit) blackboard.atk_scale = blackboard.atk_scale_fake;
          return { done: false };
      }
  },
  skchr_peacok_2: {   
      applyBuff: function (attr, blackboard) {
          if (attr.crit) {
              blackboard.atk_scale = blackboard["success.atk_scale"];
              attr.buffFrame.maxTarget = 999;
              attr.damageType = 1;    // 改法伤(test)
              this.writeBuff(`成功 - atk_scale = ${blackboard["success.atk_scale"]}`);
          } else {
              blackboard.stunDuration = blackboard["failure.stun"] * (1 - blackboard.prob);
              this.log.note("成功时记为暴击，失败时眩晕");
          }
          return { done: false };
      }
  },
  skchr_phatom_1: {
      extraDamage: function (args) {
          return { pool: [0, 0, 0, 0, args.hpratio * args.finalFrame.maxHp] };
      }
  },
  skchr_phatom_2: {
      applyBuff: function (_, blackboard) {
          this.atk_table = [...Array(blackboard.times).keys()].reverse().map(x => blackboard.atk * (x+1));
          this.writeBuff(`技能攻击力系数: ${this.atk_table.map(x => x.toFixed(2))}`);
          delete blackboard.times;
          return { done: false };
      },
      skill_duration: function (args) {
          var attackCount = args.blackboard.times;
          var duration = args.attackTime * attackCount;
          var rotationFlags = { auto: true };
          return { attackCount, duration, rotationFlags };
      },
      calcDamage: common.calcDamageTable
  },
  skchr_podego_2: { 
      skill_duration: common.noAttack,
      extraDamage: function(args) { // 毒伤类
          var total = this.hitDamage * args.blackboard.projectile_delay_time * args.enemy.count;
          this.writeBuff(`每秒毒伤: ${this.hitDamage.toFixed(1)}, 持续 ${args.blackboard.projectile_delay_time}s`);
          return { pool: [0, total, 0, 0, 0] };
      }
  },
  skchr_rosmon_1: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard.extra_atk_scale,
              this.hitCount, 1);
      }
  },
  skchr_rosmon_3: { 
      applyBuff: function (attr, blackboard) {
          common.baseAttackTimeMultiplyNegative.apply(this, [attr, blackboard]);
          blackboard.edef = -160; this.log.note("计算token减防效果");
          if (this.options.rosmon_double) {
              blackboard.times = Math.min(attr.enemy.count, 2);
              if (blackboard.times == 1)
                  log.note("未触发双剑,需要至少2个敌人");
              else log.note("双剑重叠伤害");
          }
          return { done: false };
      }
  },
  skchr_sddrag_2: {
      extraDamage: function(args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk * args.blackboard["attack@skill.atk_scale"],
              this.hitCount, 1);
      }
  },
  skchr_shining_2: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.finalFrame.atk * args.blackboard.atk_scale,
              this.hitCount, 4);
      }
  },
  skchr_skgoat_2: { skill_duration: common.noAttack },
  skchr_snakek: { skill_duration: common.noAttack },
  skchr_spot_1: { applyBuff: common.baseAttackTimeAddition },
  skchr_strong_2: {
      extraDamage: function(args) {
          var heal = this.damagePool[0] * args.blackboard.scale;
          return { pool: [0, 0, heal, 0, 0] };
      }
  },
  skchr_svrash_3: {   
      applyBuff: function (_, blackboard) {
          blackboard.def_scale = 1 + blackboard.def;  // 防御为负数，但是是最终乘算
          delete blackboard.def;
          return { done: false };
      }
  },
  skchr_sunbr_2: {
      skill_duration: function (args) {
          this.log.note("准备10s/不计入技能时间");
          return {
              duration: args.levelData.duration,
              attackCount: Math.ceil(args.levelData.duration / args.attackTime)
          };
      }
  },
  skchr_surtr_2: {   
      applyBuff: function (attr, blackboard) {
          if (attr.enemy.count == 1) {
              blackboard.atk_scale = blackboard["attack@surtr_s_2[critical].atk_scale"];
              this.log.note(`对单体倍率: ${blackboard.atk_scale.toFixed(1)}x`);
          }
          return { done: false };
      }
  },
  skchr_surtr_3: {   
      skill_duration: function (args) {
          var lock_time = this.buffList["tachr_350_surtr_2"]["surtr_t_2[withdraw].interval"];
          var duration = Math.sqrt(600) + lock_time;
          var attackCount = Math.ceil(duration / args.attackTime);
          this.log.write(`损失100%血量耗时: ${Math.sqrt(600).toFixed(1)}s，锁血时间: ${lock_time}s`);
          this.log.note("不治疗最大维持时间");
          return { duration, attackCount };
      },
      extraDamage: function (args) {
          return { pool: [0, 0, -args.finalFrame.maxHp-5000, 0, 0] };
      }
  },
  skchr_thorns_2: {   
      skill_duration: function (args) {
          this.log.note("以最小间隔计算反击次数");
          return {
              duration: args.levelData.duration,
              attackCount: Math.ceil(args.levelData.duration / args.blackboard.cooldown)
          };
      }
  },
  skchr_thorns_3: {   
      skill_duration: function (args) {
          if (this.options.warmup) {  // 暖机时: 正常处理
              var attackCount = Math.ceil(1800 / args.attackTime);
              var duration = attackCount * args.attackTime;
              var rotationFlags = { warmup: true };
              this.log.note("持续时间无限 (以1800s为参考计算)");
              return { attackCount, duration, rotationFlags };
          } else   // 未暖机，直接返回
              return { attackCount: args.attackCount, duration: args.duration };
      }
  },
  skchr_tiger_2: {
      extraDamage: function(args) {
          var heal = this.damagePool[1] * args.blackboard.heal_scale;
          return { pool: [0, 0, heal, 0, 0] };
      }
  },
  skchr_tknogi_2: {
      skill_duration: common.noAttack,
      extraDamage: function(args) { // HoT
          var heal = args.finalFrame.atk * args.blackboard["attack@atk_to_hp_recovery_ratio"];
          var t = this.rotation.duration;
          this.log.note("可以治疗召唤物");
          this.writeBuff(`HoT: ${heal.toFixed(1)}/s，可以治疗召唤物`);
          return { pool: [0, 0, heal*t*this.enemy.count, 0, 0] };
      }
  },
  skchr_tomimi_2: {   
      applyBuff: function (attr, blackboard) {
          blackboard.prob = blackboard["attack@tomimi_s_2.prob"] / 3;
          if (attr.crit) {
              blackboard.atk_scale = blackboard["attack@tomimi_s_2.atk_scale"];
              this.log.note(`每种状态概率: ${_num(blackboard.prob * 100)}%`);
          }
          return { done: false };
      },
      extraDamage: function(args) {
          var stun = this.critHitCount * args.blackboard["attack@tomimi_s_2.stun"];
          this.log.note(`平均眩晕敌人${stun.toFixed(1)}s`);
          this.writeBuff(`造成 ${this.critAttackCount} 次范围伤害`);
          return this.attr.calcDamagePool(args.finalFrame.atk,
              (args.enemy.count-1) * this.critHitCount, 0);
      }
  }, 
  skchr_utage_1: { skill_duration: common.noAttack },
  skchr_utage_2: {
      extraDamage: function (args) {
          var damage = -args.hpratio * args.finalFrame.maxHp;  // 自爆
          this.writeBuff(`自身伤害: ${damage.toFixed(1)}`);
          return { pool: [0, 0, damage, 0, 0] };
      }
  },
  skchr_vodfox_1: { applyBuff: function (attr, blackboard) {
          // 只提升增加的部分
          attr.buffFrame.damage_scale = 1 + (attr.buffFrame.damage_scale - 1) * blackboard.scale_delta_to_one;
          return { done: false };
      }
  },
  skchr_weedy_3: {
      extraDamage: function(args) { // 液氮炮
          var f = args.blackboard.force + (this.options.token? 1 : 0);
          var move = f*f/4 + args.blackboard.duration/4;
          var damage = args.blackboard.value * move;
          var total = damage * args.enemy.count;
          this.log.note(`位移以${move.toFixed(1)}格计算`);
          this.writeBuff(`单目标真实伤害 ${damage.toFixed(1)}`);
          return { pool: [0, 0, 0, total, 0] };
      }
  },
  skchr_whispr_2: { applyBuff: common.baseAttackTimeMultiplyNegative },
  skchr_yuki_2: {   
      applyBuff: function (_, blackboard) {
          blackboard["attack@atk_scale"] *= 3;
          this.writeBuff(`总倍率: ${blackboard["attack@atk_scale"]}x`);
          return { done: false };
      }
  }, 
  skchr_zumama_2: { applyBuff: common.baseAttackTimeAddition },
  "skcom_assist_cost[2]": { skill_duration: common.noAttack },
  "skcom_assist_cost[3]": { skill_duration: common.noAttack },
  "skcom_heal_self[1]": {
      skill_duration: function (args) {
          return { duration: args.duration, attackCount: 1 };
      },
      calcDamage: function () {
          var damage = this.attr.buffFrame.heal_scale * this.attr.finalFrame.maxHp;
          return { damage, hitDamage: damage  };
      }
  },
  "skcom_heal_self[2]": {
      skill_duration: function (args) {
          return { duration: args.duration, attackCount: 1 };
      },
      calcDamage: function () {
          var damage = this.attr.buffFrame.heal_scale * this.attr.finalFrame.maxHp;
          return { damage, hitDamage: damage  };
      }
  },
  tachr_002_amiya_1: {
      normal_duration: function (args) {
          var spRate = args.buffFrame.spRecoveryPerSec + 1;
          // 情绪吸收
          // spCost = attackCount*blackboard.sp + (attackCount*attackTime+stunDuration)*spRate
          var attackCount = Math.ceil((args.spData.spCost - args.stunDuration * spRate) /
              (args.blackboard["amiya_t_1[atk].sp"] + args.attackTime * spRate));
          var duration = attackCount * args.attackTime;
          this.log.write(`- [特殊] ${_names["tachr_002_amiya_1"]}: attack sp = ${attackCount * args.blackboard["amiya_t_1[atk].sp"]}`);
          return { duration, attackCount };
      }
  },
  tachr_010_chen_1: {
      normal_duration: function (args) {
          // 呵斥
          // spCost = attackCount + floor(attackCount * attackTime / interval)
          // => spCost / (1+attackTime/interval) < [attackCount] < (spCost+1) / (1+attackTime/interval)
          // 直接取ceil
          var attackCount = Math.ceil(args.spData.spCost / 
              (1 + args.attackTime / args.blackboard.interval));
          var sp = Math.floor(attackCount * args.attackTime / args.blackboard.interval);
          var duration = attackCount * args.attackTime;
          this.log.write(`[特殊] ${_names["tachr_010_chen_1"]}: sp = ${sp}, attack_count = ${attackCount}`);
          return {
              attackCount, duration, 
              rotationFlags: { attack: true }
          };
      }
  },
  tachr_017_huang_1: { extraDamage: common.noExtra },
  tachr_1001_amiya2_1: {   
      applyBuff: function (attr, blackboard) {
          if (this.flags.skill) {
              blackboard.atk *= this.buffList[this.skillId].talent_scale;
              blackboard.def *= this.buffList[this.skillId].talent_scale;
          }
          return { done: false };
      }
  }, 
  tachr_106_franka_1: {
      applyBuff: function (_, blackboard) {
          blackboard.edef_pene_scale = 1;
          if (this.flags.skill && this.skillId == "skchr_franka_2")
              blackboard.prob = 0.5;
          return { done: false };
      }
  },
  tachr_109_fmout_1: {
      applyBuff: function (_, blackboard) {
          if (this.skillId == "skcom_magic_rage[2]") { 
              delete blackboard.attack_speed;
              this.log.note("抽攻击卡");
          } else if (this.skillId == "skchr_fmout_2") {
              delete blackboard.atk;
              this.log.note("抽攻速卡");
          }
          return { done: false };
      }
  },
  tachr_113_cqbw_2: {
      applyBuff: function (_, __) {
          if (this.options.cond || this.flags.skill)
              return { done: false }; // 勾选触发或者技能期间生效
          else return { done: true }; 
      }
  },
  tachr_118_yuki_1: {
      applyBuff: function(attr, blackboard) {
          // 攻击间隔延长，但是是加算; 攻击力正常计算
          attr.buffFrame.baseAttackTime += blackboard.base_attack_time;
          this.writeBuff(`base_attack_time + ${blackboard.base_attack_time}s (加算)`);
          delete blackboard.base_attack_time;
          return { done: false };
      }
  },
  tachr_129_bluep_1: {    // 毒伤类
      extraDamage: function(args) {
          // 按照攻击力=poison_damage，攻击类型=法伤，计算每击伤害
          var damage = this.attr.calcHitDamage(args.blackboard.poison_damage, 1);
          var total = damage * this.rotation.duration * args.enemy.count;

          this.writeBuff(`每秒毒伤: ${damage.toFixed(1)}`);
          if (this.flags.skill && this.skillId == "skchr_bluep_1" && args.enemy.count > 1) {
              var damage2 = damage * this.buffList["skchr_bluep_1"].atk_scale;
              total = (damage + damage2) * this.rotation.duration;
              this.writeBuff(`副目标每秒毒伤: ${damage2.toFixed(1)}`);
          }
          return { pool: [0, total, 0, 0, 0] };
      }
  },
  tachr_134_ifrit_2: {
      normal_duration: function (args) {
          var spRate = args.buffFrame.spRecoveryPerSec + 1;
          var i = args.blackboard.interval;
          var isp = i * spRate + args.blackboard.sp;
          // 天赋触发次数 recoverCount >= (spCost - i) / isp
          var recoverCount = Math.ceil((args.spData.spCost - i) / isp);
          // 不足一次天赋的秒数
          var r = (args.spData.spCost - recoverCount * isp) / spRate;
          var duration = recoverCount * i + r;
          var attackCount = Math.ceil(duration / args.attackTime);
          this.log.write(`[特殊] ${_names["tachr_134_ifrit_2"]}: sp + ${recoverCount * args.blackboard.sp}`); 
          return { duration, attackCount };
      }
  },
  tachr_144_red_1: {
      applyBuff: function(attr, blackboard) {
          attr.buffFrame.minRate = blackboard.atk_scale;
          this.writeBuff(`抛光系数: ${attr.buffFrame.minRate}`);
          return { done: true };
      }
  },
  tachr_147_shining_1: {
      applyBuff: function (attr, blackboard) {
          attr.buffFrame.def += blackboard.def;
          this.writeBuff(`def + ${blackboard.def} (加算)`)
          return { done: true };
      }
  },
  tachr_155_tiger_1: {
      crit_attackCount: function (args) {
          return { critAttackCount: args.duration / 3 * args.buffFrame.prob };
      }
  },
  tachr_164_nightm_1: { 
      applyBuff: function (_, __) { // 夜魔: 仅2技能加攻
          return { done: !(this.skillId == "skchr_nightm_2") }; 
      }
  },
  tachr_174_slbell_1: { extraDamage: common.noExtra },
  tachr_180_amgoat_2: { 
      rotation_startSp: function (args) { // 乱火
          var isp = args.spData.initSp + (args.blackboard.sp_min + args.blackboard.sp_max) / 2;
          var st = args.spData.spCost - isp;
          this.log.write(`- ${_names["tachr_180_amgoat_2"]}: 平均初始技力: ${isp}，启动时间 ${st.toFixed(1)}s`);
          return { startSp: st };            
      }
  },
  tachr_181_flower_1: {
      extraDamage: function(args) { // 缓回
          this.log.note("天赋可以治疗召唤物");
          return this.attr.calcDamagePool(
              args.blackboard.atk_to_hp_recovery_ratio * args.finalFrame.atk,
              this.rotation.duration * args.enemy.count);
          }
  },
  tachr_185_frncat_1: {
      applyBuff: function (attr, blackboard) {
          attr.buffFrame.times = 1 + blackboard.prob;
          this.writeBuff(`攻击次数 x ${attr.buffFrame.times}`);
          return { done: true };
      }
  },
  tachr_187_ccheal_1: {
      applyBuff: function (attr, blackboard) {
          attr.buffFrame.def += blackboard.def;
          this.writeBuff(`def + ${blackboard.def} (加算)`)
          blackboard.def = 0;
          return { done: false };
      }
  },
  tachr_188_helage_2: {
      extraDamage: function (args) {
          var heal = (this.options.noblock ? args.hpsec : 0);
          var t = this.rotation.totalDuration;
          if (this.options.noblock)
              this.writeBuff(`每秒恢复: ${heal.toFixed(1)} hp`);
          else
              this.writeBuff("未勾选'未阻挡'选项，天赋不生效");
          return { pool: [0, 0, heal*t, 0, 0] };
      }
  },
  tachr_188_helage_trait: {
      extraDamage: function(args) { // 攻回
          return this.attr.calcDamagePool(args.blackboard.value, this.hitCount, 2);
      }
  },
  tachr_193_frostl_1: { applyBuff: common.baseAttackTimeAddition },
  tachr_2013_cerber_1: {
      extraDamage: function(args) { // 剥壳
          return this.attr.calcDamagePool(
              args.blackboard.atk_scale * args.enemy.def,
              this.hitCount, 1);
      }
  },
  tachr_204_platnm_1: { // defer: rotation计算后再判定
      applyBuff: function (_, blackboard) {
          var rate = (this.rotation.attackTime - 1) / (blackboard["attack@max_delta"] - 1);
          rate = Math.min(Math.max(rate, 0), 1); // 上下界
          blackboard.atk_scale = 1 + rate * (blackboard["attack@max_atk_scale"] - 1);
          this.writeBuff(`atk_scale = ${blackboard.atk_scale.toFixed(3)} (${(rate*100).toFixed(1)}%蓄力)`);
          return { done: false };
      }
  },
  tachr_214_kafka_1: { applyBuff: function (_, __) { return { done: !this.flags.skill }; } },
  tachr_215_mantic_1: { // defer: rotation计算后再判定
      applyBuff: function (_, blackboard) {
          return { done: !(this.rotation.attackTime >= blackboard.delay) }; 
      }
  },
  tachr_222_bpipe_1: { 
      hitCount: function () {
          var hitCount = this.rotation.attackCount * this.attr.buffFrame.times * this.attr.finalEnemy.count;
          var critHitCount = this.rotation.critAttackCount * this.critAttr.buffFrame.times * Math.min(this.enemy.count, 2);
          return {hitCount, critHitCount};
      }
  },
  tachr_222_bpipe_2: { 
      rotation_startSp: function (args) { // 乱火
          return { startSp: args.spData.spCost - args.spData.initSp - args.blackboard.sp };            
      }
  },
  tachr_225_haak_1: {   
      applyBuff: function (_, blackboard) {
          blackboard.prob = 0.25;
          return { done: false };
      },
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.hpratio * args.finalFrame.maxHp * this.critAttr.buffFrame.heal_scale,
              this.critHitCount, 2);
      }
  },
  tachr_225_haak_trait: {
      extraDamage: function (args) {
          var damage = -args.hpratio * args.finalFrame.maxHp;  // 自爆
          this.writeBuff(`自身伤害: ${damage.toFixed(1)}/s`);
          return { pool: [0, 0, damage * this.rotation.duration, 0, 0] };
      }
  },
  tachr_226_hmau_1: {
      applyBuff: function (_, blackboard) {
          if (!this.options.cond) delete blackboard.heal_scale;
          return { done: false };
      }
  },
  tachr_254_vodfox_1: { extraDamage: common.noExtra },
  tachr_265_sophia_1: {   
      applyBuff: function (attr, blackboard) {
          if (this.flags.skill) {
              var ts = this.buffList[this.skillId].talent_scale;
              if (this.skillId == "skchr_sophia_1") {
                  blackboard.def = blackboard["sophia_t_1_less.def"] * ts;
                  blackboard.attack_speed = blackboard["sophia_t_1_less.attack_speed"] * ts;
                  this.log.note("1技能/自身享受一半增益");
              } else if (this.skillId == "skchr_sophia_2") {
                  blackboard.def *= ts;
                  blackboard.attack_speed *= ts;
                  blackboard.max_target = attr.basicFrame.blockCnt;
                  this.log.note("2技能/自身享受全部增益");
              }
          } else {
              delete blackboard.def;
              delete blackboard.attack_speed;
              this.writeBuff("非技能期间，天赋对自身无效");
          }
          return { done: false };
      }
  }, 
  tachr_279_excu_trait: {
      applyBuff: function (_, __) {
          if (this.options.cond || 
              (this.flags.skill && this.skillId == "skchr_excu_1"))
              return { done: false }; // 勾选触发 或者1技能期间生效
          else
              return { done: true };
      }
  },
  tachr_290_vigna_1: {
      applyBuff: function (attr, blackboard) {
          blackboard.prob = this.flags.skill ? blackboard.prob2 : blackboard.prob1;
          return { done: false };
      }
  },
  tachr_291_aglina_2: {
      extraDamage: function (args) {
          var heal = (this.flags.skill ? 0 : args.hpsec);
          var t = this.rotation.totalDuration;
          if (this.flags.skill)
              this.writeBuff("技能期间天赋不生效");
          else 
              this.writeBuff(`每秒恢复: ${heal.toFixed(1)} hp`);
          
          return { pool: [0, 0, heal*t, 0, 0] };
      }
  },
  tachr_293_thorns_1: {
      extraDamage: function(args) { // 毒伤类
          var damage = (this.options.thorns_ranged ? args.blackboard["damage[ranged]"]: args.blackboard["damage[normal]"]);
          damage = this.attr.calcHitDamage(damage, 1);
          var total = damage * this.rotation.duration * args.enemy.count;

          this.writeBuff(`每秒毒伤: ${damage.toFixed(1)}`);
          return { pool: [0, total, 0, 0, 0] };
      }
  },
  tachr_293_thorns_2: {
      extraDamage: function (args) {
          var heal = 0;
          var t = this.rotation.totalDuration - 2;
          if (this.flags.skill && this.skillId == "skchr_thorns_2") {
              heal = args.hpratiosec * args.finalFrame.maxHp;
              this.writeBuff(`每秒恢复: ${heal.toFixed(1)}, 持续${t}s (-2s)`);
          }
          return { pool: [0, 0, heal*t, 0, 0] };
      }
  },
  tachr_301_cutter_1: {
      normal_duration: function (args) {
          let p = args.blackboard.prob;
          var attackCount = 0;
          if (this.skillId == "skchr_cutter_1") {
            attackCount = Math.ceil((args.spData.spCost - p) / (1+p*2));
            this.log.write(`[特殊] ${_names["skchr_cutter_1"]}: 额外判定1次天赋`);   
            this.log.write(`[特殊] ${_names["tachr_301_cutter_1"]}: sp = ${((attackCount*2+1) * p).toFixed(2)}, attack_count = ${attackCount}`);
          } else {
            attackCount = Math.ceil(args.spData.spCost / (1+p*2));
            this.log.write(`[特殊] ${_names["tachr_301_cutter_1"]}: sp = ${(attackCount*2*p).toFixed(2)}, attack_count = ${attackCount}`);
          }
          return {
              attackCount,
              duration: attackCount * args.attackTime,
              rotationFlags: { attack: true }
          };
      }
  },
  tachr_311_mudrok_1: {
      extraDamage: function (args) {
          return this.attr.calcDamagePool(
              args.hpratio * args.finalFrame.maxHp,
              this.rotation.totalDuration / args.blackboard.interval, 2);
      }
  },
  tachr_337_utage_trait: {
      extraDamage: function(args) { // 攻回
          return this.attr.calcDamagePool(args.blackboard.value, this.hitCount, 2);
      }
  },
  tachr_340_shwaz_1: {
      applyBuff: function (attr, blackboard) {
          if (this.flags.skill)
              blackboard.prob = this.buffList[this.skillId]["talent@prob"];
          blackboard.edef_scale = blackboard.def;
          delete blackboard.def;
          return { done: false };
      }
  },
  tachr_343_tknogi_1: { extraDamage: common.noExtra },
  tachr_344_beewax_1: {
      extraDamage: function (args) {
          var heal = 0;
          if (!this.flags.skill) {
              heal = args.hpratiosec * args.finalFrame.maxHp;
              this.writeBuff(`每秒恢复: ${heal.toFixed(1)}`);
          } else this.writeBuff("技能期间该天赋无效");
          return { pool: [0, 0, heal * this.rotation.totalDuration, 0, 0] };
      }
  },
  tachr_344_beewax_trait: { // disable when skill
      applyBuff: function (_, __) { return { done: this.flags.skill }; }
  },
  tachr_346_aosta_1: {
      extraDamage: function(args) { // 毒伤类
          var damage = this.attr.calcHitDamage(args.finalFrame.atk_noscale * args.blackboard.atk_scale, 1);
          if (this.skillId == "skchr_aosta_2" && this.flags.skill) damage *= this.buffList["skchr_aosta_2"].talent_scale;
          var total = damage * this.rotation.duration * args.enemy.count;

          this.writeBuff(`每秒毒伤: ${damage.toFixed(1)}`);
          return { pool: [0, total, 0, 0, 0] };
      }
  },
  tachr_358_lisa_2: {
      applyBuff: function (_, blackboard) {
          if (this.flags.skill && this.skillId == "skchr_lisa_3")
              delete blackboard.damage_scale; // 治疗不计易伤
          return { done: false };
      }
  },
  tachr_366_acdrop_1: {
      applyBuff: function (attr, blackboard) {
          attr.buffFrame.minRate = this.options.cond ? blackboard.atk_scale_2 : blackboard.atk_scale;
          this.writeBuff(`抛光系数: ${attr.buffFrame.minRate}`);
          return { done: true };
      }
  },
  tachr_367_swllow_1: {
      applyBuff: function (attr, blackboard) {
          if (!attr.crit) delete blackboard.atk_scale;
          this.flags.has_crit = true;
          return { done: false };
      }
  },
  tachr_373_lionhd_1: { // applyEnemy才生效
      applyBuff: function (attr, blackboard) {
          blackboard.atk *= Math.min(attr.enemy.count, blackboard.max_valid_stack_cnt);
          return { done: false };
      }
  },
  tachr_388_mint_trait: {
      applyBuff: function (_, __) { return { done: this.flags.skill }; }
  },
  tachr_388_mint_1: {
      applyBuff: function (_, __) { return { done: this.flags.skill }; }
  },
  tachr_391_rosmon_trait: {
      extraDamage: function(args) { // 余震
          var n = 1;
          if (this.flags.skill && this.skillId == "skchr_rosmon_2") n=3;
          this.writeBuff(`余震次数 ${n}`);

          return this.attr.calcDamagePool(
              args.finalFrame.atk_noscale * args.blackboard["attack@append_atk_scale"],
              this.hitCount * n, 0);
      }
  },
  tachr_400_weedy_2: {
      normal_duration: function (args) {
          if (this.options.cannon) {
              var spRate = args.buffFrame.spRecoveryPerSec + 1;
              var m = Math.floor(args.spData.spCost / 55);
              var a = m * 6 + m * 55 * spRate; // 前m个水炮充能+自然恢复的sp量
              let b = 6 + 20 * spRate; // 最后一个水炮持续期间最多恢复的sp
              let c = 6;  // 最后一个水炮充的sp
              let r = 0; // 计算还需要多少时间充满
              if (a + b > args.spData.spCost) { // 技能会在b期间蓄好
                let y = Math.floor((args.spData.spCost - a) / (3 * spRate + 1.0));
                let z = (args.spData.spCost - a - y) / spRate - y*3;
                r = 3*y+z;
                c = Math.floor(r/3);
              } else {
                r = (args.spData.spCost - a - b) / spRate + 20;
              }
              var duration = m*55+r;
              var attackCount = Math.ceil(duration / args.attackTime);
              this.log.write(`[特殊] ${_names["tachr_400_weedy_2"]}: 使用${m+1}个水炮, 充能sp=${m * 6 + c}`);
              return { duration, attackCount };  
          } else
              return { duration: args.duration, attackCount: args.attackCount };
      }
  },
  tachr_405_absin_1: { extraDamage: common.noExtra },
  tachr_411_tomimi_1: { // disable when !skill
      applyBuff: function (_, __) { return { done: !this.flags.skill }; }
  },
  tachr_416_zumama_1: { extraDamage: common.noExtra },
  tachr_436_whispr_1: {
      extraDamage: function(args) { // 缓回
          var heal = args.blackboard.atk_to_hp_recovery_ratio * args.finalFrame.atk;
          if (this.flags.skill && this.skillId == "skchr_whispr_2")
              heal *= this.buffList["skchr_whispr_2"].talent_scale;
          this.writeBuff(`天赋每秒回复: ${heal.toFixed(1)}, 可以治疗召唤物`);

          var duration = this.rotation.duration;
          var total = heal * duration * this.enemy.count; // 勾选触发天赋时对所有目标（而非攻击目标）生效
          if (!this.options.cond) {// 不选触发天赋时，只计算治疗导致的持续回血
              var effectTime = this.buffList["skchr_whispr_1"]["status_resistance[limit]"];
              if (this.skillId == "skchr_whispr_2")
                  effectTime = Math.min(
                      this.buffList["skchr_whispr_2"]["attack@status_resistance[limit]"],
                      this.rotation.attackTime);
              duration = this.flags.skill ? effectTime * this.rotation.attackCount : 0;
              this.log.note(`缓回覆盖率: ${duration.toFixed(1)}s/${this.rotation.duration}s`);
              total = heal * duration * args.enemy.count;
          } else this.log.note("假设天赋一直生效");
          this.log.note("天赋可以治疗召唤物");
          return { pool: [0, 0, total, 0, 0] };
      }
  },
  tachr_440_pinecn_trait: {
      applyBuff: function (_, __) {
          if (this.options.cond || 
              (this.flags.skill && this.skillId == "skchr_pinecn_2"))
              return { done: false }; // 勾选触发 或者2技能期间生效
          else
              return { done: true };
      }
  }
};

export { CommonActions, Actions };
