import { Container, Sprite, Texture, filters } from 'pixi.js';

export class ManagerCell extends Container {
    private background: Sprite;
    private managerSprite: Sprite;

    public constructor() {
        super();

        const width = 64;
        const height = 64;

        this.background = new Sprite(Texture.WHITE);
        this.background.width = width;
        this.background.height = height;
        this.addChild(this.background);

        this.managerSprite = new Sprite(Texture.WHITE);
        this.managerSprite.width = width;
        this.managerSprite.height = height;
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