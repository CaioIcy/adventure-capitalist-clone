import { Container, Text, Sprite, Texture } from 'pixi.js';
import { TextUtil } from '../util/TextUtil';

export class Button extends Container {
    private text: Text;

    public constructor(label: string, action: () => void) {
        super();

        this.text = new Text(`[${label}]`, TextUtil.defaultStyle());
        const background = new Sprite(Texture.WHITE);
        background.width = this.width;
        background.height = this.height;

        this.addChild(background);
        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', action);
    }
}
