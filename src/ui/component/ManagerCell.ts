import { Container, Sprite, Texture, filters } from 'pixi.js';

export class ManagerCell extends Container {
    private managerSprite: Sprite;

    public constructor() {
        super();

        this.managerSprite = new Sprite(Texture.WHITE);
        this.managerSprite.width = 64;
        this.managerSprite.height = 64;
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
}