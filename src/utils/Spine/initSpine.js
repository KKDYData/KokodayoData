
import SpineWebGl from './spine-webgl';
import Binary from './skel2Json';
const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
};
class Spine {
  animationStateData
  lastFrameTime
  canvas
  shader
  batcher
  gl
  mvp
  assetManager;
  skeletonRenderer;
  skeletons = {}
  id
  curAnimate = 0
  animates
  calculateBounds(skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const offset = new SpineWebGl.Vector2();
    const size = new SpineWebGl.Vector2();
    skeleton.getBounds(offset, size, []);
    return { offset: offset, size: size };
  }
  constructor(cantainer) {
    this.canvas = cantainer;
    const config = { alpha: true };
    this.gl = this.canvas.getContext('webgl', config) || this.canvas.getContext('experimental-webgl', config);
    this.batcher = new SpineWebGl.webgl.PolygonBatcher(this.gl);
    this.mvp = new SpineWebGl.webgl.Matrix4();
    this.lastFrameTime = Date.now() / 1000;
    this.shader = SpineWebGl.webgl.Shader.newTwoColoredTextured(this.gl);
    this.skeletonRenderer = new SpineWebGl.webgl.SkeletonRenderer(this.gl);
    this.assetManager = new SpineWebGl.webgl.AssetManager(this.gl);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1);
  }
  init(id) {
    this.id = id;

    // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
    // loading textures. That is handled separately by PolygonBatcher.
    if (!this.gl) {
      alert('WebGL is unavailable.');
      return;
    }
    // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
    this.assetManager.loadText(`temp/${id}.atlas`);
    this.assetManager.loadTexture(`temp/${id}.png`);
    // requestAnimationFrame(() => this.load());
    return this.load();
  }
  resize(bounds, canvas, mvp, gl) {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (canvas.width != w || canvas.height != h) {
      canvas.width = w;
      canvas.height = h;
    }

    // magic
    var centerX = 0;//(bounds.offset.x + bounds.size.x / 2) * 0;
    var centerY = bounds.offset.y + bounds.size.y / 2 * 0.75;
    var scaleX = bounds.size.x / canvas.width;
    var scaleY = bounds.size.y / canvas.height;
    var scale = Math.max(scaleX, scaleY) * 1.1;
    if (scale < 1) scale = 1;
    var width = canvas.width * scale;
    var height = canvas.height * scale;

    mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  async  load() {
    // Wait until the AssetManager has loaded all resources, then load the skeletons.
    const data = await fetch(`temp/${this.id}.skel`)
      .then(res => res.arrayBuffer());

    while (!this.assetManager.isLoadingComplete()) {
      await sleep(100);
    }
    this.skeletons[this.id] = await this.loadSkeleton(this.id, data);
    requestAnimationFrame(() => this.render());
    return this.skeletons[this.id];
  }

  async  loadSkeleton(id, binary) {
    const skin = 'default';

    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    const atlas = new SpineWebGl.TextureAtlas(this.assetManager.get('temp/' + id + '.atlas')
      , path => this.assetManager.get('temp/' + path));
    const atlasLoader = new SpineWebGl.AtlasAttachmentLoader(atlas);
    const skeletonJson = new SpineWebGl.SkeletonJson(atlasLoader);

    const skel_bin = new Binary();
    skel_bin.data = new Uint8Array(binary);
    skel_bin.initJson();

    this.animates = Object.keys(skel_bin.json.animations);
    this.skins = Object.keys(skel_bin.json.skins);

    // Create an AnimationState, and set the initial animation in looping mode.
    const skeleton = new SpineWebGl.Skeleton(skeletonJson.readSkeletonData(skel_bin.json));
    const bounds = this.calculateBounds(skeleton);
    const state = new SpineWebGl.AnimationState(new SpineWebGl.AnimationStateData(skeleton.data));

    skeleton.setSkinByName(skin);
    state.setAnimation(0, this.animates[this.curAnimate], true);

    return { skeleton, state, bounds, premultipliedAlpha: false };
  }
  render() {
    const now = Date.now() / 1000;
    var delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    const gl = this.gl,
      skeletons = this.skeletons,
      batcher = this.batcher,
      shader = this.shader,
      skeletonRenderer = this.skeletonRenderer;

    // Update the MVP matrix to adjust for canvas size changes
    this.resize(this.skeletons[this.id].bounds, this.canvas, this.mvp, gl);

    gl.clearColor(255, 255, 255, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Apply the animation state based on the delta time.
    const { state, skeleton, premultipliedAlpha } = skeletons[this.id];

    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    shader.bind();
    shader.setUniformi(SpineWebGl.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(SpineWebGl.webgl.Shader.MVP_MATRIX, this.mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
    batcher.end();
    shader.unbind();

    requestAnimationFrame(() => this.render());
  }

}

export default Spine;
