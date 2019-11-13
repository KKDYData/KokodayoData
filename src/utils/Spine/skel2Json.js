
const BlendMode = ['normal', 'additive', 'multiply', 'screen'];
const TransformMode = ['normal', 'onlyTranslation', 'noRotationOrReflection', 'noScale', 'noScaleOrReflection'];
const PositionMode = ['fixed', 'percent'];
const SpacingMode = ['length', 'fixed', 'percent'];
const RotateMode = ['tangent', 'chain', 'chainScale'];
const AttachmentType = ['region', 'boundingbox', 'mesh', 'linkedmesh', 'path', 'point', 'clipping'];


function SkeletonBinary() {
  this.data = null;
  this.scale = 1;
  this.json = {};
  this.nextNum = 0;
  this.chars = null;
}

SkeletonBinary.prototype = {
  data: null,
  scale: 0x1,
  json: {},
  nextNum: 0x0,
  chars: null,
  readByte: function () {
    return this.nextNum < this.data.length ? this.data[this.nextNum++] : null;
  },
  readBoolean: function () {
    return this.readByte() != 0x0;
  },
  readShort: function () {
    return this.readByte() << 0x8 | this.readByte();
  },
  readInt: function (optimizePositive) {
    if (typeof optimizePositive === 'undefined') {
      return this.readByte() << 0x18 | this.readByte() << 0x10 | this.readByte() << 0x8 | this.readByte();
    }
    let b = this.readByte();
    let result = b & 0x7f;
    if ((b & 0x80) != 0x0) {
      b = this.readByte();
      result |= (b & 0x7f) << 0x7;
      if ((b & 0x80) != 0x0) {
        b = this.readByte();
        result |= (b & 0x7f) << 0xe;
        if ((b & 0x80) != 0x0) {
          b = this.readByte();
          result |= (b & 0x7f) << 0x15;
          if ((b & 0x80) != 0x0) {
            b = this.readByte();
            result |= (b & 0x7f) << 0x1c;
          }
        }
      }
    }
    return optimizePositive ? result : result >> 0x1 ^ -(result & 0x1);
  },
  bytes2Float32: function (bytes) {
    let sign = bytes & 0x80000000 ? -0x1 : 0x1;
    let exponent = (bytes >> 0x17 & 0xff) - 0x7f;
    let significand = bytes & ~(-0x1 << 0x17);
    if (exponent == 0x80)
      return sign * (significand ? Number.NaN : Number.POSITIVE_INFINITY);
    if (exponent == -0x7f) {
      if (significand == 0x0)
        return sign * 0x0;
      exponent = -0x7e;
      significand /= 0x1 << 0x16;
    } else
      significand = (significand | 0x1 << 0x17) / (0x1 << 0x17);
    return sign * significand * Math.pow(0x2, exponent);
  },
  readFloat: function () {
    return this.bytes2Float32((this.readByte() << 0x18) + (this.readByte() << 0x10) + (this.readByte() << 0x8) + (this.readByte() << 0x0));
  },
  readVertices: function (vertexCount) {
    let verticesLength = vertexCount << 0x1;
    if (!this.readBoolean()) {
      return this.readFloatArray(verticesLength, this.scale);
    }
    let bonesArray = new Array();
    for (let i = 0x0; i < vertexCount; i++) {
      let dataLength = this.readInt(!![]);
      bonesArray.push(dataLength);
      for (let j = 0x0; j < dataLength; j++) {
        bonesArray.push(this.readInt(!![]));
        bonesArray.push(this.readFloat() * this.scale);
        bonesArray.push(this.readFloat() * this.scale);
        bonesArray.push(this.readFloat());
      }
    }
    return bonesArray;
  },
  readFloatArray: function (length, scale) {
    let array = new Array(length);
    if (scale == 0x1) {
      for (let i = 0x0; i < length; i++) {
        array[i] = this.readFloat();
      }
    } else {
      for (let i = 0x0; i < length; i++) {
        array[i] = this.readFloat() * scale;
      }
    }
    return array;
  },
  readShortArray: function () {
    let n = this.readInt(!![]);
    let array = new Array(n);
    for (let i = 0x0; i < n; i++) {
      array[i] = this.readShort();
    }
    return array;
  },
  readIntArray: function () {
    let n = this.readInt(!![]);
    let array = new Array(n);
    for (let i = 0x0; i < n; i++)
      array[i] = this.readInt(!![]);
    return array;
  },
  readHex: function () {
    let hex = this.readByte().toString(0x10);
    return hex.length == 0x2 ? hex : '0' + hex;
  },
  readColor: function () {
    return this.readHex() + this.readHex() + this.readHex() + this.readHex();
  },
  readString: function () {
    let charCount = this.readInt(this, !![]);
    switch (charCount) {
    case 0x0:
      return null;
    case 0x1:
      return '';
    }
    charCount--;
    this.chars = '';
    let charIndex = 0x0;
    for (let i = 0x0; i < charCount;) {
      charIndex = this.readByte();
      switch (charIndex >> 0x4) {
      case 0xc:
      case 0xd:
        this.chars += String.fromCharCode((charIndex & 0x1f) << 0x6 | this.readByte() & 0x3f);
        i += 0x2;
        break;
      case 0xe:
        this.chars += String.fromCharCode((charIndex & 0xf) << 0xc | (this.readByte() & 0x3f) << 0x6 | this.readByte() & 0x3f);
        i += 0x3;
        break;
      default:
        this.chars += String.fromCharCode(charIndex);
        i++;
      }
    }
    return this.chars;
  },
  initJson: function () {
    this.json.skeleton = {};
    let skeleton = this.json.skeleton;
    skeleton.hash = this.readString();
    if (skeleton.hash.length == 0x0)
      skeleton.hash = null;
    skeleton.spine = this.readString();
    if (skeleton.spine.length == 0x0)
      skeleton.spine = null;
    skeleton.width = this.readFloat();
    skeleton.height = this.readFloat();
    let nonessential = this.readBoolean();
    if (nonessential) {
      skeleton.fps = this.readFloat();
      skeleton.images = this.readString();
      if (skeleton.images.length == 0x0)
        skeleton.images = null;
    }
    this.json.bones = new Array(this.readInt(!![]));
    let bones = this.json.bones;
    for (let i = 0x0; i < bones.length; i++) {
      let boneData = {};
      boneData.name = this.readString();
      boneData.parent = null;
      if (i != 0x0) {
        const nonessential = this.readInt(!![]);
        boneData.parent = bones[nonessential].name;
      }
      boneData.rotation = this.readFloat();
      boneData['x'] = this.readFloat() * this.scale;
      boneData['y'] = this.readFloat() * this.scale;
      boneData.scaleX = this.readFloat();
      boneData.scaleY = this.readFloat();
      boneData.shearX = this.readFloat();
      boneData.shearY = this.readFloat();
      boneData.length = this.readFloat() * this.scale;
      boneData.transform = TransformMode[this.readInt(!![])];
      if (nonessential) {
        boneData.color = this.readColor();
      }
      bones[i] = boneData;
    }
    this.json.slots = new Array(this.readInt(!![]));
    let slots = this.json.slots;
    for (let i = 0x0; i < slots.length; i++) {
      let slotData = {};
      slotData.name = this.readString();
      const boneData = this.json.bones[this.readInt(!![])];
      slotData.bone = boneData.name;
      slotData.color = this.readColor();
      slotData.attachment = this.readString();
      slotData.blend = BlendMode[this.readInt(!![])];
      slots[i] = slotData;
    }
    this.json['ik'] = new Array(this.readInt(!![]));
    let ik = this.json['ik'];
    for (let i = 0x0; i < ik.length; i++) {
      let ikConstraints = {};
      ikConstraints.name = this.readString();
      ikConstraints.order = this.readInt(!![]);
      ikConstraints.bones = new Array(this.readInt(!![]));
      for (let j = 0x0; j < ikConstraints.bones.length; j++) {
        ikConstraints.bones[j] = this.json.bones[this.readInt(!![])].name;
      }
      ikConstraints.target = this.json.bones[this.readInt(!![])].name;
      ikConstraints.mix = this.readFloat();
      ikConstraints.bendPositive = this.readByte() != 0xff;
      ik[i] = ikConstraints;
    }
    this.json.transform = new Array(this.readInt(!![]));
    let transform = this.json.transform;
    for (let i = 0x0; i < transform.length; i++) {
      let transformData = {};
      transformData.name = this.readString();
      transformData.order = this.readInt(!![]);
      const bones = new Array(this.readInt(!![]));
      for (let j = 0x0, len = bones.length; j < len; j++) {
        bones[j] = this.json.bones[this.readInt(!![])].name;
      }
      transformData.bones = bones;
      transformData.target = this.json.bones[this.readInt(!![])].name;
      transformData.rotation = this.readFloat();
      transformData['x'] = this.readFloat() * this.scale;
      transformData['y'] = this.readFloat() * this.scale;
      transformData.scaleX = this.readFloat();
      transformData.scaleY = this.readFloat();
      transformData.shearY = this.readFloat();
      transformData.rotateMix = this.readFloat();
      transformData.translateMix = this.readFloat();
      transformData.scaleMix = this.readFloat();
      transformData.shearMix = this.readFloat();
      transform[i] = transformData;
    }
    this.json.path = new Array(this.readInt(!![]));
    let path = this.json.path;
    for (let i = 0x0; i < path.length; i++) {
      let pathData = {};
      pathData.name = this.readString();
      pathData.order = this.readInt(!![]);
      pathData.bones = new Array(this.readInt(!![]));
      for (let j = 0x0, len = pathData.bones.length; j < len; j++) {
        pathData.bones[j] = this.json.bones[this.readInt(!![])].name;
      }
      pathData.target = this.json.slots[this.readInt(!![])].name;
      pathData.positionMode = PositionMode[this.readInt(!![])];
      pathData.spacingMode = SpacingMode[this.readInt(!![])];
      pathData.rotateMode = RotateMode[this.readInt(!![])];
      pathData.rotation = this.readFloat();
      pathData.position = this.readFloat();
      if (pathData.positionMode == 'fixed') {
        pathData.position *= this.scale;
      }
      pathData.spacing = this.readFloat();
      if (pathData.spacingMode == 'length' || pathData.spacingMode == 'fixed') {
        pathData.spacing *= this.scale;
      }
      pathData.rotateMix = this.readFloat();
      pathData.translateMix = this.readFloat();
      path[i] = pathData;
    }
    this.json.skins = {};
    this.json.skinsName = new Array();
    let skins = this.json.skins;
    let skinData = this.readSkin('default', nonessential);
    if (skinData != null) {
      skins.default = skinData;
      this.json.skinsName.push('default');
    }
    for (let i = 0x0, len = this.readInt(!![]); i < len; i++) {
      let skinName = this.readString();
      let skin = this.readSkin(skinName, nonessential);
      skins[skinName] = skin;
      this.json.skinsName.push(skinName);
    }
    this.json.events = [];
    this.json.eventsName = [];
    let events = this.json.events;
    for (let i = 0x0, len = this.readInt(!![]); i < len; i++) {
      let eventName = this.readString();
      let event = {};
      event.int = this.readInt(![]);
      event.float = this.readFloat();
      event.string = this.readString();
      events[eventName] = event;
      this.json.eventsName[i] = eventName;
    }
    this.json.animations = {};
    let animations = this.json.animations;
    for (let i = 0x0, len = this.readInt(!![]); i < len; i++) {
      let animationName = this.readString();
      let animation = this.readAnimation(animationName);
      animations[animationName] = animation;
    }
  },
  readSkin(slotIndex, nonessential) {
    let slotCount = this.readInt(!![]);
    if (slotCount == 0x0)
      return null;
    let skin = {};
    for (let i = 0x0; i < slotCount; i++) {
      const slotIndex = this.readInt(!![]);
      const slot = {};
      for (let j = 0x0, n = this.readInt(!![]); j < n; j++) {
        let name = this.readString();
        let attachment = this.readAttachment(name, nonessential);
        if (attachment != null) {
          slot[name] = attachment;
        }
      }
      skin[this.json.slots[slotIndex].name] = slot;
    }
    return skin;
  },
  readAttachment(attachmentName, nonessential) {
    let scale = this.scale;
    let name = this.readString();
    if (name == null)
      name = attachmentName;

    let path, n, region = {}, box = {}, mesh = {}, linkdeMesh = {};
    let array;
    let point = {};
    let clipping = {};


    switch (AttachmentType[this.readByte()]) {
    case 'region':
      path = this.readString();
      if (path == null)
        path = name;
      region.type = 'region';
      region.name = name;
      region.path = path.trim();
      region.rotation = this.readFloat();
      region['x'] = this.readFloat() * scale;
      region['y'] = this.readFloat() * scale;
      region.scaleX = this.readFloat();
      region.scaleY = this.readFloat();
      region.width = this.readFloat() * scale;
      region.height = this.readFloat() * scale;
      region.color = this.readColor();
      return region;
    case 'boundingbox':
      box.type = 'boundingbox';
      box.name = name;
      n = this.readInt(!![]);
      box.vertexCount = n;
      box.vertices = this.readVertices(n);
      if (this.nonessential) {
        box.color = this.readColor();
      }
      return box;
    case 'mesh':
      path = this.readString();
      if (path == null)
        path = name;
      mesh.type = 'mesh';
      mesh.name = name;
      mesh.path = path;
      mesh.color = this.readColor();
      n = this.readInt(!![]);
      mesh.uvs = this.readFloatArray(n << 0x1, 0x1);
      mesh.triangles = this.readShortArray();
      mesh.vertices = this.readVertices(n);
      mesh.hull = this.readInt(!![]) << 0x1;
      if (nonessential) {
        mesh.edges = this.readShortArray();
        mesh.width = this.readFloat() * scale;
        mesh.height = this.readFloat() * scale;
      }
      return mesh;
    case 'linkedmesh':
      path = this.readString();
      if (path == null)
        path = name;
      linkdeMesh.type = 'linkedmesh';
      linkdeMesh.name = name;
      linkdeMesh.path = path;
      linkdeMesh.color = this.readColor();
      linkdeMesh.skin = this.readString();
      linkdeMesh.parent = this.readString();
      linkdeMesh.deform = this.readBoolean();
      if (nonessential) {
        linkdeMesh.width = this.readFloat() * scale;
        linkdeMesh.height = this.readFloat() * scale;
      }
      return linkdeMesh;
    case 'path':
      path = {};
      path.type = 'path';
      path.name = name;
      path.closed = this.readBoolean();
      path.constantSpeed = this.readBoolean();
      n = this.readInt(!![]);
      path.vertexCount = n;
      path.vertices = this.readVertices(n);
      array = array = new Array(n / 0x3);
      for (let i = 0x0; i < array.length; i++) {
        array[i] = this.readFloat() * scale;
      }
      path.lengths = array;
      if (nonessential) {
        path.color = this.readColor();
      }
      return path;
    case 'point':
      point.type = 'point';
      point.name = name;
      point.rotation = this.readFloat();
      point['x'] = this.readFloat() * scale;
      point['y'] = this.readFloat() * scale;
      if (nonessential) {
        path.color = this.readColor();
      }
      return point;
    case 'clipping':
      clipping.type = 'clipping';
      clipping.name = name;
      clipping.end = this.readInt(!![]);
      n = this.readInt(!![]);
      clipping.vertexCount = n;
      clipping.vertices = this.readVertices(n);
      if (nonessential) {
        clipping.color = this.readColor();
      }
      return clipping;
    }
    return null;
  },
  readCurve(frameIndex, timeline) {
    let cx1, cy1, cx2, cy2;
    switch (this.readByte()) {
    case 0x0:
      timeline[frameIndex].curve = 'linear';
      break;
    case 0x1:
      timeline[frameIndex].curve = 'stepped';
      break;
    case 0x2:
      cx1 = this.readFloat();
      cy1 = this.readFloat();
      cx2 = this.readFloat();
      cy2 = this.readFloat();
      timeline[frameIndex].curve = [cx1, cy1, cx2, cy2];
    }
  },
  readAnimation(name) {
    let animation = {};
    let scale = this.scale;
    let duration = 0x0;
    let slots = {};
    for (let i = 0x0, nn = this.readInt(!![]); i < nn; i++) {
      let slotIndex = this.readInt(!![]);
      let slotMap = {};
      let timeCount = this.readInt(!![]);
      for (let ii = 0x0; ii < timeCount; ii++) {
        let timelineType = this.readByte();
        let frameCount = this.readInt(!![]);
        let timeline;
        switch (timelineType) {
        case 0x0:
          timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            let time = this.readFloat();
            let color = this.readString();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            timeline[frameIndex].name = color;
          }
          slotMap.attachment = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        case 0x1:
          timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            const time = this.readFloat();
            const color = this.readColor();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            timeline[frameIndex].color = color;
            if (frameIndex < frameCount - 0x1) {
              this.readCurve(frameIndex, timeline); //let curve 
            }
          }
          slotMap.color = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        case 0x2:
          timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            const time = this.readFloat();
            let lightColor = this.readColor();
            let darkColor = this.readColor();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            timeline[frameIndex].light = lightColor;
            timeline[frameIndex].dark = darkColor;
            if (frameIndex < frameCount - 0x1) {
              this.readCurve(frameIndex, timeline);// let curve
            }
          }
          slotMap.twoColor = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        }
      }
      slots[this.json.slots[slotIndex].name] = slotMap;
    }
    animation.slots = slots;
    let bones = {};
    for (let i = 0x0, n = this.readInt(!![]); i < n; i++) {
      let boneIndex = this.readInt(!![]);
      let boneMap = {};
      for (let ii = 0x0, nn = this.readInt(!![]); ii < nn; ii++) {
        const timelineType = this.readByte();
        const frameCount = this.readInt(!![]);
        let timeline;
        let timelineScale = 0x1;

        switch (timelineType) {
        case 0x0:
          timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            const time = this.readFloat();
            const tlangle = this.readFloat();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            timeline[frameIndex].angle = tlangle;
            if (frameIndex < frameCount - 0x1) {
              this.readCurve(frameIndex, timeline);
            }
          }
          boneMap.rotate = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        case 0x1:
        case 0x2:
        case 0x3:
          timeline = new Array(frameCount);
          if (timelineType == 0x1) {
            timelineScale = scale;
          }
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            let tltime = this.readFloat();
            let tlx = this.readFloat();
            let tly = this.readFloat();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = tltime;
            timeline[frameIndex]['x'] = tlx * timelineScale;
            timeline[frameIndex]['y'] = tly * timelineScale;
            if (frameIndex < frameCount - 0x1) {
              this.readCurve(frameIndex, timeline);
            }
          }
          if (timelineType == 0x1) {
            boneMap.translate = timeline;
          } else if (timelineType == 0x2) {
            boneMap.scale = timeline;
          } else {
            boneMap.shear = timeline;
          }
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        }
      }
      bones[this.json.bones[boneIndex].name] = boneMap;
    }
    animation.bones = bones;
    let ik = {};
    for (let i = 0x0, nn = this.readInt(!![]); i < nn; i++) {
      const ikIndex = this.readInt(!![]);
      const frameCount = this.readInt(!![]);
      const timeline = new Array(frameCount);
      for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
        const time = this.readFloat();
        const mix = this.readFloat();
        const bendPositive = this.readByte() != 0xff;
        timeline[frameIndex] = {};
        timeline[frameIndex].time = time;
        timeline[frameIndex].mix = mix;
        timeline[frameIndex].bendPositive = bendPositive;
        if (frameIndex < frameCount - 0x1) {
          this.readCurve(frameIndex, timeline);
        }
      }
      ik[this.json['ik'][ikIndex].name] = timeline;
      duration = Math.max(duration, timeline[frameCount - 0x1].time);
    }
    animation['ik'] = ik;
    let ffd = {};
    for (let i = 0x0, nn = this.readInt(!![]); i < nn; i++) {
      const slotIndex = this.readInt(!![]);
      const frameCount = this.readInt(!![]);
      const timeline = new Array(frameCount);
      for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
        timeline[frameIndex] = {};
        timeline[frameIndex].time = this.readFloat();
        timeline[frameIndex].rotateMix = this.readFloat();
        timeline[frameIndex].translateMix = this.readFloat();
        timeline[frameIndex].scaleMix = this.readFloat();
        timeline[frameIndex].shearMix = this.readFloat();
        if (frameIndex < frameCount - 0x1) {
          this.readCurve(frameIndex, timeline);
        }
      }
      ffd[this.json.transform[slotIndex].name] = timeline;
      duration = Math.max(duration, timeline[frameCount - 0x1].time);
    }
    animation.transform = ffd;

    let path = {};
    for (let i = 0x0, n = this.readInt(!![]); i < n; i++) {
      let pathOrder = this.readInt(!![]);
      let pathData = this.json.path[pathOrder];
      let data = {};
      for (let ii = 0x0, nn = this.readInt(!![]); ii < nn; ii++) {
        const timelineType = this.readByte();
        const frameCount = this.readInt(!![]);
        let timeline, time, timelineScale;
        switch (timelineType) {
        case 0x0:
        case 0x1:
          timeline = new Array(frameCount);
          timelineScale = 0x1;
          if (timelineType == 0x1) {
            if (pathData.spacingMode == 'length' || pathData.spacingMode == 'fixed') {
              timelineScale = this.scale;
            }
          } else {
            if (pathData.positionMode == 'fixed') {
              timelineScale = this.scale;
            }
          }
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            time = this.readFloat();
            let _0xebc795 = this.readFloat();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            if (timelineType == 0x0) {
              timeline[frameIndex].position = _0xebc795 * timelineScale;
            } else {
              timeline[frameIndex].spacing = _0xebc795 * timelineScale;
            }
            if (frameIndex < frameCount - 0x1)
              this.readCurve(frameIndex, timeline);
          }
          if (timelineType == 0x0) {
            data.position = timeline;
          } else {
            data.spacing = timeline;
          }
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        case 0x2:
          timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            time = this.readFloat();
            let _0x47f0f0 = this.readFloat();
            let _0x1bb1d7 = this.readFloat();
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            timeline[frameIndex].rotateMix = _0x47f0f0;
            timeline[frameIndex].translateMix = _0x1bb1d7;
            if (frameIndex < frameCount - 0x1)
              this.readCurve(frameIndex, timeline);
          }
          data.mix = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
          break;
        }
      }
      path[this.json.path[pathOrder].name] = data;
    }
    animation.paths = path;

    // 变量名可能不对
    let deform = {};
    for (let i = 0x0, n = this.readInt(!![]); i < n; i++) {
      let index = this.readInt(!![]);
      let skinName = this.json.skinsName[index];
      let deformData = {};
      for (let ii = 0x0, nn = this.readInt(!![]); ii < nn; ii++) {
        const slotIndex = this.readInt(!![]);
        const slot = this.json.slots[slotIndex];
        const attachment = {};
        for (let iii = 0x0, nnn = this.readInt(!![]); iii < nnn; iii++) {
          const name = this.readString();
          const frameCount = this.readInt(!![]);
          const timeline = new Array(frameCount);
          for (let frameIndex = 0x0; frameIndex < frameCount; frameIndex++) {
            const time = this.readFloat();
            const end = this.readInt(!![]);
            timeline[frameIndex] = {};
            timeline[frameIndex].time = time;
            if (end != 0x0) {
              let vertices = new Array(end);
              let start = this.readInt(!![]);
              if (this.scale == 0x1) {
                for (let i = 0x0; i < end; i++) {
                  vertices[i] = this.readFloat();
                }
              } else {
                for (let i = 0x0; i < end; i++) {
                  vertices[i] = this.readFloat() * this.scale;
                }
              }
              timeline[frameIndex].offset = start;
              timeline[frameIndex].vertices = vertices;
            }
            if (frameIndex < frameCount - 0x1)
              this.readCurve(frameIndex, timeline);
          }
          attachment[name] = timeline;
          duration = Math.max(duration, timeline[frameCount - 0x1].time);
        }
        deformData[slot.name] = attachment;
      }
      deform[skinName] = deformData;
    }
    animation.deform = deform;

    let drawOrderCount = this.readInt(!![]);
    if (drawOrderCount > 0x0) {
      let drawOrders = new Array(drawOrderCount);
      for (let i = 0x0; i < drawOrderCount; i++) {
        const drawOrderMap = {};
        const time = this.readFloat();
        const offsetCount = this.readInt(!![]);
        const offsets = new Array(offsetCount);
        for (let ii = 0x0; ii < offsetCount; ii++) {
          const offsetMap = {};
          const slotIndex = this.readInt(!![]);
          offsetMap.slot = this.json.slots[slotIndex].name;
          let dooffset = this.readInt(!![]);
          offsetMap.offset = dooffset;
          offsets[ii] = offsetMap;
        }
        drawOrderMap.offsets = offsets;
        drawOrderMap.time = time;
        drawOrders[i] = drawOrderMap;
      }
      duration = Math.max(duration, drawOrders[drawOrderCount - 0x1].time);
      animation.drawOrder = drawOrders;
    }
    let eventCount = this.readInt(!![]);
    if (eventCount > 0x0) {
      let events = new Array(eventCount);
      for (let i = 0x0; i < eventCount; i++) {
        const time = this.readFloat();
        const name = this.json.eventsName[this.readInt(!![])];
        const eventData = this.json.events[name];
        const e = {};
        e.name = name;
        e.int = this.readInt(![]);
        e.float = this.readFloat();
        e.string = this.readBoolean() ? this.readString() : eventData.string;
        e.time = time;
        events[i] = e;
      }
      duration = Math.max(duration, events[eventCount - 0x1].time);
      animation.events = events;
    }
    return animation;
  }
};

const skel2Json = binary => {
  const skel_bin = new SkeletonBinary();
  skel_bin.data = new Uint8Array(binary);
  skel_bin.initJson();
  return skel_bin.json;
};

export default skel2Json;
