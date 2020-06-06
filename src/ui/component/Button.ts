import { Container, Text, Sprite } from 'pixi.js';
import { TextureUtil } from '../../util/TextureUtil';

export class Button extends Container {
    private text: Text;

    public constructor(label: string, action: () => void) {
        super();

        this.text = new Text(`[${label}]`);
        const background = new Sprite(TextureUtil.createTexture('#FFFFFF'));
        background.width = this.width;
        background.height = this.height;

        this.addChild(background);
        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', action);
    }
}
