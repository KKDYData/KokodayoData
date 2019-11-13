import SpineWebGl from './spine-webgl';
import skel2Json from './skel2Json';
const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
};
class Spine {
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
  urls

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
  async init({ id, path }) {
    this.id = id;
    this.path = path;
    // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
    // loading textures. That is handled separately by PolygonBatcher.
    if (!this.gl) {
      alert('WebGL is unavailable.');
      return;
    }
    // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
    this.assetManager.loadText(path + id + '.atlas');
    this.assetManager.loadTexture(path + id + '.png');
    const data = await fetch(path + id + '.skel')
      .then(res => res.arrayBuffer());
    // requestAnimationFrame(() => this.load());
    return this.load(data);
  }

  async  load(data) {
    // Wait until the AssetManager has loaded all resources, then load the skeletons.
    while (!this.assetManager.isLoadingComplete()) {
      await sleep(100);
    }
    this.skeletons[this.id] = await this.loadSkeleton(data);
    requestAnimationFrame(() => this.render());
    return this.skeletons[decodeURIComponent(this.id)];
  }


  async  loadSkeleton(binary) {
    const skin = 'default';

    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    const { path, id } = this;
    const _atlas = path + id + '.atlas';
    const atlas = new SpineWebGl.TextureAtlas(this.assetManager.get(_atlas)
      , el => this.assetManager.get(path + encodeURIComponent(el).replace('build_', '')));
    const atlasLoader = new SpineWebGl.AtlasAttachmentLoader(atlas);
    const skeletonJson = new SpineWebGl.SkeletonJson(atlasLoader);

    const json = skel2Json(binary);
    this.animates = Object.keys(json.animations);
    this.skins = Object.keys(json.skins);

    // Create an AnimationState, and set the initial animation in looping mode.
    const skeleton = new SpineWebGl.Skeleton(skeletonJson.readSkeletonData(json));
    const bounds = this.calculateBounds(skeleton);
    const state = new SpineWebGl.AnimationState(new SpineWebGl.AnimationStateData(skeleton.data));

    skeleton.setSkinByName(skin);
    state.setAnimation(0, this.animates[this.curAnimate], true);

    return { skeleton, state, bounds, premultipliedAlpha: true };
  }
  calculateBounds(skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    const offset = new SpineWebGl.Vector2();
    const size = new SpineWebGl.Vector2();
    skeleton.getBounds(offset, size, []);
    return { offset: offset, size: size };
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

    gl.clearColor(0, 0, 0, 0);
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

  resize(bounds, canvas, mvp, gl) {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (canvas.width != w || canvas.height != h) {
      canvas.width = w;
      canvas.height = h;
    }

    // let { x: bX, y: bY } = bounds.size;

    // const checkInfinity = x => Math.abs(x) === Infinity;

    // bX = checkInfinity(bX) ? 200 : bX;
    // bY = checkInfinity(bY) ? 400 : bY;

    // magic
    var centerX = 0;
    var centerY = 200;//bounds.offset.y + bounds.size.y / 2 * 1;
    var scaleX = 200 / canvas.width;
    var scaleY = 400 / canvas.height;
    var scale = Math.max(scaleX, scaleY) * 2;
    if (scale < 1) scale = 1;
    var width = canvas.width * scale;
    var height = canvas.height * scale;

    mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

}

export default Spine;
