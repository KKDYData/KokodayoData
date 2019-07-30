<template>
  <el-popover
        :trigger="isHover"
        :width="short? shortWidth : 700"
        :open-delay="500"
        @show="openDetails(key)"
        @hide="currentData = null"
        :popper-options="{Defaults:{positionFixed:true}}"
        :visible-arrow="!short"
      >
        <div slot="reference" class="enemy-container">
          <div class="enemy-img-container">
            <div class="enemy-index-container">
              <span>{{enemy.enemyIndex}}</span>
            </div>
            <el-image :src="path +  key + '.png?x-oss-process=style/jpg-test'" lazy></el-image>
            <div>
              <span>{{enemy.name}}</span>
            </div>
          </div>
        </div>
        <div v-if="showKey === key" class="enemy-content-container">
          <el-button @click="$el.click()" type="danger" size="mini" class="close-button">
            <i class="el-icon-close"></i>
          </el-button>
          <div style="display: flex">
            <div class="enemy-img-container">
              <el-image :src="path +  key + '.png?x-oss-process=style/jpg-test'"></el-image>
            </div>
            <div>
              <div style="display: flex">
                <div class="enemy-details-type-index-container">
                  <span>{{enemy.enemyIndex}}</span>
                </div>
                <div>
                  <h1 style="margin: 0">{{enemy.name}}</h1>
                  <h3 style="margin: 0">{{enemy.enemyRace}}</h3>
                </div>
              </div>
              <div v-if="short" style="margin-left: 10px">
                <p>
                  <span>攻击方式</span>
                  <span style="color: #000">{{enemy.attackType}}</span>
                </p>
              </div>
              <div v-if="!short" class="enemy-status-container">
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'nj_optimized.png'"></el-image>
                      <div class="enemy-status-abc-title-text">耐久</div>
                    </div>
                  </div>
                  <h1>{{enemy.endure}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div class="enemy-status-abc-title" style="margin: 0">
                    <el-image style="width: 13px; " :src="smallPicPath +  'gj_optimized.png'"></el-image>
                    <div class="enemy-status-abc-title-text">攻击力</div>
                  </div>
                  <h1>{{enemy.attack}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'fy_optimized.png'"></el-image>
                      <div class="enemy-status-abc-title-text">防御力</div>
                    </div>
                  </div>
                  <h1>{{enemy.defence}}</h1>
                </div>
                <div class="enemy-status-abc-container">
                  <div>
                    <div class="enemy-status-abc-title" style="margin: 0">
                      <el-image style="width: 13px; " :src="smallPicPath +  'fk_optimized.png'"></el-image>
                      <div class="enemy-status-abc-title-text">法术抗性</div>
                    </div>
                  </div>
                  <h1>{{enemy.resistance}}</h1>
                </div>
              </div>
            </div>
          </div>
          <div v-if="short" class="enemy-status-container">
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image
                    style="width: 13px; "
                    :src="smallPicPath +  'nj_optimized.png?x-oss-process=style/jpg-test'"
                  ></el-image>
                  <div class="enemy-status-abc-title-text">耐久</div>
                </div>
              </div>
              <h1>{{enemy.endure}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div class="enemy-status-abc-title" style="margin: 0">
                <el-image
                  style="width: 13px; "
                  :src="smallPicPath +  'gj_optimized.png?x-oss-process=style/jpg-test'"
                ></el-image>
                <div class="enemy-status-abc-title-text">攻击力</div>
              </div>
              <h1>{{enemy.attack}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image
                    style="width: 13px; "
                    :src="smallPicPath +  'fy_optimized.png?x-oss-process=style/jpg-test'"
                  ></el-image>
                  <div class="enemy-status-abc-title-text">防御力</div>
                </div>
              </div>
              <h1>{{enemy.defence}}</h1>
            </div>
            <div class="enemy-status-abc-container">
              <div>
                <div class="enemy-status-abc-title" style="margin: 0">
                  <el-image
                    style="width: 13px; "
                    :src="smallPicPath +  'fk_optimized.png?x-oss-process=style/jpg-test'"
                  ></el-image>
                  <div class="enemy-status-abc-title-text">法术抗性</div>
                </div>
              </div>
              <h1>{{enemy.resistance}}</h1>
            </div>
          </div>
          <div v-if="!short">
            <p>
              <span>攻击方式</span>
              <span style="color: #000">{{enemy.attackType}}</span>
            </p>
          </div>

          <div>
            <div>
              <b>描述</b>
            </div>
            <p>{{enemy.description}}</p>
          </div>

          <div>
            <enemy-status
              v-loading="key !== 'enemy_1503_talula' && !currentData"
              :data="currentData"
              :short="short"
              :key-name="key"
              :appear-map="appearMap"
            >
              <div v-if="enemy.ability">
                <div>
                  <b>能力</b>
                </div>
                <p>{{enemy.ability}}</p>
              </div>
            </enemy-status>
          </div>
        </div>
      </el-popover>
</template>
