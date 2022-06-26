/* global createjs */
import _ from "lodash";
import alertEvent from "../alert/alertEvent";
import tooltipEvent from "../tool-tip/tooltipEvent";
import config from "./config.json";

export default class CanvasManager {
  // Setup methods
  constructor(canvas, data = {}) {
    this.canvas = canvas;
    this.data = _.get(data, "lineList", []);
    this.meta = _.get(data, "meta", {});
    this.postLine = _.get(data, "actions.postLine", Promise.resolve);

    if (_.isEmpty(this.meta)) throw new Error("User is not authenticated.");

    this.stage = getStage(canvas);
    this.setupCanvas();

    // action event listeners
    this.shape = null;
  }

  setupCanvas() {
    // Completely clear the canvas
    this.stage.clear();
    this.stage.removeAllChildren();
    this.stage.update();

    // Add all the existing data
    this.data.forEach((line) => {
      const { x1, y1, x2, y2, addressInfo, createdAt } = line;
      const shape = getShape(
        this.canvas,
        x1,
        y1,
        x2,
        y2,
        {
          walletId: addressInfo.address,
          createdAt,
        },
        this.stage
      );
      this.stage.addChild(shape);
    });

    this.stage.update();
  }

  // Interaction methods
  async actionStart(event) {
    if (this.shape !== null) return;
    const { stageX: x, stageY: y } = event;

    this.shape = getShape(
      this.canvas,
      x,
      y,
      undefined,
      undefined,
      { ...this.meta, createdAt: new Date().toJSON() },
      this.stage,
      false
    );
    this.stage.addChild(this.shape);
    this.stage.update();
  }

  async actionPreview(event) {
    if (this.shape == null) return;
    const { stageX: x, stageY: y } = event;

    this.stage.clear();
    this.shape.__endAt(x, y);
    this.stage.update();
  }

  async actionEnd(event) {
    if (this.shape == null) return;

    const shape = this.shape;
    const reject = () => {
      shape.graphics.clear();
      this.stage.removeChild(shape);
      this.stage.clear();
      this.stage.update();
      this.shape = null;
    };

    const { stageX: x, stageY: y } = event;

    const length = Math.sqrt(
      Math.pow(shape.__x2 - shape.__x1, 2) +
        Math.pow(shape.__y2 - shape.__y1, 2)
    );
    if (!length || length < 2) {
      reject();
      return false;
    }

    if (!this.isAllowed) {
      reject();
      this.showTouchNotAllowed();
      return false;
    }

    this.stage.clear();
    this.shape.__endAt(x, y);
    this.stage.update();
    this.shape = null;

    await alertEvent({
      type: "primary",
      title: "Would you like to confirm?",
      message: "This change is irreversible you know 🎃",
      acceptButtonText: "I am sure",
      onAccept: async () => {
        const updateData = {
          x1: shape.__x1,
          y1: shape.__y1,
          x2: shape.__x2,
          y2: shape.__y2,
          addressInfo: { address: shape.__meta.walletId },
        };

        this.data.push({
          ...updateData,
          createdAt: shape.__meta.createdAt,
        });

        this.postLine(updateData)
          .then(async (response) => {
            if (!response.status) throw new Error("Something went wrong");
            await alertEvent({
              type: "primary",
              title: "Congratulations 🎉",
            });
            this.isAllowed = false;
          })
          .catch((err) => {
            console.error(err);
            reject();
          });
      },
      rejectButtonText: "Lemme redo",
      onReject: () => {
        reject();
      },
    });

    delete this.shape;
    this.shape = null;
  }

  // Enable / disable

  enable() {
    this.stage.enableDOMEvents(true);

    // Common actions to fix bad actions
    const actionStart = this.actionStart.bind(this);
    const actionPreview = this.actionPreview.bind(this);
    const actionEnd = this.actionEnd.bind(this);
    const stage = this.stage;

    // Desktop events
    stage.addEventListener("stagemousedown", actionStart);
    stage.addEventListener("stagemousemove", actionPreview);
    stage.addEventListener("stagemouseup", actionEnd);

    // Mouse events
    stage.addEventListener("stagetouchstart", actionStart);
    stage.addEventListener("stagetouchmove", actionPreview);
    stage.addEventListener("stagetouchend", actionEnd);
  }

  disable() {
    this.stage.enableDOMEvents(false);

    // Common actions to fix bad actions
    const actionStart = this.actionStart.bind(this);
    const actionPreview = this.actionPreview.bind(this);
    const actionEnd = this.actionEnd.bind(this);
    const stage = this.stage;

    // Desktop events
    stage.removeEventListener("stagemousedown", actionStart);
    stage.removeEventListener("stagemousemove", actionPreview);
    stage.removeEventListener("stagemouseup", actionEnd);

    // Mouse events
    stage.removeEventListener("stagetouchstart", actionStart);
    stage.removeEventListener("stagetouchmove", actionPreview);
    stage.removeEventListener("stagetouchend", actionEnd);
  }

  async showTouchNotAllowed() {
    if (this.isCompleted) {
      await alertEvent({
        type: "primary",
        title: "This canvas has ended",
        message: "Follow our social for a headsup on when we go live next 😃",
        acceptButtonText: "Okie dokie",
      });
    } else if (this.isLoggedIn) {
      await alertEvent({
        type: "primary",
        title: "You are already a part of this blacklines",
        message: "Keep an eye out for when the the canvas goes live 😃",
        acceptButtonText: "Okie dokie",
      });
    }
  }

  // Updates
  async update(lineData, walletId) {
    const { x1, y1, x2, y2, addressInfo, createdAt } = lineData;
    if (addressInfo.address === walletId) return;

    const wrapper = createjs.Ticker.on("tick", this.stage);
    const shape = getShape(
      this.canvas,
      x1,
      y1,
      undefined,
      undefined,
      {
        walletId: addressInfo.address,
        createdAt,
      },
      this.stage,
      false
    );

    const line = this.stage.addChild(shape);
    const cmd = line.graphics.lineTo(x1, y1).command;
    createjs.Tween.get(cmd, { loop: false }).to({ x: x2, y: y2 }, 1000);

    setTimeout(() => {
      createjs.Ticker.off("tick", wrapper);
      this.data.push({
        x1,
        y1,
        x2,
        y2,
        addressInfo,
        createdAt: shape.__meta.createdAt,
      });
      shape.__endAt(x2, y2);
    }, 1000);
  }
}

/**
 *  This method is called to create a custom stage
 * @param {*} canvas The canvas element to assign in the stage
 * @returns
 */
const getStage = (canvas) => {
  const stage = new createjs.Stage(canvas);

  stage.enableMouseOver();
  createjs.Touch.enable(stage);

  return stage;
};

const getShape = (canvas, x1, y1, x2, y2, meta, stage, shouldScale = true) => {
  const shape = new createjs.Shape();
  const scaleFactor = shouldScale ? canvas.width / config.length : 1;
  shape.graphics.clear();
  shape.cursor = "pointer";
  addShapeEventListener(shape, stage, canvas);

  if (!_.isNil(meta)) {
    shape.__meta = meta;
  }

  if (!_.isNil(x1) && !_.isNil(y1)) {
    shape.graphics.setStrokeStyle(1, "round").beginStroke(config.color);
    shape.graphics.moveTo(x1 * scaleFactor, y1 * scaleFactor);
  }

  if (!_.isNil(x2) && !_.isNil(y2)) {
    shape.graphics.lineTo(x2 * scaleFactor, y2 * scaleFactor);
    shape.graphics.endStroke();
  }

  const reverseScaleFactor = shouldScale ? 1 : config.length / canvas.width;
  // Custom methods
  shape.__x1 = x1 * reverseScaleFactor;
  shape.__y1 = y1 * reverseScaleFactor;
  shape.__x2 = x2 * reverseScaleFactor;
  shape.__y2 = y2 * reverseScaleFactor;

  shape.__endAt = (x2, y2) => {
    shape.graphics.clear();

    shape.graphics.beginStroke(config.color);
    shape.graphics.moveTo(x1 * scaleFactor, y1 * scaleFactor);
    shape.graphics.lineTo(x2 * scaleFactor, y2 * scaleFactor);
    shape.graphics.endStroke();

    shape.__x2 = x2 * reverseScaleFactor;
    shape.__y2 = y2 * reverseScaleFactor;
    return true;
  };

  return shape;
};

const addShapeEventListener = (shape, stage, canvas) => {
  shape.addEventListener("mouseover", async (event) => {
    if (event.nativeEvent.buttons) return;
    const scaleFactor = canvas.width / config.length;

    const target = event.target;
    stage.tick();
    // Draw the target now with a highlight instead
    target.graphics
      .clear()
      .setStrokeStyle(1, "round")
      .beginStroke("red")
      .moveTo(shape.__x1 * scaleFactor, shape.__y1 * scaleFactor)
      .lineTo(shape.__x2 * scaleFactor, shape.__y2 * scaleFactor)
      .endStroke();

    const { clientX: x, clientY: y } = event.nativeEvent;
    shape.__selected = true;

    stage.update();

    await tooltipEvent({
      isClosed: false,
      event: { x, y },
      lines: [shape],
    });
  });

  shape.addEventListener("mouseout", async (event) => {
    if (!shape.__selected) return;
    const scaleFactor = canvas.width / config.length;

    const target = event.target;

    target.graphics
      .clear()
      .setStrokeStyle(1, "round")
      .beginStroke(config.color)
      .moveTo(shape.__x1 * scaleFactor, shape.__y1 * scaleFactor)
      .lineTo(shape.__x2 * scaleFactor, shape.__y2 * scaleFactor)
      .endStroke();

    stage.update();

    await tooltipEvent({
      isClosed: true,
    });

    // shape.nextTick = false;
    shape.__selected = false;
  });
};
