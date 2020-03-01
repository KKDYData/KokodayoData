import { spine } from './spine-webgl'
import { skel2Json } from './skel2Json.js'

class Spine {
  constructor(cantainer) {
    // this.replaceBuild = replaceBuild
    this.canvas = cantainer
    this.gl = new spine.webgl.ManagedWebGLRenderingContext(this.canvas)
    this.batcher = new spine.webgl.PolygonBatcher(this.gl)
    this.mvp = new spine.webgl.Matrix4()
    this.lastFrameTime = Date.now() / 1000
    this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl)
    this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl)
    this.assetManager = new spine.webgl.AssetManager(this.gl)
    this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1)
    this.curAnimate = 0
    this.skeletons = {}
  }
  async init(opt) {
    if (!this.gl) {
      alert('您的浏览器不支持webgl，没办法展示部分内容')
      return
    }

    const { id, text, texture, skelBinary } = opt
    this.id = id
    // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
    this.assetManager.loadLocalText(text)
    this.assetManager.loadLocalTexture(texture)
    // requestAnimationFrame(() => this.load());
    return this.load(skelBinary)
  }

  async  load(data) {
    const skin = 'default'
    const atlas = new spine.TextureAtlas(this.assetManager.get('localText')
      , el => this.assetManager.get('localTexture'))
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    const skeletonJson = new spine.SkeletonJson(atlasLoader)

    const json = skel2Json(data)
    this.animates = Object.keys(json.animations)
    this.skins = Object.keys(json.skins)

    const skeleton = new spine.Skeleton(skeletonJson.readSkeletonData(json))
    const bounds = this.calculateBounds(skeleton)
    const state = new spine.AnimationState(new spine.AnimationStateData(skeleton.data))

    skeleton.setSkinByName(skin)
    console.log(this.animates[this.curAnimate])
    state.setAnimation(0, this.animates[this.curAnimate], true)

    this.skeletons[this.id] = { skeleton, state, bounds, premultipliedAlpha: true }
    requestAnimationFrame(() => this.render())
    return this.skeletons[this.id]
  }


  calculateBounds(skeleton) {
    skeleton.setToSetupPose()
    skeleton.updateWorldTransform()
    const offset = new spine.Vector2()
    const size = new spine.Vector2()
    skeleton.getBounds(offset, size, [])
    return { offset: offset, size: size }
  }


  render() {
    const now = Date.now() / 1000
    var delta = now - this.lastFrameTime
    this.lastFrameTime = now
    const gl = this.gl,
      skeletons = this.skeletons,
      batcher = this.batcher,
      shader = this.shader,
      skeletonRenderer = this.skeletonRenderer

    // Update the MVP matrix to adjust for canvas size changes
    this.resize(skeletons[this.id].bounds)
    gl.gl.clearColor(0, 0, 0, 0)
    gl.gl.clear(gl.gl.COLOR_BUFFER_BIT)

    // Apply the animation state based on the delta time.
    const { state, skeleton, premultipliedAlpha } = skeletons[this.id]

    state.update(delta)
    state.apply(skeleton)
    skeleton.updateWorldTransform()

    // Bind the shader and set the texture and model-view-projection matrix.
    shader.bind()
    shader.setUniformi(spine.webgl.Shader.SAMPLER, 0)
    shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values)

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader)
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha
    skeletonRenderer.draw(batcher, skeleton)
    batcher.end()
    shader.unbind()

    requestAnimationFrame(() => this.render())
  }

  resize() {
    const canvas = this.canvas
    var w = canvas.clientWidth
    var h = canvas.clientHeight
    if (canvas.width != w || canvas.height != h) {
      canvas.width = w
      canvas.height = h
    }

    // magic
    var centerX = 0
    var centerY = 200//bounds.offset.y + bounds.size.y / 2 * 1;
    var scaleX = 200 / canvas.width
    var scaleY = 400 / canvas.height
    var scale = Math.max(scaleX, scaleY) * 2
    if (scale < 1) scale = 1
    var width = canvas.width * scale
    var height = canvas.height * scale
    this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height)
    this.gl.gl.viewport(0, 0, canvas.width, canvas.height)
  }

}

export {
  Spine
}

