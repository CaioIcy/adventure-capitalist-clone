import { Container, Sprite, Texture, filters } from 'pixi.js';
import { Background } from './Background';

export interface ManagerCellOptions {
    width: number;
    height: number;
    pad?: number;
}

export class ManagerCell extends Container {
    private background: Background;
    private managerSprite: Sprite;

    public constructor(options: ManagerCellOptions) {
        super();

        const { width, height } = options;
        const pad = options.pad || 4;

        this.background = new Background({
            tint: 0x000000,
            width,
            height,
            pad,
        });
        this.addChild(this.background);

        this.managerSprite = new Sprite(Texture.WHITE);
        this.managerSprite.x = pad;
        this.managerSprite.y = pad;
        this.managerSprite.width = width - 2*pad;
        this.managerSprite.height = height - 2*pad;
        this.addChild(this.managerSprite);
    }

    public setTexture(managerTexture: Texture): void {
        this.managerSprite.texture = managerTexture;
    }

    public enableGreyscaleFilter(enable: boolean): void {
        if(this.managerSprite.filters === null) {
            this.managerSprite.filters = [];
        }

        if(enable && this.managerSprite.filters.length > 0) {
            return; // enabled already
        }

        if(enable) {
            const filterGreyscale = new filters.ColorMatrixFilter();
            filterGreyscale.greyscale(0.25, false);
            filterGreyscale.enabled = true;
            this.managerSprite.filters = [filterGreyscale];
        } else {
            this.managerSprite.filters = [];
        }
    }

    public setClickCallback(action: ()=>void): void {
        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.removeAllListeners();
        this.background.on('pointerdown', action);
    }
}