<template>
  <div>
    <canvas :style="{width: width, height}" ref="container"></canvas>
    <div>
      <el-button size="mini" @click="changeAnimate(false)" class="el-icon-back"></el-button>
      <span
        style="display: inline-block; width: 100px; text-align: center"
      >{{curAnimate}} | {{animates[curAnimate]}}</span>
      <el-button size="mini" @click="changeAnimate(true)" class="el-icon-right"></el-button>
    </div>
  </div>
</template>

<script>

import { Button } from 'element-ui';
import Binary from '../utils/Spine/test';
import spine from '../utils/Spine/spine-webgl';

import Vue from 'vue';
Vue.use(Button);

let atlas, atlasLoader, animationStateData;
function calculateBounds(skeleton) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();
  var offset = new spine.Vector2();
  var size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);
  return { offset: offset, size: size };
}

function resize(bounds, canvas, mvp, gl) {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  if (canvas.width != w || canvas.height != h) {
    canvas.width = w;
    canvas.height = h;
  }

  // magic
  var centerX = (bounds.offset.x + bounds.size.x / 2) * 0.25;
  var centerY = bounds.offset.y + bounds.size.y / 2;
  var scaleX = bounds.size.x / canvas.width;
  var scaleY = bounds.size.y / canvas.height;
  var scale = Math.max(scaleX, scaleY) * 1.45;
  if (scale < 1) scale = 1;
  var width = canvas.width * scale;
  var height = canvas.height * scale;

  mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
  gl.viewport(0, 0, canvas.width, canvas.height);
}
// char_282_catap1
// char_282_catap'
// build_char_282_catap
// char_291_aglina
// build_char_291_aglina

export default {
  mounted() {
    this.init();
  },
  props: {
    width: {
      default: '400px',
      type: String,
    },
    height: {
      default: '400px',
      type: String
    }
  },
  data() {
    return {
      animates: [],
      curAnimate: 0,
      skeletons: {},
      skins: [],
      activeSkeleton: 'build_char_291_aglina',
    };
  },
  methods: {
    changeAnimate(t) {
      this.curAnimate = t ? this.curAnimate + 1 : this.curAnimate - 1;
      if (this.curAnimate >= this.animates.length) this.curAnimate = 0;
      else if (this.curAnimate < 0) this.curAnimate = this.animates.length - 1;

      var state = this.skeletons[this.activeSkeleton].state;
      var skeleton = this.skeletons[this.activeSkeleton].skeleton;
      console.log(this.animates[this.curAnimate], this.curAnimate);
      skeleton.setToSetupPose();
      state.setAnimation(0, this.animates[this.curAnimate], true);
    },
    init() {
      var lastFrameTime = Date.now() / 1000;
      var canvas = this.$refs.container;
      var shader;
      var batcher;
      var gl;
      var mvp = new spine.webgl.Matrix4();
      var assetManager;
      var skeletonRenderer;
      var skeletons = this.skeletons;

      var id = this.activeSkeleton;
      var activeSkeleton = id;
      function init() {

        // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
        // loading textures. That is handled separately by PolygonBatcher.
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var config = { alpha: false };
        gl = canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config);
        if (!gl) {
          alert('WebGL is unavailable.');
          return;
        }

        // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
        shader = spine.webgl.Shader.newTwoColoredTextured(gl);
        batcher = new spine.webgl.PolygonBatcher(gl);
        mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
        skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
        assetManager = new spine.webgl.AssetManager(gl);

        assetManager.loadText(`temp/${id}.atlas`);
        assetManager.loadTexture(`temp/${id}.png`);
        requestAnimationFrame(load);
      }

      async function load() {
        // Wait until the AssetManager has loaded all resources, then load the skeletons.
        if (assetManager.isLoadingComplete()) {
          skeletons[id] = await loadSkeleton(id, 'Default', false);
          requestAnimationFrame(render);
        } else {
          requestAnimationFrame(load);
        }
      }

      const loadSkeleton = async (name, initialAnimation, premultipliedAlpha, skin) => {
        if (skin === undefined) skin = 'default';

        // Load the texture atlas using name.atlas and name.png from the AssetManager.
        // The function passed to TextureAtlas is used to resolve relative paths.
        atlas = new spine.TextureAtlas(assetManager.get('temp/' + name + '.atlas'), function (path) {
          return assetManager.get('temp/' + path);
        });

        // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
        atlasLoader = new spine.AtlasAttachmentLoader(atlas);

        // Create a SkeletonJson instance for parsing the .json file.
        var skeletonJson = new spine.SkeletonJson(atlasLoader);

        const data = await fetch(`temp/${id}.skel`)
          .then(res => {
            return res.arrayBuffer();
          });

        let skel_bin = new Binary();
        skel_bin.data = new Uint8Array(data);
        skel_bin.initJson();
        this.animates = Object.keys(skel_bin.json.animations);
        this.skins = Object.keys(skel_bin.json.skins);


        // Set the scale to apply during parsing, parse the file, and create a new skeleton.
        var skeletonData = skeletonJson.readSkeletonData(skel_bin.json);

        // var skeletonData = skeletonJson.readSkeletonData(assetManager.get("assets/" + name + ".json"));
        var skeleton = new spine.Skeleton(skeletonData);
        skeleton.setSkinByName(skin);
        var bounds = calculateBounds(skeleton);

        // Create an AnimationState, and set the initial animation in looping mode.
        animationStateData = new spine.AnimationStateData(skeleton.data);
        var animationState = new spine.AnimationState(animationStateData);

        animationState.setAnimation(0, this.animates[this.curAnimate], true);

        // Pack everything up and return to caller.
        return { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: premultipliedAlpha };
      };




      function render() {
        var now = Date.now() / 1000;
        var delta = now - lastFrameTime;
        lastFrameTime = now;

        // Update the MVP matrix to adjust for canvas size changes
        resize(skeletons[activeSkeleton].bounds, canvas, mvp, gl);

        gl.clearColor(255, 255, 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Apply the animation state based on the delta time.
        var state = skeletons[activeSkeleton].state;
        var skeleton = skeletons[activeSkeleton].skeleton;
        var premultipliedAlpha = skeletons[activeSkeleton].premultipliedAlpha;
        state.update(delta);
        state.apply(skeleton);
        skeleton.updateWorldTransform();

        // Bind the shader and set the texture and model-view-projection matrix.
        shader.bind();
        shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
        shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

        // Start the batch and tell the SkeletonRenderer to render the active skeleton.
        batcher.begin(shader);
        skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
        skeletonRenderer.draw(batcher, skeleton);
        batcher.end();
        shader.unbind();

        requestAnimationFrame(render);
      }



      init();
    }
  }

};
</script>
