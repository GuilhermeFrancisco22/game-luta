const gravity = 0.6;

const floorHeight = 96;

const backgroundSpritesPath = "../assets/background/placeholder.png";
const defautObjectSpritePath = "../assetes/objects/square.svg";

class Sprite {
  constructor({ position, velocity, source, scale, offset, sprites }) {
    this.position = position;
    this.velocity = velocity;

    this.scale = scale || 1;
    this.image = new Image();
    this.image.src = source || defautObjectSpritePath;

    this.width = this.image.width * this.scale;
    this.height = this.image.height * this.scale;

    this.offset = offset || {
      x: 0,
      y: 0,
    };

    this.sprites = sprites || {
      idle: {
        src: this.image.src,
        totalSpriteFrames: 1,
        framesPerSpritesFrames: 1,
      },
    };

    this.currentSprite = this.sprites.idle;
    this.elapsedTime = 0;
    this.currentSpriteFrame = 0;
    this.totalSpriteFrames = this.sprites.idle.totalSpriteFrames;
    this.framesPerSpritesFrames = this.sprites.idle.framesPerSpritesFrames;
  }

  setSprite(sprite) {
    this.currentSprite = this.sprites[sprite];

    if (!this.currentSprite) {
      this.currentSprite = this.sprites.idle;
    }
  }

  loadSprite(sprite) {
    let previousSprite = this.image.src;

    this.image = new Image();
    this.image.src = this.currentSprite.src;
    this.width = this.image.width * this.scale;
    this.height = this.image.height * this.scale;

    this.totalSpriteFrames = this.currentSprite.totalSpriteFrames;
    this.framesPerSpritesFrames = this.currentSprite.framesPerSpritesFrames;

    let newSprite = this.image.src;

    if (previousSprite !== newSprite) {
      let previousSpriteImage = new Image();
      previousSpriteImage.src = previousSprite;

      this.position.y +=
        (previousSpriteImage.height - this.image.height) * this.scale;
    }
  }

  draw() {
    ctx.imageSmoothingEnabled = false;

    const xScale = this.facing === "left" ? -1 : 1;

    ctx.save();
    ctx.translate(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y
    );
    ctx.scale(xScale, 1);

    ctx.drawImage(
      this.image,
      (this.currentSpriteFrame * this.image.width) / this.totalSpriteFrames,
      0,
      this.image.width / this.totalSpriteFrames,
      this.image.height,
      0,
      0,
      (this.width / this.totalSpriteFrames) * xScale,
      this.height
    );
    ctx.restore();
  }

  animate() {
    this.elapsedTime++;

    if (this.elapsedTime >= this.framesPerSpritesFrames) {
      this.currentSpriteFrame++;
      if (this.currentSpriteFrame >= this.totalSpriteFrames) {
        this.currentSpriteFrame = 0;
      }

      this.elapsedTime = 0;
    }
  }

  update() {
    this.draw();
  }
}

class Fighter extends Sprite {
  constructor({ position, velocity, scale, sprites }) {
    super({
      position,
      velocity,
      scale,
      sprites,
    });
    this.velocity = velocity;

    this.isAttacking;
    this.attackCooldown = 500;
    this.onAttackCooldown;

    this.lastKeyPressed;
    this.onBround;
  }

  gravity() {
    if (
      Math.ceil(this.position.y + this.height >= canvas.height - floorHeight)
    ) {
      this.onBround = true;
    } else {
      this.onBround = false;
    }

    if (this.position.y + this.height > canvas.height - floorHeight) {
      this.position.y = canvas.height - this.height - floorHeight;
      this.velocity.y = 0;
    } else {
      if (!this.onBround) this.velocity.y += gravity;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  update() {
    this.gravity();
    this.loadSprite();
    this.draw();
    this.animate();
  }

  attack() {
    if (this.onAttackCooldown) return;
    this.isAttacking = true;
    this.onAttackCooldown = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 300);

    setTimeout(() => {
      this.onAttackCooldown = false;
    }, this.attackCooldown);
  }

  jump() {
    if (!this.onBround) return;
    this.velocity.y = -16;
  }
}

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  scale: 4,
  sprites: {
    idle: {
      src: "../assets/player/idle.png",
      totalSpriteFrames: 11,
      framesPerSpritesFrames: 16,
    },
    running: {
      src: "../assets/player/running.png",
      totalSpriteFrames: 10,
      framesPerSpritesFrames: 8,
    },
    jumping: {
      src: "../assets/player/jumping.png",
      totalSpriteFrames: 4,
      framesPerSpritesFrames: 8,
    },
    attacking: {
      src: "../assets/player/attacking.png",
      totalSpriteFrames: 7,
      framesPerSpritesFrames: 8,
    },
  },
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  source: backgroundSpritesPath,
});
